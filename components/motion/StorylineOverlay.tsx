const storyNodes = [
    "hero",
    "crafting-structure",
    "product-process",
    "archive",
    "contact",
] as const;

export default function StorylineOverlay() {
    return (
        <div
            className="storyline-overlay"
            aria-hidden="true"
        >
            <div className="storyline-overlay__rail">
                <span className="storyline-overlay__track" />
                <span className="storyline-overlay__progress" />
                <span
                    className="storyline-overlay__signal storyline-overlay__signal--incoming"
                    data-story-graphic="hero-signal"
                />

                {storyNodes.map((story, index) => (
                    <span
                        key={story}
                        className="storyline-overlay__node"
                        data-story-node={story}
                        style={{
                            top: `${index * 25}%`,
                        }}
                    >
                        <span className="storyline-overlay__index">
                            {String(index + 1).padStart(
                                2,
                                "0",
                            )}
                        </span>

                        <span className="storyline-overlay__dot" />
                    </span>
                ))}

                <span
                    className="storyline-overlay__branch storyline-overlay__branch--crafting"
                    data-story-graphic="crafting-branches"
                />
                <span
                    className="storyline-overlay__branch storyline-overlay__branch--product"
                    data-story-graphic="product-route"
                />
                <span
                    className="storyline-overlay__branch storyline-overlay__branch--archive"
                    data-story-graphic="archive-frame"
                />
                <span
                    className="storyline-overlay__convergence"
                    data-story-graphic="contact-convergence"
                />
            </div>
        </div>
    );
}
