import * as z from "zod";
export const signInSchema = z.object({
  email: z.email({
    error: "Invalid Email",
  }),
  password: z.string().min(4, "Password must be atleast 4 characters"),
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be atleast 2 characters"),
  email: z.email({
    error: "Invalid Email",
  }),
  password: z.string().min(4, "Password must be atleast 4 characters"),
  role: z.enum(["org", "person"]),
});
