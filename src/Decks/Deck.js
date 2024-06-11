import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { readDeck, deleteDeck } from "../utils/api";
import Breadcrumb from "../Home/Breadcrumbs";
import Flashcard from "../Cards/Card";

function Deck({ setDecks }) {
    const { deckId } = useParams();
    const [currentDeck, setCurrentDeck] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getCurrentDeck = async () => {
            try {
                const deck = await readDeck(deckId);
                setCurrentDeck(deck);
            } catch (error) {
                console.error("Error loading deck:", error);
            }
        };

        getCurrentDeck();
    }, [deckId]);

    const handleDeleteDeck = async () => {
        const confirmation = window.confirm("Are you sure you want to delete this deck?");
        if (confirmation) {
            try {
                await deleteDeck(deckId);
                setDecks((prevDecks) => prevDecks.filter((deck) => deck.id !== deckId));
                navigate("/");
            } catch (error) {
                console.error("Error deleting deck:", error);
            }
        }
    };

    const breadcrumbPaths = [
        { link: "/", text: "Home" },
        {
            link: `/decks/${deckId}`,
            text: currentDeck ? currentDeck.name : "Loading...",
        },
    ];

    return currentDeck ? (
        <div>
            <Breadcrumb paths={breadcrumbPaths} />
            <h1>{currentDeck.name}</h1>
            <p>{currentDeck.description}</p>

            <div>
                <Link to={`/decks/${deckId}/edit`} className="btn btn-secondary mr-2">
                    <i className="bi bi-pencil-fill"></i> Edit
                </Link>
                <Link to={`/decks/${deckId}/study`} className="btn btn-primary mr-2">
                    <i className="bi bi-book-half"></i> Study
                </Link>
                <Link to={`/decks/${deckId}/cards/new`} className="btn btn-primary mr-2">
                    <i className="bi bi-plus-lg"></i> Add Cards
                </Link>
                <button onClick={handleDeleteDeck} className="btn btn-danger mr-2">
                    <i className="bi bi-trash-fill"></i> Delete
                </button>
            </div>

            <h2>Flashcards</h2>
            <div>
                {currentDeck.cards.map((card) => (
                    <Flashcard key={card.id} card={card} url={`/decks/${deckId}`} />
                ))}
            </div>
        </div>
    ) : (
        <h1>Loading...</h1>
    );
}

export default Deck;
