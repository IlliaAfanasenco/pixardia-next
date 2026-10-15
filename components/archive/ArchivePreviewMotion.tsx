"use client";

import { useEffect, useRef, type ReactNode } from "react";

// The diagram and copy remain server rendered; only viewport activation needs JavaScript.
export default function ArchivePreviewMotion({ children, className }: { children: ReactNode; className: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element || !("IntersectionObserver" in window)) return;
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
        const observer = new IntersectionObserver(([entry]) => {
            element.dataset.previewActive = String(entry.isIntersecting && !preference.matches);
        }, { threshold: 0.25 });
        const update = () => {
            element.dataset.previewActive = "false";
            observer.unobserve(element);
            if (!preference.matches) observer.observe(element);
        };
        update();
        preference.addEventListener("change", update);
        return () => {
            observer.disconnect();
            preference.removeEventListener("change", update);
        };
    }, []);

    return <div ref={ref} className={className} data-archive-card-visual="">{children}</div>;
}
