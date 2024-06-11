import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { readCard, readDeck, updateCard } from "../utils/api";
import Breadcrumb from "../Home/Breadcrumbs";
import CardForm from "./Form";

function EditCard() {
    const { deckId, cardId } = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState({});
    const [formData, setFormData] = useState({
        front: "",
        back: "",
    });
    const [currentDeck, setCurrentDeck] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCardAndDeck = async () => {
            try {
                const loadedCard = await readCard(cardId);
                const loadedDeck = await readDeck(deckId);

                setCard(loadedCard);
                setFormData({
                    front: loadedCard.front,
                    back: loadedCard.back,
                });
                setCurrentDeck(loadedDeck);
                setLoading(false);
            } catch (error) {
                console.error("Error loading card and deck:", error);
                setError("Error loading card and deck.");
                setLoading(false);
            }
        };

        loadCardAndDeck();
    }, [deckId, cardId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const updatedCard = {
            ...card,
            front: formData.front,
            back: formData.back,
        };

        try {
            await updateCard(updatedCard);
            navigate(`/decks/${deckId}`);
        } catch (error) {
            console.error("Error updating card:", error);
            setError("Error updating card.");
        }
    };

    const handleCancel = () => {
        navigate(`/decks/${deckId}`);
    };

    const breadcrumbPaths = [
        { link: "/", text: "Home" },
        {
            link: `/decks/${deckId}`,
            text: currentDeck ? currentDeck.name : "Error loading deck name.",
        },
        {
            text: "Edit Card",
        },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div>
            <Breadcrumb paths={breadcrumbPaths} />
            <h1>Edit Card</h1>
            <CardForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                buttonDismissText="Cancel"
                buttonConfirmText="Submit"
            />
        </div>
    );
}

export default EditCard;
