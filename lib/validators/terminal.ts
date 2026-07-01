import {z} from "zod"
export const  historyMessageSchema = z.object({
    role: z.enum(['user', 'bot']),
    content: z.string().trim().min(10).max(800)
})

export const terminalRequestSchema = z.object({
    message: z.string().trim().min(10).max(800),
    history: z.array(historyMessageSchema).max(5)
})

export type TerminalShema = z.infer<typeof terminalRequestSchema>