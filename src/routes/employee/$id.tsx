import { createFileRoute } from "@tanstack/react-router";
import EmployeesPage from "../../Pages/EmployeesPage";

export const Route = createFileRoute("/employee/$id")({
    component: EmployeesPage,
});
