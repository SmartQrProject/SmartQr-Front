'use client';

import { useState } from 'react';
import { PencilIcon, UploadIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

declare global {
  interface Window {
    cloudinary: any;
  }
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function EditableBannerWidget() {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  const openWidget = () => {
    if (!window.cloudinary) {
      toast.error('Cloudinary widget not loaded.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        cropping: true,
        croppingAspectRatio: 3 / 1,
        folder: 'banners',
        multiple: false,
        resourceType: 'image',
        showCompletedButton: true,
        styles: {
          palette: {
            window: '#ffffff',
            sourceBg: '#f4f4f5',
            windowBorder: '#ccc',
            tabIcon: '#000',
            menuIcons: '#000',
            textDark: '#000000',
            textLight: '#ffffff',
            link: '#0f172a',
            action: '#6366f1',
            inactiveTabIcon: '#ccc',
            error: '#e11d48',
            inProgress: '#6366f1',
            complete: '#10b981',
            progress: '#6366f1',
          },
        },
      },
      (error: any, result: any) => {
        if (!error && result.event === 'success') {
          setBannerUrl(result.info.secure_url);
          toast.success('Banner uploaded successfully!');
        }
      }
    );

    widget.open();
  };

  return (
    <div className="w-full h-[33vh] sm:h-[40vh] md:h-[50vh] bg-gray-100 relative ">
      {bannerUrl ? (
        <div className="relative w-full h-full">
          <img
            src={bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <button
            onClick={openWidget}
            className="absolute top-2 right-2 bg-white/80 text-lg font-semibold px-3 py-3 rounded-lg  hover:bg-white mt-5 mr-5 flex gap-3 cursor-pointer "
          >
            <PencilIcon /> Edit Banner
          </button>
        </div>
      ) : (
        <button
          onClick={openWidget}
          className="w-full h-full flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
        >
          <UploadIcon className="mr-2" />
          Upload banner
        </button>
      )}
    </div>
  );
}
