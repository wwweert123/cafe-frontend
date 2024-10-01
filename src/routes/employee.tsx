import React, { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@mui/material";
import EmployeeFormDialog from "../components/EmployeeFormDialog";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";

// Define the interface for an Employee
interface Employee {
    id: string;
    name: string;
    email_address: string;
    phone_number: string;
    gender: "Male" | "Female";
}

// Fetcher function to get employees data
const fetchEmployees = async (): Promise<Employee[]> => {
    const response = await fetch("http://localhost:3500/employees");
    if (!response.ok) {
        throw new Error("Error fetching employees");
    }
    return response.json();
};

// Fetcher function to get cafes for dropdown
const fetchCafes = async (): Promise<any[]> => {
    const response = await fetch("http://localhost:3500/cafes");
    if (!response.ok) {
        throw new Error("Error fetching cafes");
    }
    return response.json();
};

const EmployeesPage: React.FC = () => {
    // Use the useQuery hook to fetch and cache employees data
    const {
        data: employees,
        error,
        isLoading,
    } = useQuery({ queryKey: ["employees"], queryFn: fetchEmployees });
    const {
        data: cafes,
        error: cafesError,
        isLoading: isLoadingCafes,
    } = useQuery({ queryKey: ["cafes"], queryFn: fetchCafes });

    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        null
    );

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<any | null>(null);

    const queryClient = useQueryClient();

    // Employee Form Dialog
    const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
    const handleOpenDialog = (employee?: Employee | null) => {
        setSelectedEmployee(employee || null);
        setOpenEmployeeDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenEmployeeDialog(false);
        setSelectedEmployee(null);
    };

    // Define columns for the AG Grid
    const columnDefs = useMemo(
        () => [
            { headerName: "Employee ID", field: "id" },
            { headerName: "Name", field: "name" },
            { headerName: "Email Address", field: "email_address" },
            { headerName: "Phone Number", field: "phone_number" },
            { headerName: "Days Worked", field: "days_worked" },
            { headerName: "Café Name", field: "cafe_name" },
            {
                headerName: "Actions",
                cellRenderer: (params: any) => (
                    <div>
                        <button onClick={() => handleEdit(params.data)}>
                            Edit
                        </button>
                        <button
                            onClick={() => handleOpenDeleteDialog(params.data)}
                        >
                            Delete
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    // Handlers for edit and delete actions
    const handleEdit = (data: Employee) => {
        console.log("Edit clicked for:", data);
    };

    // Handle form submission for adding or editing an employee
    const handleFormSubmit = async (data: any) => {
        const endpoint = "http://localhost:3500/employees";
        const method = selectedEmployee ? "PUT" : "POST";
        console.log(data);
        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    email_address: data.email_address,
                    phone_number: data.phone_number,
                    gender: data.gender,
                    cafe: data.assignedCafe,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit employee");
            }

            // Refetch the employee data after adding or updating
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        } catch (error) {
            console.error("Error:", error);
        }

        setOpenEmployeeDialog(false);
        setSelectedEmployee(null);
    };

    // Open the Delete Confirmation Dialog
    const handleOpenDeleteDialog = (employee: any) => {
        setEmployeeToDelete(employee);
        setOpenDeleteDialog(true); // Open the delete confirmation dialog
    };

    // Handle Confirming the Delete
    const handleDeleteConfirm = async () => {
        if (!employeeToDelete) return;

        try {
            const response = await fetch(
                `http://localhost:3500/employees/${employeeToDelete.id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete employee");
            }

            // Refetch the employee data after deleting
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        } catch (error) {
            console.error("Error deleting employee:", error);
        }

        // Reset delete state after deletion
        setOpenDeleteDialog(false);
        setEmployeeToDelete(null);
    };

    if (isLoading || isLoadingCafes) return <div>Loading...</div>;
    if (error instanceof Error || cafesError instanceof Error)
        return (
            <div>
                Error: {error?.message} {cafesError?.message}
            </div>
        );

    return (
        <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
            <h1>Employees</h1>
            <AgGridReact
                rowData={employees}
                columnDefs={columnDefs}
                domLayout="autoHeight"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenDialog(null)}
            >
                Add New Employee
            </Button>
            <EmployeeFormDialog
                open={openEmployeeDialog}
                onClose={handleCloseDialog}
                onSubmit={handleFormSubmit}
                cafes={cafes} // Pass cafes to the form dropdown
                employeeData={selectedEmployee} // Pass selected employee for editing
            />
            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={handleDeleteConfirm}
                itemName={employeeToDelete ? employeeToDelete.name : "Employee"}
            />
        </div>
    );
};

export const Route = createFileRoute("/employee")({
    component: EmployeesPage,
});
