"use client";

import { signInSchema } from "@/zod/zod-types";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/axios/axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/store";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { setUser } = useAuthStore();
  const router = useRouter();

  async function onSubmit(values: z.input<typeof signInSchema>) {
    try {
      const response = (await api.post("/auth/signin", values)).data;

      if (!response.success) throw new Error("failed");

      if (response.payload) {
        toast.success("Sign In successfull");
        setUser({
          email: response.payload.email,
          username: response.payload.username,
        });
        router.replace("/");
      }
    } catch (error) {
      // TODO : diff between the error and log
      console.error(error);
      toast.error("Sign In failed");
    }
  }

  // TODO : how the inst quey username so fast
  return (
    <Card className="w-full sm:max-w-md">
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to continue where you left off.
              </p>
            </div>
            <Controller
              name="emailOrUsername"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="emailOrUsername">
                    Email Or Username
                  </FieldLabel>
                  <Input
                    {...field}
                    id="emailOrUsername"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Email or Username"
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
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signin-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="signin-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Password"
                    autoComplete="off"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">
                    ConfirmPassword
                  </FieldLabel>
                  <Input
                    {...field}
                    id="confirmPassword"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter ConfirmPassword"
                    autoComplete="off"
                    type="password"
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
          <Button type="button" variant={`link`}>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
          <Button type="button" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
