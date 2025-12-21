"use client";
import { addContentSchema } from "@/zod/zod-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import Link from "next/link";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { useFormStore } from "@/store/store";

export function AddContentDialog() {
  const form = useForm<z.infer<typeof addContentSchema>>({
    resolver: zodResolver(addContentSchema),
    defaultValues: {
      title: "Untitled",
      description: "",
      link: "",
    },
  });

  async function onSubmit(values: z.input<typeof addContentSchema>) {
    console.log(values);
  }

  const { isOpen, close } = useFormStore();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
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
                  name="link"
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
                      <FieldLabel htmlFor="description">Password</FieldLabel>
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
    </Dialog>
  );
}
