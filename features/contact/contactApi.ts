import {api} from "@/features/api/api";
import {LeadInput} from "@/lib/validators/lead";


export async function createdLead(data: LeadInput){
    const response = await api.post("/leads", data)
    return response.data
}