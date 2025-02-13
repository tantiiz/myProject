"use client"
import React, { useEffect, useRef, useState } from 'react';

const Upload: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const placeRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://docs.opencv.org/4.7.0/opencv.js';
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://cdn.jsdelivr.net/gh/ColonelParrot/jscanify@master/src/jscanify.min.js';
    script2.async = true;
    document.body.appendChild(script2);

    script1.onload = () => {
      script2.onload = () => {
        (window as any).cv.onRuntimeInitialized = () => {
          const scan = () => {
            const scanner = new (window as any).jscanify();
            const scanned = scanner.extractPaper(imageRef.current, 386, 500);
            document.body.appendChild(scanned);
          };

          if (imageRef.current) {
            imageRef.current.onload = scan;

            if (imageRef.current.complete) {
              scan();
            }
          }
        };
      };
    };

    const handleButtonClick = () => {
      const paperHeight = 1000;
      const scanner = new (window as any).jscanify();
      const highlightedCanvas = scanner.highlightPaper(imageRef.current);
      placeRef.current?.appendChild(highlightedCanvas);
      const resultCanvas2 = scanner.extractPaper(imageRef.current, 386, paperHeight);
      placeRef.current?.appendChild(resultCanvas2);
    };

    if (buttonRef.current) {
      buttonRef.current.addEventListener('click', handleButtonClick);
    }

    return () => {
      if (buttonRef.current) {
        buttonRef.current.removeEventListener('click', handleButtonClick);
      }
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imageSrc && (
        <img
          src={imageSrc}
          crossOrigin="anonymous"
          ref={imageRef}
          id="image"
          alt="uploaded"
        />
      )}
      <div ref={placeRef}></div>
      <button ref={buttonRef}>Scan</button>
    </div>
  );
};

export default Upload;