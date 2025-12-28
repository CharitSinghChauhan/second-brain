// signUp
// username, password, email

import { z } from "zod";

// signUp
// username, password, email
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
  email: z.email("Invalid email address"),
});

export const signInSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
});

export const createContentSchema = z
  .object({
    title: z.string().max(50, "Title must be at most 50 characters").optional(),
    description: z
      .string()
      .max(500, "Description must be at most 500 characters")
      .optional(),
    contentLink: z.url("Invalid URL").optional(),
    tags: z.array(z.string().max(10)).max(5, "Max 5 tags"),
    type: z.enum([
      "youtube-video",
      "article-link",
      "tweet-link",
      "document-link",
      "note",
      "others",
    ]),
  })
  .superRefine((data, ctx) => {
    if (!(data.contentLink && data.description && data.contentLink)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "At least one of title, description, or contentLink is required",
        path: ["contentLink"],
      });
    }
  });
