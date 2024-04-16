"use client";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Inbox, Loader2 } from "lucide-react";
import { storage } from "../../lib/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { metadata } from "@/app/layout";

export default function UploadFile() {
  const [uploading, setUploading] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: async (file_name: String) => {
      const response = await axios.post("/api/create-chat", {
        file_name,
      });
      return response.data;
    },
  });

  const [downloadUrl, setDownloadURL] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: (acceptedFile) => {
      console.log(acceptedFile);
      const file = acceptedFile[0];
      const name = file.name;
      console.log({ file: file, name: file.name });
      const storageRef = ref(storage, `images/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, acceptedFile[0]);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
          setUploading(true);
        },
        (error) => {
          alert("Error: " + error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log("File available at", url);
            setDownloadURL(url);
          });
          getMetadata(uploadTask.snapshot.ref).then((metadata) => {
            const data = metadata.name;
            console.log({ metadata_name: data });
            mutate(data, {
              onSuccess: (data) => {
                console.log({ mutate: data });
                setUploading(false);
              },
              onError: (err) => {
                console.error("Error creating Chat");
                console.error(err);
                setUploading(false);
              },
            });
          });
        },
      );
    },
  });

  return (
    <div className="p-2 border-red border-4 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isLoading ? (
          <>
            <Loader2 className=" h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-500">spilling tea to gpt</p>
          </>
        ) : (
          <>
            <Inbox className="text-blue-500 w-10 h-10" />
            <p className="mt-2 text-sm text-slate-500">Drag & Drop PDF here.</p>
          </>
        )}
      </div>
    </div>
  );
}
