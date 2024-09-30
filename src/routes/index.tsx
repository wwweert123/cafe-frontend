import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

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

    if (isLoading) return <div>Loading...</div>;
    if (error instanceof Error) return <div>Error: {error.message}</div>;

    return (
        <div>
            Hello /cafe!
            <div>
                <h1>Cafes</h1>
                <ul>
                    {cafes?.map((cafe) => (
                        <li key={cafe.id}>
                            <strong>{cafe.name}</strong> - {cafe.description} (
                            {cafe.location})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export const Route = createFileRoute("/")({
    component: CafeComponent,
});
