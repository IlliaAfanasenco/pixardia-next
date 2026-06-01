import {api} from "@/features/api/api";


export async function createdLead(data){
    const response = await api.post("/leads", data)
    return response.data
}