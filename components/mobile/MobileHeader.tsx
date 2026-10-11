export default function MobileHeader() {
    return (
        <header
            data-mobile-header
            className="flex h-[92px] w-full items-center justify-between px-5"
        >
            <div className="text-[28px] font-black text-[#3f3f3f]">
                PIXARIDA
            </div>

            <button
                type="button"
                aria-label="Open menu"
                className="flex h-10 w-10 flex-col items-center justify-center gap-[7px]"
            >
                <span className="h-[3px] w-7 rounded-full bg-[#3f3f3f]" />
                <span className="h-[3px] w-7 rounded-full bg-[#3f3f3f]" />
            </button>
        </header>
    );
}