import React, { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import { Button, Stack, Typography } from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import CafeFormDialog from "../components/CafeFormDialog";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";

// Define the interface for a Cafe
interface Cafe {
    id: string;
    name: string;
    description: string;
    location: string;
    logo?: string; // Optional logo field
}

interface CafeFormData {
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

    const queryClient = useQueryClient();

    // Cafe Form Dialog
    const [openCafeDialog, setOpenCafeDialog] = useState(false);

    const handleOpenDialog = (cafe?: any) => {
        setSelectedCafe(cafe || null);
        setOpenCafeDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenCafeDialog(false);
        setSelectedCafe(null);
    };

    // Handle form submission to send only name, description, and location
    const handleFormSubmit = async (data: CafeFormData) => {
        console.log("Form Submitted:", data);
        console.log(selectedCafe);

        const endpoint = "http://127.0.0.1:3500/cafes";
        const method = selectedCafe?.id ? "PUT" : "POST";

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    "Content-Type": "application/json", // Sending data as JSON
                },
                body: JSON.stringify({
                    id: selectedCafe ? selectedCafe.id : null,
                    name: data.name,
                    description: data.description,
                    location: data.location,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit café");
            }

            console.log("Café created/updated successfully");
            queryClient.invalidateQueries({ queryKey: ["cafes"] });
        } catch (error) {
            console.error("Error:", error);
        }

        // Close the dialog after submission
        setOpenCafeDialog(false);
        setSelectedCafe(null);
    };

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
            {
                headerName: "Employees",
                cellRenderer: (params: any) => (
                    <Stack direction="row" spacing={2} justifyItems="center">
                        <Typography>{params.data.employees}</Typography>
                        <Link
                            to="/employee/$id"
                            params={{
                                id: params.data._id,
                            }}
                        >
                            <Button variant="contained" color="primary">
                                View Employee
                            </Button>
                        </Link>
                    </Stack>
                ),
            },
            { headerName: "Location", field: "location" },
            {
                headerName: "Actions",
                cellRenderer: (params: { data: Cafe }) => (
                    <div>
                        <button onClick={() => handleOpenDialog(params.data)}>
                            Edit
                        </button>
                        <button onClick={() => handleDeleteClick(params.data)}>
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

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);

    // Open the delete confirmation dialog
    const handleDeleteClick = (cafe: Cafe) => {
        setSelectedCafe(cafe);
        setOpenDeleteDialog(true); // Open the dialog when delete button is clicked
    };

    // Handle the actual deletion
    const handleDeleteConfirm = async () => {
        if (!selectedCafe) return;

        try {
            const response = await fetch(
                `http://127.0.0.1:3500/cafes/${selectedCafe.id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete café");
            }

            // Refetch the cafes after successful deletion
            queryClient.invalidateQueries({ queryKey: ["cafes"] });
        } catch (error) {
            console.error("Error:", error);
        }

        setOpenDeleteDialog(false); // Close the dialog
        setSelectedCafe(null); // Clear selected café
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
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenDialog(null)}
            >
                Add New Café
            </Button>
            {/* Form Dialog for adding/editing a café */}
            <CafeFormDialog
                open={openCafeDialog}
                onClose={handleCloseDialog}
                onSubmit={handleFormSubmit}
                cafeData={selectedCafe}
            />
            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={handleDeleteConfirm}
                itemName={selectedCafe ? selectedCafe.name : "Café"}
            />
        </div>
    );
};

export const Route = createFileRoute("/")({
    component: CafeComponent,
});
