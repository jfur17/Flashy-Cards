import React, { useState, useEffect } from "react";
import { Route, Link, Routes } from "react-router-dom";
import { listDecks } from "../utils/api";
import Header from "./Header";
import NotFound from "./NotFound";
import AddCard from "../Cards/Add";
import EditCard from "../Cards/Edit";
import CreateDeck from "../Decks/CreateDeck";
import Study from "../Study/Study";
import EditDeck from "../Decks/Edit";
import DecksList from "../Home/DeckList";
import Deck from "../Decks/Deck";


function Layout() {
    const [decks, setDecks] = useState([]);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchData = async () => {
            try {
                const fetchedDecks = await listDecks(abortController.signal);
                setDecks(fetchedDecks);
            } catch (error) {
                console.error("Error fetching decks:", error);
            }
        };

        fetchData();

        return () => {
            abortController.abort();
        };
    }, []);

    return (
            <div>
                <Header />
                <div className="container">
                    <Routes>
                        <Route path="/decks/new" element={<CreateDeck decks={decks} setDecks={setDecks} />} />
                        <Route path="/decks/:deckId/study" element={<Study />} />
                        <Route path="/decks/:deckId/edit" element={<EditDeck />} />
                        <Route path="/decks/:deckId/cards/new" element={<AddCard />} />
                        <Route path="/decks/:deckId/cards/:cardId/edit" element={<EditCard />} />
                        <Route path="/decks/:deckId" element={<Deck setDecks={setDecks} />} />
                        <Route path="/" element={
                            <>
                                <Link to="/decks/new" className="btn btn-secondary mb-3">
                                    <i className="bi bi-plus-lg"></i> Create Deck
                                </Link>
                                <DecksList decks={decks} setDecks={setDecks} />
                            </>
                        } />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </div>
    );
}

export default Layout;