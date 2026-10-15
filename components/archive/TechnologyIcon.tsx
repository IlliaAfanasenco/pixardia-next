import Image from "next/image";
import styles from "./archive.module.css";

const icons: Readonly<Record<string, { file: string; monochrome?: boolean } | undefined>> = {
    "Next.js": { file: "nextdotjs", monochrome: true },
    "TypeScript": { file: "typescript" },
    "React": { file: "react" },
    "Tailwind CSS": { file: "tailwindcss" },
    "PostgreSQL": { file: "postgresql" },
    "Prisma": { file: "prisma", monochrome: true },
    "Upstash Redis": { file: "redis" },
    "Redis": { file: "redis" },
    "Docker": { file: "docker" },
    "Node.js": { file: "nodedotjs" },
    "Stripe": { file: "stripe" },
    "DeepSeek": { file: "deepseek" },
};

export default function TechnologyIcon({ name, dark = false }: { name: string; dark?: boolean }) {
    const icon = icons[name];
    return icon ? (
        <Image
            src={`/icons/technologies/${icon.file}.svg`}
            alt={name}
            title={name}
            width={24}
            height={24}
            className={`${styles.technologyIcon} ${dark && icon.monochrome ? styles.lightIcon : ""}`}
        />
    ) : (
        <span className={styles.technologyInitials} role="img" aria-label={name} title={name}>
            {name.slice(0, 2)}
        </span>
    );
}
