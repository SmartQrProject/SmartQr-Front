'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { ProductFormData, productSchema } from '../menuHelpers/schemas/createProductSchema';
import { uploadImage } from '../menuHelpers/fetch/products';
import imageCompression from 'browser-image-compression';
import { Image, Wheat } from 'lucide-react';
import { CgClose } from 'react-icons/cg';
import ConfirmDialog from '../menuHelpers/confirm/confirmDialog';
import CardView from '../card/CardView';
import { useCategories } from '../menuHelpers/hook/useCategories';

interface Props {
  initialData?: ProductFormData & { id?: string; image_url?: string };
  mode?: 'create' | 'edit';
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function CreateMenuForm({ initialData, mode = 'create', onClose, onSuccess }: Props) {
  const { categories, error } = useCategories();
  const [formDataToSubmit, setFormDataToSubmit] = useState<ProductFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [preview, setPreview] = useState<any>(null);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      available: true,
      details: [''],
      categoryId: '',
      file: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'details' });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        file: undefined,
      });
      setPreview({
        ...initialData,
        imageUrl: initialData.image_url,
      });
    }
  }, [initialData, categories, reset]);

  const handlePreview = async () => {
    const values = getValues();
    try {
      productSchema.parse(values);
      toast.success('Preview successfully');

      const file = values.file?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setPreview({ ...values, imageUrl });
      } else {
        setPreview({ ...values, imageUrl: initialData?.image_url });
      }
    } catch (err) {
      toast.error('Invalid product data');
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      const session = localStorage.getItem('adminSession');
      if (!session) throw new Error('No session');
      const { token, payload: { slug } } = JSON.parse(session);

      let image_url = initialData?.image_url || '';
      const file = data.file?.[0];

      if (file) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        });
        image_url = await uploadImage(compressedFile, token);
      }

      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        categoryId: data.categoryId,
        image_url,
        is_available: data.available,
        details: data.details ?? [],
      };

      let response;
      if (mode === 'edit' && initialData?.id) {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}/products/${initialData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Update failed');
        toast.success('Product updated');
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Creation failed');
        toast.success('Product created');
        reset();
      }

      setShowConfirm(false);
      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full p-8 rounded-lg bg-default-100">
        <h2 className="text-center text-2xl">
          {mode === 'edit' ? 'Edit Product' : 'Create Product'}
        </h2>

        <div>
          <label className="font-semibold">Name</label>
          <input {...register('name')} className="w-full p-2 mt-2 bg-white rounded-md" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="font-semibold">Description</label>
          <input {...register('description')} className="w-full p-2 mt-2 bg-white rounded-md" />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>

        <div>
          <label className="font-semibold">Price</label>
          <input type="number" step="0.01" {...register('price')} className="w-full p-2 mt-2 bg-white rounded-md" />
          {errors.price && <p className="text-red-500">{errors.price.message}</p>}
        </div>

        <div>
          <label className="font-semibold">Category</label>
          <select {...register('categoryId')} className="w-full p-2 mt-2 bg-white rounded-md cursor-pointer">
            <option disabled value="">
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {error && <p className="text-red-500">{error}</p>}
          {errors.categoryId && <p className="text-red-500">{errors.categoryId.message}</p>}
        </div>

        <div>
          <input type="checkbox" {...register('available')} className="mr-2" />
          <label className="font-semibold">Available</label>
        </div>

        <div>
          <label className="font-semibold flex gap-2">
            <Image /> Image
          </label>
          <input
            type="file"
            accept="image/*"
            {...register('file')}
            className="text-sm font-semibold flex flex-col w-[200px] p-3 mt-2 text-white bg-default-700 hover:bg-default-800 rounded-md cursor-pointer"
          />
        </div>

        <div>
          <label className="font-semibold flex gap-2">
            <Wheat /> More
          </label>
          <button
            type="button"
            onClick={() => append('')}
            className="p-2 bg-default-700 text-white font-semibold rounded-md mt-2"
          >
            + Add Detail
          </button>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <input
                {...register(`details.${index}` as const)}
                className="w-full p-2 mt-2 bg-white rounded-md"
                placeholder={`Detail ${index + 1}`}
              />
              <button type="button" onClick={() => remove(index)} className="text-red-500 text-lg font-bold">
                <CgClose />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={handlePreview}
            className="w-full rounded bg-default-800 py-3 px-6 text-sm text-white font-bold hover:bg-default-700"
          >
            Preview
          </button>

          <button
            type="submit"
            className="w-full rounded border-default-800 border-2 py-3 px-6 text-sm text-default-800 font-bold hover:bg-default-700 hover:text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : mode === 'edit' ? 'Update Product' : 'Create Product'}
          </button>
        </div>

        <ConfirmDialog
          isOpen={showConfirm}
          title="Confirmation"
          message="Are you sure you want to submit this product?"
          onConfirm={async () => {
            if (formDataToSubmit) onSubmit(formDataToSubmit);
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      </form>

      {preview && (
        <div className="w-full max-w-sm p-4">
          <CardView
            name={preview.name}
            description={preview.description}
            price={preview.price}
            file={preview.imageUrl}
            details={preview.details}
            is_available={preview.available}
            categoryId={preview.categoryId}
          />
        </div>
      )}
    </div>
  );
}
