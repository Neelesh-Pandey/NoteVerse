"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UploadDropzone } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useState } from "react";
// import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { NavigationLink } from "@/components/navigation";
import { ArrowLeft } from "lucide-react";


// Define categories
const categories = [
  "Coding",
  "University",
  "Aptitude & Reasoning",
  "Web Development",
  "Computer Science",
  "Engineering",
  "Other",
];

// Define validation schema using Zod
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  imageUrl: z.string().min(1, { message: "Image is required" }),
  pdfUrl: z.string().min(1, { message: "PDF is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  isPublic: z.boolean().default(true),
});

const CreatePage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      pdfUrl: "",
      category: "",
      isPublic: true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/upload", values);
      router.push("/dashboard");
      toast({
        title: "Note Created",
        description: "Your note has been created successfully.",
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response) {
        toast({
          title: "Error",
          description: axiosError.response.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8 ">
        <NavigationLink
          href="/"
          variant="ghost"
          size="sm"
          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </NavigationLink>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Note</h1>
          <p className="text-muted-foreground">
            Share your knowledge with the community
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title Input */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Title
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Enter a clear and descriptive title for your note
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter note title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category Selection */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Category
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Select the subject category for your note</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description Input */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Description
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Provide a detailed description of your note</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter note description"
                      className="min-h-[200px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Cover Image
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Upload a cover image for your note</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <UploadDropzone<OurFileRouter, "imageUploader">
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            if (res && res.length > 0) {
                              const uploadedImageUrl = res[0].url;
                              field.onChange(uploadedImageUrl);
                              setImagePreview(uploadedImageUrl);
                            }
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              title: "Error uploading image",
                              description: error.message,
                              variant: "destructive",
                            });
                          }}
                        />
                        {imagePreview && (
                          <div className="relative aspect-video rounded-lg overflow-hidden border">
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              className="object-cover w-full h-full"
                              width={100}
                              height={100}
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PDF Upload */}
              <FormField
                control={form.control}
                name="pdfUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      PDF File
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Upload your note in PDF format</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <UploadDropzone<OurFileRouter, "pdfUploader">
                          endpoint="pdfUploader"
                          onClientUploadComplete={(res) => {
                            if (res && res.length > 0) {
                              const uploadedPdfUrl = res[0].url;
                              field.onChange(uploadedPdfUrl);
                              setPdfPreview(uploadedPdfUrl);
                            }
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              title: "Error uploading PDF",
                              description: error.message,
                              variant: "destructive",
                            });
                          }}
                        />
                        {pdfPreview && (
                          <div className="flex items-center gap-2 p-4 rounded-lg border bg-muted">
                            <FileText className="h-8 w-8 text-primary" />
                            <span className="text-sm">
                              PDF uploaded successfully
                            </span>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Visibility Toggle
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Visibility</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Make your note {field.value ? "public" : "private"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            /> */}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Creating...
                </div>
              ) : (
                "Create Note"
              )}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
};

export default CreatePage;
