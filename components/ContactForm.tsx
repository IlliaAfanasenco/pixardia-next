"use client"

import React, {useState} from 'react';
import {serviceOption} from "@/lib/contact/services";
import {createdLead} from "@/features/contact/contactApi";
import {leadSchema} from "@/lib/validators/lead";

const initialState = {
    name: "",
    email: "",
    message: "",
    phone: "",
    serviceType: serviceOption[0].serviceType,
    serviceSlug: serviceOption[0].serviceSlug,
}

const ContactForm = () => {
    const [form, setForm] = useState(initialState)

const handelSubmit = async (e) => {
        e.preventDefault()
    const parsData = leadSchema.safeParse(form)
        try {

             await  createdLead(parsData.data)
            console.log(parsData, 'info')
        } catch (e) {
            console.log(e)
        }
    }

    return (

        <form onSubmit={handelSubmit}>
            <input type="text" placeholder={"name"} value={form.name} onChange={(e) => setForm((el) => ({
                ...el,
                name: e.target.value
            }))}/>
            <input type="text" placeholder={"email"} value={form.email} onChange={(e) => setForm((el) => ({
                ...el,
                email: e.target.value
            }))}/>
            <textarea placeholder={"messages"} value={form.message} onChange={(e) => setForm((el) => ({
                ...el,
                message: e.target.value
            }))}/>
            <input type="tel" placeholder={"phone"} value={form.phone} onChange={(e) => setForm((el) => ({
                ...el,
                phone: e.target.value
            }))}/>
            <input type="text"/>
            <input type="text"/>
            <button>OK</button>
        </form>

    );
};

export default ContactForm;