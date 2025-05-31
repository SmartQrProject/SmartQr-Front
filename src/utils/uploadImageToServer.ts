import imageCompression from "browser-image-compression";

export const uploadImageToServer = async (file: File): Promise<string | null> => {
  try {
    // 1. Comprimir imagen
    const compressedBlob = await imageCompression(file, {
      maxSizeMB: 0.15,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    });

    // 2. Armar FormData para Cloudinary
    const formData = new FormData();
    formData.append("file", compressedBlob);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    formData.append("folder", "customers"); // Puedes cambiar "customers" por la carpeta que necesites

    // 3. Subir a Cloudinary
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json();

    // 4. Retornar URL segura de Cloudinary
    return data.secure_url as string;
  } catch (err: any) {
    console.error("Error uploading image:", err.message);
    return null;
  }
};
