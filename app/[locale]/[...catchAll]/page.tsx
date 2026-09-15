import { notFound } from "next/navigation";
import { routeLocale } from "@/i18n/server";

export default async function UnknownPage({ params }: { params: Promise<{ locale: string }> }) {
    await routeLocale(params);
    notFound();
}
