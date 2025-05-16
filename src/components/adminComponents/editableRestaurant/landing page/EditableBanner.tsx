'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/utils/cropImg';
import { Area } from 'react-easy-crop';
import { UploadIcon } from 'lucide-react';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

export default function EditableBanner() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [zoom, setZoom] = useState(1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const onCropComplete = useCallback((_: any, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

    const formData = new FormData();
    formData.append('file', croppedBlob);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'drafts');

    const res = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setBannerUrl(data.secure_url);
    setImageSrc(null);
    alert('Image saved successfully!');
  };

  return (
    <div className="w-full h-[33vh] sm:h-[40vh] md:h-[50vh] bg-gray-100 relative">
        {!imageSrc && bannerUrl ? (
            <img src={bannerUrl} className="w-full h-full object-cover" alt="Banner" />
        ) : !imageSrc ? (

        <div
          {...getRootProps()}
          className="w-full h-[33vh] sm:h-[40vh] md:h-[50vh] flex items-center justify-center border border-dashed border-gray-400 cursor-pointer"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the image here...</p>
          ) : (
            <p className='flex items-center gap-3'> <UploadIcon/>Click or drag an image to upload your banner</p>
          )}
        </div>
        ) : (
        <div className="relative w-full h-[300px] bg-neutral-200 opacity-85">
            <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={3 / 1}
                onZoomChange={setZoom}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                cropShape="rect"
                showGrid={false}
            />
            <div className="absolute bottom-2 left-2 flex gap-2">
                <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                />
                <button
                onClick={handleSave}
                className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
                >
                Save changes
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
