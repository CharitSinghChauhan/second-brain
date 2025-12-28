"use client";
import { addContentSchema } from "@/zod/zod-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { DialogContent } from "./ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { api } from "@/axios/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AddContentDialog({
  isDialogOpen,
  setIsDialogOpen,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof addContentSchema>>({
    resolver: zodResolver(addContentSchema),
    defaultValues: {
      title: "Untitled",
      description: "",
      contentLink: "",
      tags: [],
      type: "note",
    },
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(values: z.input<typeof addContentSchema>) {
    setLoading(true);
    try {
      const response = (
        await api.post("/content", {
          title: values.title,
          description: values.description,
          contentLink: values.contentLink,
          type: values.type,
          tags: values.tags,
        })
      ).data;

      if (!response.success) {
        throw new Error(response.message || "Failed to add content");
      }
      toast.success("Add successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error occured");
    } finally {
      setLoading(false);
      form.reset();
      setIsDialogOpen(false);
      router.push("/")
    }
  }

  return (
    <DialogContent className="shadow-lg p-0">
      <Card className="w-full sm:max-w-md border-none shadow-none">
        <CardContent>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Add new content</h1>
                <p className="text-sm text-muted-foreground">
                  Add content to keep things organized.
                </p>
              </div>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      {...field}
                      id="title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Title"
                      autoComplete="on"
                      type="text"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="contentLink"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="link">Link</FieldLabel>
                    <Input
                      {...field}
                      id="Link"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Link"
                      autoComplete="on"
                      type="text"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      {...field}
                      id="description"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Description"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel data-invalid={fieldState.invalid}>
                      Type
                    </FieldLabel>
                    <Select {...field}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Type</SelectLabel>
                          <SelectItem value="youtube-video">
                            youtube-video
                          </SelectItem>
                          <SelectItem value="article-link">
                            article-link
                          </SelectItem>
                          <SelectItem value="tweet-link">tweet-link</SelectItem>
                          <SelectItem value="document-link">
                            document-link
                          </SelectItem>
                          <SelectItem value="others">others</SelectItem>
                          <SelectItem value="note">note</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="tags"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel data-invalid={fieldState.invalid}>
                      Tags
                    </FieldLabel>
                    <Input
                      {...field}
                      id="tags"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Tags (comma separated)"
                      autoComplete="on"
                      type="text"
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value.split(",").map((tag) => tag.trim())
                        );
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field
            orientation="horizontal"
            className="flex justify-end items-center gap-2"
          >
            <Button type="button" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" form="form-rhf-demo">
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </DialogContent>
  );
}
