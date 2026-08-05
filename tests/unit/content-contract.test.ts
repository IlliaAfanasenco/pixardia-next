import {
    describe,
    expect,
    it,
} from "vitest";

import {
    getFeaturedProjects,
    getProjectBySlug,
    getProjectsByServiceCode,
    getProjectsByType,
    projects,
} from "@/content/projects";
import {
    getFeaturedServices,
    getServiceByCode,
    getServiceBySlug,
    services,
} from "@/content/services";

describe("project content contract", () => {
    it("contains unique project slugs", () => {
        const slugs = projects.map(
            (project) => project.slug,
        );

        expect(new Set(slugs).size).toBe(
            projects.length,
        );
    });

    it("resolves every project by its slug", () => {
        for (const project of projects) {
            expect(
                getProjectBySlug(project.slug),
            ).toBe(project);
        }

        expect(
            getProjectBySlug(
                "definitely-missing-project",
            ),
        ).toBeUndefined();
    });

    it("keeps service and type selectors consistent", () => {
        for (const project of projects) {
            for (
                const serviceCode
                of project.serviceCodes
            ) {
                expect(
                    getProjectsByServiceCode(
                        serviceCode,
                    ),
                ).toContain(project);
            }

            expect(
                getProjectsByType(project.type),
            ).toContain(project);
        }
    });

    it("returns featured projects from the canonical collection", () => {
        const featured =
            getFeaturedProjects();

        expect(
            featured.every((project) =>
                projects.some(
                    (candidate) =>
                        candidate.slug ===
                        project.slug,
                ),
            ),
        ).toBe(true);
    });
});

describe("service content contract", () => {
    it("contains unique service slugs and codes", () => {
        const slugs = services.map(
            (service) => service.slug,
        );

        const codes = services.map(
            (service) => service.code,
        );

        expect(new Set(slugs).size).toBe(
            services.length,
        );

        expect(new Set(codes).size).toBe(
            services.length,
        );
    });

    it("resolves every service by slug and code", () => {
        for (const service of services) {
            expect(
                getServiceBySlug(service.slug),
            ).toBe(service);

            expect(
                getServiceByCode(service.code),
            ).toBe(service);
        }

        expect(
            getServiceBySlug(
                "definitely-missing-service",
            ),
        ).toBeUndefined();
    });

    it("returns featured services from the canonical collection", () => {
        const featured =
            getFeaturedServices();

        expect(
            featured.every((service) =>
                services.some(
                    (candidate) =>
                        candidate.code ===
                        service.code,
                ),
            ),
        ).toBe(true);
    });
});
