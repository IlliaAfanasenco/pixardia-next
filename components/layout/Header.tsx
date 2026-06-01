import React from 'react';
import Link from "next/link";

const Header = () => {
    return (
        <header className={'header'}>
            <div className="header__container">
                <Link href={'/'}>
                    logo
                </Link>
                <div className="navbar">
                    <span>+</span>
                    <Link href={'/contact'}>
                        start
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;