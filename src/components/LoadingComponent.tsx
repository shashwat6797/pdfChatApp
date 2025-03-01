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
    className="flex flex-col items-center gap-2"
  >
    <p className="max-w-xl sm:max-w-sm mt-1 px-5 text-lg text-slate-600">
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
    <div className="flex justify-center flex-col gap-2 items-center">
      <p className="font-bebas_neue text-2xl font-semibold">
        Login to get Started!
      </p>
      <Link href={"/sign-in"}>
        <Button>
          <LogIn className="w-7 h-7" />
        </Button>
      </Link>
    </div>
  </motion.div>
);

export default LoadingComponent;
