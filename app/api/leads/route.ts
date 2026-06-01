import {prisma} from "@/lib/prisma";
import {leadSchema} from "@/lib/validators/lead";
import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const parsed = leadSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ok: false, error: "valid err", details: parsed.error.flatten()}, {status: 400})
        }

        const lead = await prisma.lead.create({
            data: {
                name: parsed.data.name,
                email: parsed.data.email,
                message: parsed.data.message,
                phone: parsed.data.phone,
                serviceType: parsed.data.serviceType,
                serviceSlug: parsed.data.serviceSlug
            }
        })
        return NextResponse.json({ok: true, leadId: lead.id}, {status: 201})
    } catch (e) {
        console.error("Error", e)
        return NextResponse.json({ok: false, error: "Serv error"}, {status: 500})
    }
}