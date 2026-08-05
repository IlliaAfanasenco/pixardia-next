import Link from "next/link";

export default function NotFound() {
    return (
        <section
            className="container-custom py-16 sm:py-24"
            aria-labelledby="not-found-title"
        >
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#777777]">
                Error 404
            </p>

            <h1
                id="not-found-title"
                className="mt-3 text-4xl font-black uppercase tracking-tight text-[#1E1E1E]"
            >
                Page not found
            </h1>

            <p className="mt-5 max-w-xl">
                The requested page does not exist or has been moved.
            </p>

            <Link
                href="/"
                className="mt-6 inline-flex font-bold underline underline-offset-4"
            >
                Return to home
            </Link>
        </section>
    );
}
