import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { readDeck, updateDeck } from "../utils/api";
import DeckForm from "./Form";
import Breadcrumb from "../Home/Breadcrumbs";


function EditDeck() {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [currentDeck, setCurrentDeck] = useState({});

    useEffect(() => {
        const loadDeck = async () => {
            try {
                const loadedDeck = await readDeck(deckId);
                setFormData({
                    name: loadedDeck.name,
                    description: loadedDeck.description,
                });
                setCurrentDeck(loadedDeck);
            } catch (error) {
                console.error("Error loading deck:", error);
            }
        };

        loadDeck();
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

        // Check if required fields are filled
        if (!formData.name || !formData.description) {
            alert("Please fill out all required fields.");
            return;
        }

        // Create a new deck object with updated information
        const updatedDeck = {
            ...formData,
            id: deckId,
            cards: [], // Assuming cards are not updated in this form
        };

        try {
            // Call the updateDeck function to save the updated deck to the API
            await updateDeck(updatedDeck);

            // setTimeout using a timeout of 0 milliseconds to execute after the re-render
            setTimeout(() => {
                navigate(`/decks/${deckId}`); // Redirect to the DeckView for the newly created deck
            }, 0);
        } catch (error) {
            console.error("Error updating deck:", error);
        }
    };

    const handleCancel = () => {
        // If the user clicks Cancel, go back to the Deck screen
        navigate(`/decks/${deckId}`);
    };

    const breadcrumbPaths = [
        { link: "/", text: "Home" },
        {
            link: `/decks/${deckId}`,
            text: currentDeck ? currentDeck.name : "Error loading deck name.",
        },
        {
            text: "Edit Deck",
        },
    ];

    return (
        <div>
            <Breadcrumb paths={breadcrumbPaths} />
            <h1>Edit Deck</h1>
            <DeckForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                buttonText="Submit"
            />
        </div>
    );
}

export default EditDeck;