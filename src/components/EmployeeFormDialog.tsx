import React, { useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";

interface EmployeeFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: EmployeeFormData) => void;
    cafes: Array<{ _id: string; name: string }>; // List of cafes for the dropdown
    employeeData?: EmployeeFormData; // Optional for editing existing employee
}

interface EmployeeFormData {
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
        reset,
        formState: { errors },
    } = useForm<EmployeeFormData>();

    useEffect(() => {
        if (employeeData) {
            reset(employeeData); // Reset the form with employee data when editing
        }
    }, [employeeData, reset]);

    const onFormSubmit = (data: EmployeeFormData) => {
        onSubmit(data);
        reset(); // Reset form after submission
        onClose(); // Close the dialog
    };

    const handleCloseDialog = () => {
        console.log("hi");
        if (
            confirm(
                "Are you sure you want to quit? You will lose unsaved changes!"
            ) === false
        ) {
            return;
        } else {
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleCloseDialog}>
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
                                <MenuItem key={cafe._id} value={cafe._id}>
                                    {cafe.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
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
