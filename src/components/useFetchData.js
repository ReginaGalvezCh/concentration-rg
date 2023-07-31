import { useState, useEffect } from 'react';

export default function useFetchData(cardAmount, maxCards, setGame) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [flipCountdown, setFlipCountdown] = useState(0);

    useEffect(() => {
        fetch('https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=20')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Something went wrong while fetching the data!');
                }
                return response.json();
            })
            .then(data => {
                const shuffledEntries = data.entries.sort(() => Math.random() - 0.5);
                const actualCardAmount = Math.min(cardAmount, maxCards);
                const cards = shuffledEntries.slice(0, actualCardAmount).map((item, index) => ({
                    id: 'card-' + index,
                    img: item.fields.image.url,
                    isFlipped: true,
                    isMatched: false
                }));
                const duplicateCards = cards.map((card, index) => ({ ...card, id: 'duplicateCard-' + index }));
                const gameCards = [...cards, ...duplicateCards].sort(() => Math.random() - 0.5);
                setGame(prevGame => ({ ...prevGame, cards: gameCards }));
                setIsLoading(false);

                const flipTime = 10000; 

                let flipTimer = setTimeout(() => {
                    setGame(prevGame => {
                        const newCards = prevGame.cards.map(card => ({ ...card, isFlipped: false }));
                        return { ...prevGame, cards: newCards };
                    });
                }, flipTime);

                let countdownTimer = setInterval(() => {
                    setFlipCountdown(oldCountdown => {
                        if (oldCountdown <= 1) {
                            clearInterval(countdownTimer);
                            return 0;
                        } else {
                            return oldCountdown - 1;
                        }
                    });
                }, 1000);

                setFlipCountdown(flipTime / 1000);

            })
            .catch(error => {
                setIsLoading(false);
                setError(error.message);
            });
    }, [cardAmount, maxCards, setGame]);

    return { isLoading, error,flipCountdown };
}
