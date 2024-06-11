import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDeck } from "../utils/api";
import DeckForm from "./Form";
import Breadcrumb from "../Home/Breadcrumbs";


function CreateDeck({ decks, setDecks }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Check if required fields are filled
        if (!formData.name || !formData.description) {
            alert("Please fill out all required fields.");
            return;
        }

        // Create a new deck object
        const newDeck = {
            id: decks.length + 1, // Find the currenct size of the decks state and increase the value by 1
            ...formData,
            cards: [],
        };

        try {
            // Call the createDeck function to save the deck to the API
            const createdDeck = createDeck(newDeck);

            // Update the decks state with the created deck
            setDecks([...decks, createdDeck]);

            // setTimeout using a timeout of 0 milliseconds to execute after the re-render
            setTimeout(() => {
                navigate(`/decks/${newDeck.id}`); // Redirect to the DeckView for the newly created deck
            }, 0);
        } catch (error) {
            console.error("Error creating deck:", error);
        }
    };

    const handleCancel = () => {
        // If the user clicks Cancel, go back to the Home screen
        navigate("/");
    };

    const breadcrumbPaths = [
        { link: "/", text: "Home" },
        {
            text: "Create Deck",
        },
    ];

    return (
        <div>
            <Breadcrumb paths={breadcrumbPaths} />
            <h1>Create Deck</h1>
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

export default CreateDeck;