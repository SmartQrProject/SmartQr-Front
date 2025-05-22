const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function uploadImage(file: File, token: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${APIURL}/cloudinary/uploadImage`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error uploading image');
  }

  return await response.text();
}
