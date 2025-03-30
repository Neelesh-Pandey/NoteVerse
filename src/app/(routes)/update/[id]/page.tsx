"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/utils/uploadthing";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Invalid image URL"),
  pdfUrl: z.string().url("Invalid PDF URL"),
});

type FormData = z.infer<typeof formSchema>;

export default function UpdateNote() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await axios.get(`/api/upload/${id}`);
        setValue("title", data.title);
        setValue("description", data.description);
        setValue("imageUrl", data.imageUrl);
        setValue("pdfUrl", data.pdfUrl);
        setImagePreview(data.imageUrl);
        setPdfPreview(data.pdfUrl);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load note", error);
        toast.error("Failed to load note");
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await axios.put(`/api/upload/${id}`, {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || "", // Ensure it's a string
        pdfUrl: data.pdfUrl || "",
      });

      toast.success("Note updated successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update note");
    }
  };

  return (
    <div className="max-w-2xl h-screen mx-auto p-6  rounded-lg">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Update the Note Data
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Label>Title</Label>
        <Input {...register("title")} placeholder="Enter title" />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}

        <Label>Description</Label>
        <Textarea
          {...register("description")}
          placeholder="Enter description"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}

        <Label>Image Preview</Label>
        <div className="flex items-center justify-center border border-black">
          {imagePreview && (
            <Image
              src={imagePreview}
              alt="Preview"
              width={200}
              height={200}
              className="border rounded"
            />
          )}
        </div>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            const url = res[0].url;
            setValue("imageUrl", url);
            setImagePreview(url);
          }}
          onUploadError={(error: Error) => {
            console.error("Image upload failed", error);
            toast.error("Image upload failed");
          }}
        />

        <Label>PDF Preview</Label>
        {pdfPreview && (
          <iframe src={pdfPreview} className="w-full h-40 border rounded" />
        )}
        <UploadButton
          endpoint="pdfUploader"
          onClientUploadComplete={(res) => {
            const url = res[0].url;
            setValue("pdfUrl", url);
            setPdfPreview(url);
          }}
          onUploadError={(error: Error) => {
            console.error("PDF upload failed", error);
            toast.error("PDF upload failed");
          }}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Apply Changes"}
        </Button>
      </form>
    </div>
  );
}
