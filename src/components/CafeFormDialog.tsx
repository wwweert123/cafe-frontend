import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";

// Interface for the form data
interface CafeFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CafeFormData) => void;
    cafeData?: CafeFormData; // Optional for editing existing cafe
}

// Interface for form data
interface CafeFormData {
    name: string;
    description: string;
    location: string;
    logo?: File | null;
}

const CafeFormDialog: React.FC<CafeFormDialogProps> = ({
    open,
    onClose,
    onSubmit,
    cafeData,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CafeFormData>({
        defaultValues: cafeData || {
            name: "",
            description: "",
            location: "",
            logo: null,
        },
    });

    const [logoError, setLogoError] = useState("");

    // Validate logo file size (max 2MB)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.size > 2 * 1024 * 1024) {
            setLogoError("File size exceeds 2MB.");
        } else {
            setLogoError("");
        }
    };

    // Handle form submission
    const onFormSubmit = (data: CafeFormData) => {
        if (logoError) return; // If there is a logo error, do not proceed
        onSubmit(data); // Call the submit handler
        reset(); // Reset the form
        onClose(); // Close the dialog
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{cafeData ? "Edit Café" : "Add New Café"}</DialogTitle>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <DialogContent>
                    {/* Name Input */}
                    <TextField
                        label="Name"
                        fullWidth
                        margin="dense"
                        {...register("name", {
                            required: "Name is required",
                            minLength: 6,
                            maxLength: 10,
                        })}
                        error={!!errors.name}
                        helperText={
                            errors.name
                                ? "Name must be between 6 and 10 characters"
                                : ""
                        }
                    />

                    {/* Description Input */}
                    <TextField
                        label="Description"
                        fullWidth
                        margin="dense"
                        multiline
                        rows={4}
                        {...register("description", {
                            required: "Description is required",
                            maxLength: 256,
                        })}
                        error={!!errors.description}
                        helperText={
                            errors.description
                                ? "Max 256 characters allowed"
                                : ""
                        }
                    />

                    {/* Location Input */}
                    <TextField
                        label="Location"
                        fullWidth
                        margin="dense"
                        {...register("location", {
                            required: "Location is required",
                        })}
                        error={!!errors.location}
                        helperText={
                            errors.location ? "Location is required" : ""
                        }
                    />

                    {/* Logo Input */}
                    <input
                        type="file"
                        accept="image/*"
                        {...register("logo")}
                        onChange={handleFileChange}
                    />
                    {logoError && <p style={{ color: "red" }}>{logoError}</p>}
                </DialogContent>
                <DialogActions>
                    {/* Cancel Button */}
                    <Button onClick={onClose} color="secondary">
                        Cancel
                    </Button>
                    {/* Submit Button */}
                    <Button type="submit" color="primary">
                        {cafeData ? "Update" : "Submit"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CafeFormDialog;
