import * as z from "zod";

export const profileSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username must be at least a character" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^[A-Z]+$/i, {
      message: "No speciial characters allowed",
    }),
  age: z
    .number({
      message:
        "Your age must be a number - Good security testing Mr Jaques but you taught me well",
    })
    .min(0, { message: "Input your real age idiot" })
    .max(120, { message: "Input your real age idiot" }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
