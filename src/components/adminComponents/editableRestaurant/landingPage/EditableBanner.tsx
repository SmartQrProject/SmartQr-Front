"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/utils/cropImg";
import { toast } from "react-hot-toast";
import { PencilIcon } from "lucide-react";
import imageCompression from "browser-image-compression";
import { getRestaurantWithMenu } from "@/helper/restaurantsSlugFetch";

interface EditableBannerCropProps {
  title: string;
  initialBanner?: string;
  slug: string;
  token: string;
}

export default function EditableBannerHero({
  title,
  initialBanner,
  slug,
  token,
}: EditableBannerCropProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(initialBanner ?? null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const rawBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([rawBlob], "cropped.jpg", { type: rawBlob.type });
      const compressedBlob = await imageCompression(file, {
        maxSizeMB: 0.15,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });

      const formData = new FormData();
      formData.append("file", compressedBlob);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      formData.append("folder", "banners");

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();

      if (!token || !slug) throw new Error("User token or slug is missing");

      const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          banner: data.secure_url,
        }),
      });

      if (!updateRes.ok) throw new Error("Failed to update restaurant banner");

      toast.success("Banner updated successfully!");
      setImageSrc(null);

      const updated = await getRestaurantWithMenu(slug);
      if (updated?.banner) {
        setBannerUrl(updated.banner);
      }
    } catch (err: any) {
      toast.error("Error uploading image: " + err.message);
    }
  };

  useEffect(() => {
    if (initialBanner) {
      setBannerUrl(initialBanner);
    }
  }, [initialBanner]);

  return (
    <div className="relative w-full min-h-[250px] sm:min-h-[300px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      {bannerUrl && (
        <img
          src={bannerUrl}
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/50 z-10" />
      <h1 className="relative z-20 text-white text-2xl sm:text-4xl md:text-5xl font-bold text-center px-4">
        {title}
      </h1>
      <button
        onClick={() => inputRef.current?.click()}
        className="absolute top-4 right-4 z-30 bg-white/80 text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white flex items-center gap-2 cursor-pointer"
      >
        <PencilIcon className="w-4 h-4" />
        Edit Banner
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
          }
        }}
      />

      {imageSrc && (
        <div className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-[3/1] md:aspect-[3/1]">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={3 / 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="w-full max-w-md mt-2 flex  items-center gap-2 bg-white p-2 rounded shadow">
            <label className="text-sm font-medium">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex sm:flex-row gap-2 mt-2 w-full">
              <button
                onClick={handleSave}
                className="bg-branding-600 text-white px-4 py-2 rounded hover:bg-branding-500 w-full sm:w-auto cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => setImageSrc(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full sm:w-auto cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
