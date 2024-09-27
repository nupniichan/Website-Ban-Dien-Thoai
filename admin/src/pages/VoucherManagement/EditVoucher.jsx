import { useState, useEffect } from "react";
import { Box, TextField, Button, CircularProgress, Grid, Typography} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditVoucher = () => {
    const { voucherId } = useParams();
    const navigate = useNavigate();
    const [voucher, setVoucher] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVoucher = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/vouchers/${voucherId}`);
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
        setVoucher({ ...voucher, [name]: value });
    };

    const handleSubmit = async (e) => { e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/vouchers/${voucherId}`,voucher,
                {
                    headers: {"Content-Type": "application/json",},
                }
            );
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

    // Format date to 'YYYY-MM-DD' for date input
    /* const formatDate = (date) => {
        const d = new Date(date);
        const formattedDate = d.toISOString().split("T")[0]; // Extract YYYY-MM-DD
        return formattedDate;
    }; */

    if (loading) return <CircularProgress />;
    if (!voucher) return <div>Voucher không tồn tại</div>;

    return (
        <Box padding={3}>
            <Typography variant="h4" gutterBottom>
                Chỉnh sửa Voucher
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
                            label="Start Date"
                            name="startDate"
                            type="date"
                            value={(new Date(voucher.startDate).toLocaleDateString("vi-VN"))}
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
                            label="End Date"
                            name="endDate"
                            type="date"
                            value={(new Date(voucher.endDate).toLocaleDateString("vi-VN"))}
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
                            label="Apply Code"
                            name="applyCode"
                            value={voucher.applyCode}
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
                        Cập nhật Voucher
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

export default EditVoucher;
