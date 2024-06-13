import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDeck } from "../utils/api";
import DeckForm from "./Form";
import Breadcrumb from "../Home/Breadcrumbs";

function CreateDeck({ decks = [], setDecks }) {
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.name || !formData.description) {
            alert("Please fill out all required fields.");
            return;
        }

        const newDeck = {
            id: decks.length + 1,
            ...formData,
            cards: [],
        };

        try {
            const createdDeck = await createDeck(newDeck);

            setDecks([...decks, createdDeck]);

            setTimeout(() => {
                navigate(`/decks/${createdDeck.id}`);
            }, 0);
        } catch (error) {
            console.error("Error creating deck:", error);
            alert("An error occurred while creating the deck. Please try again.");
        }
    };

    const handleCancel = () => {
        navigate("/");
    };

    const breadcrumbPaths = [
        { link: "/", text: "Home" },
        { text: "Create Deck" },
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
