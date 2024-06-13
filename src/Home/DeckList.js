import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { deleteDeck, listDecks } from "../utils/api";

function DecksList({ setDecks }) {
    const [decks, setLocalDecks] = useState([]);
    const location = useLocation();

    const handleDeleteClick = (deckId) => {
        const abortController = new AbortController();
        const isConfirmed = window.confirm(
            `Delete this deck?\n\nYou will not be able to recover it.`
        );

        if (isConfirmed) {
            deleteDeck(deckId, abortController.signal)
                .then(() => {
                    setLocalDecks((prevDecks) =>
                        prevDecks.filter((deck) => deck.id !== deckId)
                    );
                })
                .catch((error) => {
                    if (error.name === "AbortError") {
                        console.log("Request aborted.");
                    } else {
                        console.error("Error deleting deck:", error);
                    }
                });
        }

        return () => abortController.abort();
    };

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const fetchedDecks = await listDecks();
                setLocalDecks(fetchedDecks);
                setDecks(fetchedDecks); // Update the parent state if necessary
            } catch (error) {
                console.error("Error fetching decks:", error);
            }
        };

        fetchDecks();
    }, [location, setDecks]);

    if (decks.length === 0) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            {decks.map((deck) => (
                <div className="card deck mb-3" key={deck.id}>
                    <div className="card-body">
                        <h5 className="card-title">{deck.name}</h5>
                        <h6 className="card-subtitle mb-2 text-body-secondary">
                            {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}
                        </h6>
                        <p className="card-text">{deck.description}</p>
                    </div>
                    <div className="deckButton">
                        <Link to={`/decks/${deck.id}`} className="btn btn-secondary mr-2">
                            <i className="bi bi-eye-fill"></i> View
                        </Link>
                        <Link to={`/decks/${deck.id}/study`} className="btn btn-primary mr-2">
                            <i className="bi bi-book-half"></i> Study
                        </Link>
                        <button
                            onClick={() => handleDeleteClick(deck.id)}
                            className="btn btn-danger"
                        >
                            <i className="bi bi-trash-fill"></i> Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DecksList;
