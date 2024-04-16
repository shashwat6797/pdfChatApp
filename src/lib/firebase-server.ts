import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";
import Fs from "fs";
import Path from "path";
import Axios from "axios";

export async function downloadFromFirebase(file_name: string) {
  let downloadUrl: string;
  const pdfFolder = Path.join(process.cwd(), `pdfs`);
  const path: string = Path.join(pdfFolder, `${file_name}`);
  const starsRef = ref(storage, `images/${file_name}`);
  downloadUrl = await getDownloadURL(starsRef);
  var response = await Axios({
    method: "GET",
    url: downloadUrl,
    responseType: "stream",
  });
  await response.data.pipe(Fs.createWriteStream(path));
  return path;
}
