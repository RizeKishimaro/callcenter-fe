import { z } from "zod";

export const signInSchema = z.object({
  sipUsername: z.string({message: "sip-username shouldn't be empty"}).min(3).max(50),
  password: z.string({message: "password shouldn't be empty"}).min(3).max(50),
});

export type signInSchemaType = z.infer<typeof signInSchema>;
