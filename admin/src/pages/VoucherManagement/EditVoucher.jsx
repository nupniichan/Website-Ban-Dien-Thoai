import { useState, useEffect } from "react";
import { Box, TextField, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config";

const EditVoucher = () => {
    const { voucherId } = useParams();
    const navigate = useNavigate();
    const [voucher, setVoucher] = useState({
        name: '',
        usageDate: '', // Changed to match the Express route
        expirationDate: '', // Changed to match the Express route
        discountRate: 0,
        applicableCode: '', // Changed to match the Express route
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVoucher = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/vouchers/${voucherId}`);
                setVoucher(response.data);
            } catch (error) {
                console.error("Error fetching voucher:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVoucher();
    }, [voucherId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVoucher((prevVoucher) => ({
            ...prevVoucher,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${BASE_URL}/api/discountCodes/${voucherId}`, voucher, {
                headers: { "Content-Type": "application/json" },
            });
            if (response.status === 200) {
                alert("Voucher updated successfully");
                navigate("/voucher-management");
            } else {
                alert("Failed to update voucher");
            }
        } catch (error) {
            console.error("Error updating voucher:", error);
        }
    };

    if (loading) return <CircularProgress />;
    if (!voucher) return <div>Voucher does not exist</div>;

    return (
        <Box padding={3}>
            <Typography variant="h4" gutterBottom>
                Edit Voucher
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Voucher Name"
                            name="name"
                            value={voucher.name}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Usage Date"
                            name="usageDate"
                            type="date"
                            value={voucher.usageDate.split('T')[0]} // Format for input
                            onChange={handleInputChange}
                            fullWidth
                            required
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Expiration Date"
                            name="expirationDate"
                            type="date"
                            value={voucher.expirationDate.split('T')[0]} // Format for input
                            onChange={handleInputChange}
                            fullWidth
                            required
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Discount Rate (%)"
                            name="discountRate"
                            type="number"
                            value={voucher.discountRate}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            margin="normal"
                            inputProps={{ min: 0, max: 100 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Applicable Code"
                            name="applicableCode"
                            value={voucher.applicableCode}
                            onChange={handleInputChange}
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
                        Update Voucher
                    </Button>
                    <Button
                        onClick={() => navigate("/voucher-management")}
                        variant="outlined"
                        color="secondary"
                        size="large"
                        style={{ marginLeft: "16px" }}
                    >
                        Cancel
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default EditVoucher;


