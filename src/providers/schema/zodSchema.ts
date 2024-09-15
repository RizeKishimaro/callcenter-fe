import { userSchema } from "./zodSchema";
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

const campaignStrategy = z.enum([
  "rrmemory",
  "ringall",
  "fewestcalls",
  "random",
  "lastrecent",
  "rrordered",
]);

// Define the extent schema
const extensionSchema = z.enum(["inbound", "outbound"]);

export const sipProviderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  provider_number: z
    .string({ message: "Phone number field is required!" })
    .min(4, "Phone number must be minimum 4 digits")
    .max(12, "Phone number must be maximum 12 digits"),
  codecs: codecsSchema,
  transport: transportSchema,
  host: z.string(),
  extension: extensionSchema,
  prefix: z
    .string()
    .min(3, "At least 3 characters")
    .max(10, "Maximum 10 characters are allowed."),
  concurrentlimit: z.number().min(1, "Concurrent Limit is required!."),
  strategy: campaignStrategy,
});

export const campaginSchema = z.object({
  name: z.string().min(1, "Name is required"),
  prefix: z
    .string()
    .min(3, "At least 3 characters")
    .max(10, "Maximum 10 characters are allowed."),
  concurrentlimit: z.number().min(1, "Concurrent Limit is required!."),
  strategy: campaignStrategy,
});

const passwordRegex = /^[a-zA-Z0-9]*$/;

const validateProfileFile = (file) => {
  const validTypes = ["image/png", "image/jpeg"];
  return file && validTypes.includes(file.type);
};

export const agentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  sipName: z
    .string()
    .min(3, "Sip name must be at least 3 characters")
    .max(10, "Maximum length is 10 characters"),
  password: z
    .string()
    .min(5, "Minimum 5 characters are allowd!")
    .regex(passwordRegex, "Password can only contain alphanumeric characters"),
  profile: z
    .instanceof(File)
    .nullable()
    .refine((file) => validateProfileFile(file)),
  campaignId: z.number(),
  // sipProviderId: z.number(),
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

const userRole = z.enum(["admin", "supervisor"]);

const sipNameRegex = /^[a-zA-Z0-9_-]+$/;

export const userSchema = z.object({
  name: z.string().min(2, "Name is required"),
  sipName: z
    .string()
    .min(3, "Sip name must be at least 3 characters")
    .max(10, "Maximum length is 10 characters")
    .regex(
      sipNameRegex,
      "Sip name can only contain letters, numbers, underscores, and hyphens"
    ),
  email: z.string().email(),
  password: z
    .string()
    .min(5, "Minimum 5 characters are allowd!")
    .regex(passwordRegex, "Password can only contain alphanumeric characters"),
  role: userRole,
});

export type userSchemaType = z.infer<typeof userSchema>;

export type ivrTreeSchemaType = z.infer<typeof ivrTreeSchema>;

export type sipProviderSchemaType = z.infer<typeof sipProviderSchema>;

export type campaignSchemaType = z.infer<typeof campaginSchema>;

export type agentSchemaType = z.infer<typeof agentSchema>;

export type signInSchemaType = z.infer<typeof signInSchema>;

export type ivrFileUploadSchemaType = z.infer<typeof ivrFileUploadSchema>;
