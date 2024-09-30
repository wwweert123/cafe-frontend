import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

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

    if (isLoading) return <div>Loading...</div>;
    if (error instanceof Error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Employees</h1>
            <ul>
                {employees?.map((employee) => (
                    <li key={employee.id}>
                        <strong>{employee.name}</strong> -{" "}
                        {employee.email_address} - {employee.phone_number}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const Route = createFileRoute("/employee")({
    component: EmployeesPage,
});
