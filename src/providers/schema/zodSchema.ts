import { z } from "zod";

export const signInSchema = z.object({
  sipUsername: z
    .string({ message: "sip-username shouldn't be empty" })
    .min(3)
    .max(50),
  password: z.string({ message: "password shouldn't be empty" }).min(3).max(50),
});

// Define the codecs schema
const codecsSchema = z.array(
  z.enum([
    "ulaw",
    "alaw",
    "gsm",
    "g726",
    "g722",
    "g729",
    "speex",
    "ilbc",
    "opus",
  ])
);

// Define the transport schema
const transportSchema = z.enum(["UDP", "TCP", "WS", "WSS"]);

// Define the extent schema
const extensionSchema = z.enum(["inbound", "outbound"]);

export const sipProviderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  codecs: codecsSchema,
  transport: transportSchema,
  host: z.string(),
  extension: extensionSchema,
});

// Define file type for IVR file upload
const allowedFileTypes = ["application/zip", "application/x-tar"];

export const ivrFileUploadSchema = z.object({
  file: z
    .custom<File>()
    .refine((file) => file !== undefined, "File is required")
    .refine(
      (file) => allowedFileTypes.includes(file.type),
      "Only .zip or .tar files are allowed"
    )
    .refine((file) => file.size <= 50 * 1024 * 1024, "Max file size is 50MB"),
});

export const ivrTreeSchema = z.object({
  parentId: z.number().min(1, "Parent IVR is required."),
  label: z.string().min(1, "Label is required"),
});

export type ivrTreeSchemaType = z.infer<typeof ivrTreeSchema>;

export type sipProviderSchemaType = z.infer<typeof sipProviderSchema>;

export type signInSchemaType = z.infer<typeof signInSchema>;

export type ivrFileUploadSchemaType = z.infer<typeof ivrFileUploadSchema>
