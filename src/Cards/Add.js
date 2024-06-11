import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createCard, readDeck } from "../utils/api";
import CardForm from "./Form";
import Breadcrumb from "../Home/Breadcrumbs";

function AddCard() {
    const { deckId } = useParams();
    const [formData, setFormData] = useState({
        front: "",
        back: "",
    });
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Create a new card
            const newCard = {
                front: formData.front,
                back: formData.back,
                deckId: parseInt(deckId, 10),
            };

            // Add the new card to the deck
            await createCard(deckId, newCard);

            // Clear the form data
            setFormData({
                front: "",
                back: "",
            });
        } catch (error) {
            console.error("Error adding card:", error);
        }
    };

    const handleDone = () => {
        // Redirect to the Deck screen
        navigate(`/decks/${deckId}`);
    };

    const breadcrumbPaths = [
        { link: "/", text: "Home" },
        {
            link: `/decks/${deckId}`,
            text: currentDeck ? currentDeck.name : "Loading...",
        },
        {
            text: "Add Card",
        },
    ];

    return (
        <div>
            <Breadcrumb paths={breadcrumbPaths} />
            {currentDeck ? (
                <>
                    <h1>{`${currentDeck.name}: Add Card`}</h1>
                    <CardForm
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        handleCancel={handleDone}
                        buttonDismissText="Done"
                        buttonConfirmText="Save"
                    />
                </>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    );
}

export default AddCard;
