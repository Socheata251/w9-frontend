import React from 'react';
function Header({ gameName = "Monster Slayer" }) {
    return (
        <header>
            <h1>{gameName}</h1>
        </header>
    );
}

export default Header;