import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";

// Define the interface for a Cafe
interface Cafe {
    id: string;
    name: string;
    description: string;
    location: string;
    logo?: string; // Optional logo field
}

function IndexComponent() {
    const [cafes, setCafes] = useState<Cafe[]>([]);

    useEffect(() => {
        // Fetch cafes from the backend
        fetch("http://127.0.0.1:3500/cafes")
            .then((response) => response.json())
            .then((data) => setCafes(data))
            .catch((error) => console.error("Error fetching cafes:", error));
    }, []);

    return (
        <div>
            Hello /cafe!
            <div>
                <h1>Cafes</h1>
                <ul>
                    {cafes.map((cafe) => (
                        <li key={cafe.id}>
                            <strong>{cafe.name}</strong> - {cafe.description} (
                            {cafe.location})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export const Route = createFileRoute("/")({
    component: IndexComponent,
});
