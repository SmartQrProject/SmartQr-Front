'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import ButtonPrimary from "@/components/buttons/ButtonPrimary";
import { schemaPromoCodes, FormPromoCodes } from "./PromoCodesSchema";
import { createPromoCodes } from "./fetch";

const PromoCodeForm = ({ onCodeCreated }: { onCodeCreated?: () => void }) => {
  const [loading, setLoading] = useState(false);

  const { slug, token } = (() => {
    try {
      const session = localStorage.getItem("adminSession");
      if (!session) return { slug: "", token: "" };
      const parsed = JSON.parse(session);
      return { slug: parsed.payload?.slug || "", token: parsed.token || "" };
    } catch {
      return { slug: "", token: "" };
    }
  })();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormPromoCodes>({
    resolver: zodResolver(schemaPromoCodes),
    defaultValues: { percentage: 10 },
  });


  const onSubmit = async (data: FormPromoCodes) => {

    if (!slug || !token) {
      alert("Authentication data not found.");
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
        onCodeCreated?.();
      } else {
        alert(result.message || "Error creating code");
      }
    } catch {
      alert("Unexpected error while creating the promo code.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-4">
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Percentage</label>
        <input
          type="number"
          placeholder="10"
          {...register("percentage", { valueAsNumber: true })}
          className="border rounded px-3 py-2 w-32"
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
