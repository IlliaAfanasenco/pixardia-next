const nodes = [
    {
        id: "hero",
        target: "hero",
        label: "Hero",
    },
    {
        id: "crafting",
        target: "crafting",
        label: "Crafting",
    },
    {
        id: "product",
        target: "product",
        label: "Product",
    },
    {
        id: "archive",
        target: "archive",
        label: "Archive",
    },
    {
        id: "contact",
        target: "contact",
        label: "Contact",
    },
] as const;

export default function SceneNavigator() {
    return (
        <nav
            className="cinematic-navigator"
            aria-label="Homepage presentation scenes"
            data-cinematic-navigator=""
        >
            <span
                className="cinematic-navigator__track"
                aria-hidden="true"
            >
                <span
                    className="cinematic-navigator__fill"
                    data-cinematic-nav-fill=""
                />
            </span>

            <ol className="cinematic-navigator__nodes">
                {nodes.map((node, index) => (
                    <li
                        key={node.id}
                        className="cinematic-navigator__node"
                        data-cinematic-nav-node={node.id}
                    >
                        <button
                            type="button"
                            className="cinematic-navigator__link"
                            aria-label={`Go to ${node.label}`}
                            data-cinematic-nav-target={node.target}
                        >
                            <span className="cinematic-navigator__index">
                                {String(index + 1).padStart(
                                    2,
                                    "0",
                                )}
                            </span>
                            <span className="cinematic-navigator__dot" />
                            <span className="cinematic-navigator__label">
                                {node.label}
                            </span>
                        </button>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
