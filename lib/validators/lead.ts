import {z} from "zod"
import {serviceTypes} from "@/types/services";

export const leadSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(7, "Invalid phone number"),
    message: z.string().min(1, "Message is required"),
    serviceType: z.enum(serviceTypes),
    serviceSlug: z.string().min(1, "Slug is required"),
})