import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { readDeck } from "../utils/api";
import Breadcrumb from "../Home/Breadcrumbs";

function Study() {
    const { deckId } = useParams();
    const [deck, setDeck] = useState(null);
    const [cardIndex, setCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const navigate = useNavigate();

    const breadcrumbPaths = [
        { link: "/", text: "Home" },
        { link: `/decks/${deckId}`, text: deck ? deck.name : "Loading..." },
        { text: "Study" },
    ];

    const NotEnoughCards = ({ deck }) => (
        <div>
            <h3 className="text-danger">Not enough cards.</h3>
            <p>You need at least 3 cards to study. This deck has {deck.cards.length} cards.</p>
            <Link to={`/decks/${deckId}/cards/new`} className="btn btn-primary">
                <i className="bi bi-plus-lg"></i> Add Cards
            </Link>
        </div>
    );

    useEffect(() => {
        const loadDeck = async () => {
            try {
                const loadedDeck = await readDeck(deckId);
                setDeck(loadedDeck);
            } catch (error) {
                console.error("Error loading deck:", error);
            }
        };

        loadDeck();
    }, [deckId]);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        if (cardIndex < deck.cards.length - 1) {
            setCardIndex(cardIndex + 1);
            setIsFlipped(false);
        } else {
            const restartConfirmed = window.confirm(
                `Restart cards?\n\nClick "Cancel" to return to the Home page.`
            );
            if (restartConfirmed) {
                setCardIndex(0);
                setIsFlipped(false);
            } else {
                navigate("/");
            }
        }
    };

    if (!deck) {
        return <div>Loading...</div>;
    }

    if (deck.cards.length < 3) {
        return (
            <div>
                <Breadcrumb paths={breadcrumbPaths} />
                <h2>Study: {deck.name}</h2>
                <NotEnoughCards deck={deck} />
            </div>
        );
    }

    const currentCard = deck.cards[cardIndex];

    return (
        <div>
            <Breadcrumb paths={breadcrumbPaths} />
            <h2>Study: {deck.name}</h2>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">
                        {`Card ${cardIndex + 1} of ${deck.cards.length}`}
                    </h5>
                    <p className="card-text">
                        {isFlipped ? currentCard.back : currentCard.front}
                    </p>
                    <button onClick={handleFlip} className="btn btn-secondary mr-2">
                        Flip
                    </button>
                    {isFlipped && (
                        <button onClick={handleNext} className="btn btn-primary">
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Study;
