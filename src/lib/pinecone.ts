import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromFirebase } from "../lib/firebase-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { convertToAscii } from "./utils";

const getDocs = async (path: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const loader = new PDFLoader(path);
      const docs = (await loader.load()) as PDFPage[];
      !!docs ? resolve(docs) : reject("error in fetching docs");
    }, 3000);
  });
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: {
      pageNumber: number;
    };
  };
};

export async function loadFirebaseIntoPinecone(fileKey: string) {
  //1. Download PDF and read from pdf
  var path: string = "";
  path = await downloadFromFirebase(fileKey);
  const pages = (await getDocs(path)) as PDFPage[];

  // 2. Split and Segment the PDF into pages
  const documents = await Promise.all(pages.map(prepareDocument));

  console.log("documents.flat() : ", documents.flat());

  //3. Vectorise and embed individual documents
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  //4. Upload to pinecone
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pc.index("chat-pdf");
  const name = convertToAscii(fileKey);
  console.log("name : ", name);
  const namespace = index.namespace(name);

  try {
    await namespace.upsert(vectors);
    console.log("Upsert Successful");
    return vectors;
  } catch (e) {
    console.log("Error in upserting to pinecone : ", e);
    return pages;
  }
}

function getArrayFromEmbeddings(embeddings) {
  const data = embeddings.data;
  const dataArray = Object.values(data) as Array<Number>;
  return dataArray;
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const value: Array<Number> = getArrayFromEmbeddings(embeddings);
    console.log("got embeddings");
    const hash = md5(doc.pageContent);
    return {
      id: hash,
      values: value,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("Error embedding the docs " + error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  //split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}
