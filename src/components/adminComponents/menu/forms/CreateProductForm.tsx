'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { ProductFormData, productSchema } from '../menuHelpers/schemas/createProductSchema';
import imageCompression from 'browser-image-compression';
import { Image, Wheat } from 'lucide-react';
import { CgClose } from 'react-icons/cg';
import CardView from '../card/CardView';
import { useCategories } from '../menuHelpers/hook/useCategories';
import { createProduct } from '../menuHelpers/fetch/createProduct';
import { updateProduct } from '../menuHelpers/fetch/updateProduct';
import { uploadImage } from '../menuHelpers/fetch/uploadImage';

interface Props {
  initialData?: ProductFormData & { id?: string; image_url?: string };
  mode?: 'create' | 'edit';
  onClose?: () => void;
  onSuccess?: () => void;
  refetchCategories?: () => void;
}

export default function CreateMenuForm({ initialData, mode = 'create', onClose, onSuccess, refetchCategories }: Props) {
  const { categories, error } = useCategories();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    setValue,
    watch,
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

  const { fields, append, remove, replace } = useFieldArray({ control, name: 'details' });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        available: initialData.available,
        categoryId: initialData.categoryId,
        file: undefined,
        details: initialData.details.length ? initialData.details : [''],
      });
      replace(initialData.details.length ? initialData.details : ['']);
      setPreview({ imageUrl: initialData.image_url });
    }
  }, [initialData, reset, replace]);

  const handlePreview = async () => {
    const values = getValues();
    const file = values.file?.[0];
    const imageUrl = file ? URL.createObjectURL(file) : initialData?.image_url;
    setPreview({ ...values, imageUrl });
    toast.success('Preview ready');
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
        const compressed = await imageCompression(file, { maxSizeMB: 0.2, maxWidthOrHeight: 800 });
        image_url = await uploadImage(compressed, token);
      }

      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        categoryId: data.categoryId,
        image_url,
        is_available: data.available,
        details: data.details,
        token,
        slug,
      };

      if (mode === 'edit' && initialData?.id) {
        await updateProduct({ productId: initialData.id, ...payload });
        toast.success('Product updated');
      } else {
        await createProduct(payload);
        toast.success('Product created');
        reset();
        replace(['']);
      }

      refetchCategories?.();
      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full p-8 rounded-lg bg-default-100">
        <h2 className="text-center text-2xl">{mode === 'edit' ? 'Edit Product' : 'Create Product'}</h2>

        <input {...register('name')} placeholder="Name" className="w-full p-2 bg-white rounded" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <input {...register('description')} placeholder="Description" className="w-full p-2 bg-white rounded" />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}

        <input type="number" step="0.01" {...register('price')} placeholder="Price" className="w-full p-2 bg-white rounded" />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}

        <select {...register('categoryId')} className="w-full p-2 bg-white rounded">
          <option value="" disabled>Select category</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        {errors.categoryId && <p className="text-red-500">{errors.categoryId.message}</p>}

        <label className="flex gap-2 items-center">
          <input type="checkbox" {...register('available')} /> Available
        </label>

        <input type="file" accept="image/*" {...register('file')} className="w-full bg-white p-2" />
        {!watch('file')?.length && preview?.imageUrl && (
          <img src={preview.imageUrl} alt="Preview" className="mt-2 w-32 rounded border" />
        )}

        <div>
          <label className="font-semibold flex gap-2"><Wheat /> More</label>
          <button type="button" onClick={() => append('')} className="mb-2 bg-default-700 text-white px-2 py-1 rounded">+ Add Detail</button>
          {fields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <input {...register(`details.${idx}` as const)} className="w-full bg-white p-2 rounded" />
              <button type="button" onClick={() => remove(idx)}><CgClose /></button>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={handlePreview} className="w-full bg-default-800 text-white px-4 py-2 rounded">Preview</button>
          <button type="submit" disabled={isLoading} className="w-full border-2 border-default-800 px-4 py-2 rounded text-default-800 font-bold hover:bg-default-700 hover:text-white">
            {isLoading ? 'Saving...' : mode === 'edit' ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>

      {preview && (
        <div className="mt-6">
          <CardView
            name={preview.name}
            description={preview.description}
            price={preview.price}
            file={preview.imageUrl}
            details={Array.isArray(preview.details) ? preview.details : []}
            is_available={preview.available}
            categoryId={preview.categoryId}
          />
        </div>
      )}
    </div>
  );
}
