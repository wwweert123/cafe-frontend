import React, { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";

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

const EmployeesPage: React.FC = () => {
    // Use the useQuery hook to fetch and cache employees data
    const {
        data: employees,
        error,
        isLoading,
    } = useQuery({ queryKey: ["employees"], queryFn: fetchEmployees });

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
    const handleEdit = (data: Employee) => {
        console.log("Edit clicked for:", data);
    };

    const handleDelete = (id: string) => {
        console.log("Delete clicked for ID:", id);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error instanceof Error) return <div>Error: {error.message}</div>;

    return (
        <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
            <h1>Employees</h1>
            <AgGridReact
                rowData={employees}
                columnDefs={columnDefs}
                domLayout="autoHeight"
            />
        </div>
    );
};

export const Route = createFileRoute("/employee")({
    component: EmployeesPage,
});
