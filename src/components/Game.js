import React, { useState, useEffect } from 'react';
import './Game.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import useWindowSize, { calculateCardAmount } from './useWindowSize';
import useFetchData from './useFetchData';
import useGameLogic from './useGameLogic';


function Game() {
    const maxCards = 8;
    const [game, setGame] = useState({
        userName: "",
        cards: [],
        flippedCards: [],
        matchedCards: [],
        mistakes: 0,
        matches: 0,
        gameWon: false,
        showModal: !localStorage.getItem('userName'),
        tempUserName: ""
    });
    const windowSize = useWindowSize();
    const cardAmount = calculateCardAmount(windowSize.width);
    const { isLoading, error, flipCountdown } = useFetchData(cardAmount, maxCards, setGame);




    useGameLogic(game, setGame);

    const [newUserName, setNewUserName] = useState("");
    const [isUserConfirmed, setIsUserConfirmed] = useState(false);

    const confirmUser = (event) => {
        event.preventDefault();
        localStorage.setItem('userName', newUserName);
        setGame(prevGame => ({ ...prevGame, userName: newUserName }));
        setIsUserConfirmed(true);
    };

    const handleNameChange = (event) => {
        setNewUserName(event.target.value);
    };

    const handleCardClick = (id) => {
        const clickedCardIndex = game.cards.findIndex(card => card.id === id);
        const clickedCard = game.cards[clickedCardIndex];

        if (clickedCard.isFlipped || clickedCard.isMatched) {
            return;
        }
        const newCards = [...game.cards];
        newCards[clickedCardIndex] = { ...newCards[clickedCardIndex], isFlipped: true };

        setGame(prevGame => ({
            ...prevGame,
            cards: newCards,
            flippedCards: [...prevGame.flippedCards, newCards[clickedCardIndex]]
        }));
    };

    if (isLoading) {
        return <div className="d-flex justify-content-center">
            <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>

            <Modal show={!isUserConfirmed} onHide={() => setIsUserConfirmed(true)}>
                <Modal.Header>
                    <Modal.Title> <h4>Welcome to the game</h4></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={confirmUser}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className='username'>Please enter your name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" value={newUserName} onChange={handleNameChange} required />
                        </Form.Group>
                        <Button variant="light" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <div className="container game-container">
                <div className="row stats-container">
                    <div className="col"><h4 className='counter-Matches'>Matches: {game.matches}</h4></div>
                    <div className="col"><h4 className='counter-Mistakes'>Mistakes: {game.mistakes}</h4></div>
                </div>
                {flipCountdown > 0 &&
                    <div className="row stats-container">

                        <div className="col d-flex justify-content-center">
                            <div className="counter-Flip r"><h4 className="counter-Flip">Time until flip: {flipCountdown}</h4>
                            </div>
                        </div>
                    </div>
                }{game.gameWon &&
                    <div className="row stats-container">
                        <div className="col d-flex justify-content-center">
                            <h4 className="congrats-message">Congratulations {game.userName}, you won the game!</h4>
                        </div>
                    </div>
                }

                <div className="row row-cols-4 row-cols-s-4 row-cols-md-5 row-cols-lg-4 g-4 cards-container">
                    {game.cards.map(card => (
                        <div className="col cols-4 cols-s-3 cols-md-5 -cols-lg-4 g-4" key={card.id}>
                            <div
                                onClick={() => handleCardClick(card.id)}
                                className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                            >
                                <img className="card-image" src={card.img} alt="" />
                            </div>
                        </div>
                    ))}
                </div>
                {/* {game.gameWon && <div className="congrats-message">Congratulations {game.userName}, you won the game!</div>} */}
            </div>
        </>
    );
}
export default Game;
