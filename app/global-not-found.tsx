import Link from "next/link";
import "./globals.css";
export const metadata = { title: "404 | Pixardia", robots: { index: false, follow: false } };

export default function GlobalNotFound() {
    return (
        <html lang="en"><body><main className="container-custom py-16">
            <h1>404 — Page not found</h1>
            <p lang="de">Seite nicht gefunden</p>
            <nav aria-label="Choose language / Sprache wählen">
                <Link href="/en" lang="en">English — Pixardia</Link>{" / "}
                <Link href="/de" lang="de">Deutsch — Pixardia</Link>
            </nav>
        </main></body></html>
    );
}
