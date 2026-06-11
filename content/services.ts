export  const services = [
    {
        slug: "website",
        serviceType: "WEBSITE",
        title: 'text',
        desc: 'text',
        seoTitle: 'text',
        seoDesc: 'desc'
    },
    {
        slug: "website2",
        serviceType: "WEBSITE2",
        title: 'text2',
        desc: 'text2',
        seoTitle: 'text2',
        seoDesc: 'desc2'
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