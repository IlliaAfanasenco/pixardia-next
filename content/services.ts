export  const services = [
    {
        slug: "business-websites",
        serviceType: "BUSINESS_WEBSITE",
        title: "Business Websites",
        description:
            "Modern websites for companies that want to build trust, present their services professionally, and attract new customers online.",
        seoTitle: "Business Website Development in Germany | Pixardia",
        seoDescription:
            "Professional business websites for companies in Germany. Fast, responsive, and SEO-optimized solutions designed to build trust and generate customer inquiries.",
    },
    {
        slug: "landing-pages",
        serviceType: "LANDING_PAGE",
        title: "Landing Pages",
        description:
            "High-converting landing pages designed to present a product, service, or offer clearly and turn visitors into leads.",
        seoTitle: "Landing Page Development in Germany | Pixardia",
        seoDescription:
            "Custom landing pages for businesses in Germany. Fast, responsive, and conversion-focused pages for campaigns, services, and lead generation.",
    },
    {
        slug: "web-applications",
        serviceType: "WEB_APPLICATION",
        title: "Web Applications",
        description:
            "Custom web applications built to automate processes, improve productivity, and create scalable digital products for businesses.",
        seoTitle: "Custom Web Application Development in Germany | Pixardia",
        seoDescription:
            "Custom web application development in Germany. Scalable, secure, and modern web apps built with React, Next.js, and TypeScript.",
    },
    {
        slug: "ecommerce-solutions",
        serviceType: "ECOMMERCE",
        title: "E-Commerce Solutions",
        description:
            "Online stores with a clear structure, smooth user experience, and scalable foundation for selling products and growing revenue.",
        seoTitle: "E-Commerce Development in Germany | Pixardia",
        seoDescription:
            "Modern e-commerce development for businesses in Germany. Fast, secure, and optimized online stores designed for growth and conversions.",
    },
    {
        slug: "website-redesign",
        serviceType: "WEBSITE_REDESIGN",
        title: "Website Redesign",
        description:
            "Redesign of outdated websites with a stronger visual identity, better usability, improved performance, and modern responsive layouts.",
        seoTitle: "Website Redesign Services in Germany | Pixardia",
        seoDescription:
            "Website redesign services in Germany. Improve design, performance, usability, SEO, and customer trust with a modern digital presence.",
    },
    {
        slug: "maintenance-support",
        serviceType: "MAINTENANCE_SUPPORT",
        title: "Maintenance & Support",
        description:
            "Ongoing technical support, updates, monitoring, and improvements to keep websites stable, secure, and ready for business growth.",
        seoTitle: "Website Maintenance and Support in Germany | Pixardia",
        seoDescription:
            "Website maintenance and support in Germany. Updates, monitoring, performance optimization, security improvements, and technical support.",
    },
] as const

export  type Service = (typeof services)[number]
export  type ServiceSlug = Service["slug"]
export  type ServiceType = Service['serviceType']

export  function serviceBySlug(slug: string) {
    return services.find((service) => service.slug === slug)
}

export  const serviceOptions = services.map((service) => ({
    label: service.title,
    serviceType: service.serviceType,
    serviceSlug: service.slug
}))