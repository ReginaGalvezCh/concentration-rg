import { useState, useEffect } from 'react';

function calculateCardAmount(windowSize) {
    if (windowSize < 600) return 6;
    if (windowSize < 900) return 12;
    if (windowSize < 1200) return 16;
    return 24;
}

function calculateColumns(windowSize) {
    if (windowSize < 600) return 4;
    if (windowSize < 900) return 5;
    if (windowSize < 1200) return 5;

    return 6;
}
export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        cardAmount: calculateCardAmount(window.innerWidth),
        columns: calculateColumns(window.innerWidth),
    });


    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setWindowSize({
                width,
                cardAmount: calculateCardAmount(width),
                columns: calculateColumns(width),
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}
export {calculateCardAmount, calculateColumns};