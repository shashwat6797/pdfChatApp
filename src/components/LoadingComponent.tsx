"use client";
import React from "react";
import { motion } from "framer-motion";
import panelImg from "../../../public/PDF_PANEL.png";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";

const imageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, delay: 1.5 } },
};

const LoadingComponent = () => (
  <motion.div
    variants={imageVariants}
    initial="hidden"
    animate="visible"
    className="flex flex-col items-center justify-between"
  >
    <p className="max-w-xl sm:text-5xl sm:max-w-xl mb-5 px-5 text-lg text-slate-600">
      Join to instantly answer questions and understand research with AI
    </p>
    <motion.div
      className="overflow-hidden rounded-lg shadow-lg"
      variants={imageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.img
        src="/PDF_PANEL.png"
        alt="Description of the image"
        className="w-full h-auto object-cover rounded-lg shadow-lg"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      />
    </motion.div>
    <div className="flex mt-8 justify-center flex-col md:flex-row gap-2 md:gap-5 items-center mt-5">
      <div className="flex text-center font-bebas_neue text-2xl sm:text-3xl font-semibold">
        Login to get Started!
      </div>
      <Link href={"/sign-in"}>
        <div className="flex items-center h-25 w-25 bg-blue-600 p-3 rounded-full hover:scale-110 ease-in duration-200 active:bg-blue-700 text-white">
          <LogIn className="white" />
        </div>
      </Link>
    </div>
  </motion.div>
);

export default LoadingComponent;
