import * as z from "zod"

export const UserSchema = z.object({
      name: z
        .string({ required_error: "This field is required!" })
        .min(1, "This field is required!"),
      email: z
        .string({ required_error: "This field is required!" })
        .email("Enter a valid email!"),
      password: z
        .string({ required_error: "This field is required!" })
        .min(1, "This field is required!")
        .min(8, "Password is too weak!"),
    });