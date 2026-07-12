import {buildPixardiaSystemPrompt} from "@/lib/ai-terminal/systemPromt";

export type TerminalCategory = | "service" | "price" | "timeline" | "contact" | "off_topic"


export type TerminalResult = {
    answer: string
    category: string
    leadToContact: boolean
}

export type TerminalHistory = {
    role: "user" | "assistant"
    content: string
}

export type DeepseekMessage = {
    role: "system" | "user" | "assistant"
    content: string
}

export type TerminalAnswer = {
    message: string
    history: TerminalHistory[]
    language: "en" | "de"
}

const DEEPSEEK_API_URL = 'https://api.deepseek.com'
const DEEPSEEK_MODEL = 'deepseek-v4-flash'


function fallAnswer(): TerminalResult {
    return {
        answer: 'err ai',
        category: 'contact',
        leadToContact: true,
    }
}

function terminalCategory(value: unknown): value is TerminalCategory {
    return (
        value === "service" ||
            value === 'price'||
            value === "timeline" ||
            value === "contact" ||
            value === "off_topic"


    )
}


function parseResult(content: string): TerminalResult {
    try {
         const parsed = JSON.parse(content) as Partial<TerminalResult>

        if(typeof parsed.answer !== 'string' || parsed.answer.trim().length === 0) {
            return fallAnswer()
        }

        return  {
            answer: parsed.answer.trim().slice(0, 800),
            category: terminalCategory(parsed.category) ? parsed.category : 'unknown',
            leadToContact: parsed.leadToContact === true
        }
    } catch (err) {
        return fallAnswer()
    }
}

export  async function terminalAnswer ({message, history, language}: TerminalAnswer) {
const apiKey = process.env.NODE_ENV // api key change

    if(!apiKey) {
        return fallAnswer()
    }

    const messages = [
        {
            role : "system",
            content: buildPixardiaSystemPrompt()
        },
        ...history.slice(-5),

        {
            role: "user",
            content: message
        }
    ]

    const controller = new AbortController()

    const timeoutId = setTimeout(() => {
        controller.abort()
    }, 12000)

    try {

    }
}





