import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    FormControl,
    InputLabel,
    RadioGroup,
    Select,
    FormControlLabel,
    Radio,
    MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";

// Interface for the form data
interface EmployeeFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: EmployeeFormData) => Promise<void>;
    cafes: Array<{ id: string; name: string }>; // List of cafes for the dropdown
    employeeData?: EmployeeFormData | null; // Optional for editing existing cafe
}

// Interface for form data
interface EmployeeFormData {
    id: string;
    name: string;
    email_address: string;
    phone_number: string;
    gender: "Male" | "Female";
    assignedCafe: string;
}

const EmployeeFormDialog: React.FC<EmployeeFormDialogProps> = ({
    open,
    onClose,
    onSubmit,
    cafes,
    employeeData,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<EmployeeFormData>({
        defaultValues: employeeData || {
            name: "",
            email_address: "",
            phone_number: "",
            gender: "Male",
        },
    });

    useEffect(() => {
        // Reset form fields with existing café data when dialog is opened for editing
        if (employeeData) {
            reset(employeeData);
        }
    }, [employeeData, reset]);

    // Handle form submission
    const onFormSubmit = (data: EmployeeFormData) => {
        console.log("hi");
        onSubmit(data); // Call the submit handler
        reset(); // Reset the form
        onClose(); // Close the dialog
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {employeeData ? "Edit Employee" : "Add New Employee"}
            </DialogTitle>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <DialogContent>
                    {/* Name Input */}
                    <TextField
                        label="Name"
                        fullWidth
                        margin="dense"
                        {...register("name", {
                            required: true,
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

                    {/* Email Address Input */}
                    <TextField
                        label="Email Address"
                        fullWidth
                        margin="dense"
                        {...register("email_address", {
                            required: true,
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: "Invalid email address",
                            },
                        })}
                        error={!!errors.email_address}
                        helperText={errors.email_address?.message || ""}
                    />

                    {/* Phone Number Input */}
                    <TextField
                        label="Phone Number"
                        fullWidth
                        margin="dense"
                        {...register("phone_number", {
                            required: true,
                            pattern: {
                                value: /^[89]\d{7}$/,
                                message:
                                    "Phone number must start with 8 or 9 and have 8 digits",
                            },
                        })}
                        error={!!errors.phone_number}
                        helperText={errors.phone_number?.message || ""}
                    />

                    {/* Gender Radio Button Group */}
                    <FormControl component="fieldset" margin="dense">
                        <RadioGroup
                            row
                            {...register("gender", { required: true })}
                        >
                            <FormControlLabel
                                value="Male"
                                control={<Radio />}
                                label="Male"
                            />
                            <FormControlLabel
                                value="Female"
                                control={<Radio />}
                                label="Female"
                            />
                        </RadioGroup>
                    </FormControl>

                    {/* Assigned Café Dropdown */}
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Assigned Café</InputLabel>
                        <Select
                            {...register("assignedCafe", { required: true })}
                            defaultValue={employeeData?.assignedCafe || ""}
                        >
                            {cafes.map((cafe) => (
                                <MenuItem key={cafe.id} value={cafe.id}>
                                    {cafe.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        {employeeData ? "Update" : "Submit"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EmployeeFormDialog;
