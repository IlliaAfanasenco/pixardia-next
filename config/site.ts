export const siteConfig = {
    name: 'pixardia',
    title: 'ada',
    description: 'dadwdw',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001',
    ogImage: "./",
    keywords: [
        "web studio"
    ],
    links: {
        home: '/',
        services: 'services'
    },
    contact: {
        email: 'adwa',
        telegram: ''
    },

    creator: "Pixardia"
} as const