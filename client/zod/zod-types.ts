import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  email: z.string().email("Invalid email address"),
});

export const signInSchema = z
  .object({
    emailOrUsername: z.string().min(1, "Email or username is required"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const addContentSchema = z
  .object({
    title: z.string().max(50, "Title must be at most 50 characters").optional(),
    description: z
      .string()
      .max(100, "Description must be at most 100 characters")
      .optional(),
    link: z.string().url("Invalid URL format").optional(),
  })
  .superRefine((data, ctx) => {
    if (!(data.description || data.link || data.title)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one of title, description, or link is required",
      });
    }
  });
