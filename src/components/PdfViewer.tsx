import React from "react";

type Props = {
  pdfUrl: string;
};

const PdfViewer = ({ pdfUrl }: Props) => {
  const url = `https://docs.google.com/gview?url=${pdfUrl}&embedded=true`;
  return <iframe src={pdfUrl} className="w-full h-full"></iframe>;
};

export default PdfViewer;
