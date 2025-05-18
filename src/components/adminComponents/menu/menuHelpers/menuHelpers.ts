import { MenuFormData } from "./schemas/createProductSchema";

export function formatMenuFormData(data: MenuFormData): FormData {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", data.price.toString());
  formData.append("available", data.available.toString());
  formData.append("category", data.category.toString());

  if (data.imageFile && data.imageFile[0]) {
    formData.append("imageFile", data.imageFile[0]);
  }

  data.details.forEach((detail, index) => {
    formData.append(`details[${index}]`, detail);
  });

  return formData;
}
