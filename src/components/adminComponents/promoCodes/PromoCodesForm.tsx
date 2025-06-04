'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import ButtonPrimary from "@/components/buttons/ButtonPrimary";
import { schemaPromoCodes, FormPromoCodes } from "./PromoCodesSchema";
import { createPromoCodes } from "./fetch";
import toast from "react-hot-toast";

const PromoCodeForm = ({ onCodeCreated }: { onCodeCreated?: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    try {
      const session = localStorage.getItem("adminSession");
      if (!session) return;
      const parsed = JSON.parse(session);
      setSlug(parsed.payload?.slug || "");
      setToken(parsed.token || "");
    } catch {
      setSlug("");
      setToken("");
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormPromoCodes>({
    resolver: zodResolver(schemaPromoCodes),
    mode: "onChange",
    defaultValues: { percentage: 10 },
  });


  const onSubmit = async (data: FormPromoCodes) => {

    if (!slug || !token) {
      toast.error("Authentication data not found.");
      return;
    }

    const Data = {
      ...data,
      code: "SAVE10",
    };

    setLoading(true);
    try {
      const result = await createPromoCodes(token, Data, slug);
      if (result.success) {
        reset();
        onCodeCreated?.()
        toast.success("Promo code created successfully!");
      } else {
        toast.error(result.message || "Error creating code");
      }
    } catch {
      toast.error("Unexpected error while creating the promo code.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full">

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Percentage</label>
        <input
          type="number"
          placeholder="10"
          {...register("percentage", { valueAsNumber: true })}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-32"
        />

        {errors.percentage && (
          <p className="text-sm text-red-500">{errors.percentage.message}</p>
        )}
      </div>

      <ButtonPrimary  type="submit"   disabled={loading} >
        {loading ? "Generating..." : "Generate Code"}
      </ButtonPrimary>
    </form>
  );
};

export default PromoCodeForm;
