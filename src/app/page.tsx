'use client'

// import {Amplify} from 'aws-amplify';
// import awsmobile from '../aws-exports';

// Amplify.configure(awsmobile);

import styles from "./page.module.css";

import Hero from "@/components/Hero";
import ImageUpload from "@/components/ImageUpload";
import ImageGallery from "@/components/ImageGallery";
import { useState } from "react";

export default function Home() {

  const [uploadingState, setUploadingState] = useState(false);

  return (
    <div>
        <Hero />
        <ImageUpload uploadingState={uploadingState} setUploadingState={setUploadingState}/>
        <ImageGallery uploadingState={uploadingState} setUploadingState={setUploadingState}/>
    </div>
  );
}
