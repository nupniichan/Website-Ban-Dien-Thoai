import { useState } from "react";
import { Box, TextField, Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddVoucher = () => {
    const navigate = useNavigate();
    const [voucher, setVoucher] = useState({
        name: "",
        startDate: "",
        endDate: "",
        discountRate: 0,
        applyCode: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVoucher({ ...voucher, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/api/addDiscountCodes", {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                alert("Voucher created successfully");
                navigate("/voucher-management");
            } else {
                alert("Failed to create voucher");
            }
        } catch (error) {
            console.error("Error creating voucher:", error);
        }
    };

    return (
        <Box padding={3}>
            <Typography variant="h4" gutterBottom>
                Thêm voucher mới
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Voucher Name"
                            name="name"
                            value={voucher.name}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Start Date"
                            name="startDate"
                            type="date"
                            value={voucher.startDate}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="End Date"
                            name="endDate"
                            type="date"
                            value={voucher.endDate}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                            min={voucher.startDate}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Discount Rate (%)"
                            name="discountRate"
                            type="number"
                            value={voucher.discountRate}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                            inputProps={{ min: 0, max: 100 }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Apply Code"
                            name="applyCode"
                            value={voucher.applyCode}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                    </Grid>
                </Grid>

                <Box mt={3}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                    >
                        Thêm voucher
                    </Button>
                    <Button
                        onClick={() => navigate("/voucher-management")}
                        variant="outlined"
                        color="secondary"
                        size="large"
                        style={{ marginLeft: "16px" }}
                    >
                        Huỷ
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default AddVoucher;
