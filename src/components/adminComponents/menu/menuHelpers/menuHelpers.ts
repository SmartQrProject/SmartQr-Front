// import { ProductFormData } from "./schemas/createProductSchema";

// export function formatMenuFormData(data: ProductFormData): FormData {
//   const formData = new FormData();

//   formData.append("name", data.name);
//   formData.append("description", data.description);
//   formData.append("price", data.price.toString());
//   formData.append("available", data.available.toString());
//   formData.append("categoryId", data.categoryId);

//   if (data.file && data.file.length > 0) {
//     formData.append("file", data.file[0]);
//   }

//   data.details.forEach((detail, index) => {
//     formData.append(`details[${index}]`, detail);
//   });

//   return formData;
// }
