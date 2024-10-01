import React, { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Define the interface for a Cafe
interface Cafe {
    id: string;
    name: string;
    description: string;
    location: string;
    logo?: string; // Optional logo field
}

// Fetcher function to get cafes data
const fetchCafes = async (): Promise<Cafe[]> => {
    const response = await fetch("http://localhost:3500/cafes");
    if (!response.ok) {
        throw new Error("Error fetching cafes");
    }
    return response.json();
};

const CafeComponent: React.FC = () => {
    // Use the useQuery hook to fetch and cache cafes data
    const {
        data: cafes,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["cafes"],
        queryFn: fetchCafes,
    });

    // Define columns for the AG Grid
    const columnDefs = useMemo(
        () => [
            {
                headerName: "Logo",
                field: "logo",
                cellRenderer: (params: { value: string | undefined }) =>
                    params.value ? (
                        <img
                            src={params.value}
                            alt="Logo"
                            style={{ width: "50px" }}
                        />
                    ) : (
                        "No logo"
                    ),
            },
            { headerName: "Name", field: "name" },
            { headerName: "Description", field: "description" },
            { headerName: "Employees", field: "employees" },
            { headerName: "Location", field: "location" },
            {
                headerName: "Actions",
                cellRenderer: (params: { data: Cafe }) => (
                    <div>
                        <button onClick={() => handleEdit(params.data)}>
                            Edit
                        </button>
                        <button onClick={() => handleDelete(params.data.id)}>
                            Delete
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    // Handlers for edit and delete actions
    const handleEdit = (data: Cafe) => {
        console.log("Edit clicked for:", data);
    };

    const handleDelete = (id: string) => {
        console.log("Delete clicked for ID:", id);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error instanceof Error) return <div>Error: {error.message}</div>;

    return (
        <div>
            Hello /cafe!
            <div
                className="ag-theme-alpine"
                style={{ height: 600, width: "100%" }}
            >
                <h1>Cafes</h1>
                <AgGridReact
                    rowData={cafes}
                    columnDefs={columnDefs}
                    domLayout="autoHeight"
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute("/")({
    component: CafeComponent,
});
