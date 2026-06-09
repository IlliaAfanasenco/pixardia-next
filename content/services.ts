export  const services = [
    {
        slug: "website",
        serviceType: "WEBSITE",
        title: 'text',
        desc: 'text',
        seoTitle: 'text',
        setDesc: 'desc'
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