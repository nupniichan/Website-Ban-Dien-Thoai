import { useState } from "react";
import { Box, TextField, Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddUser = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        shippingAddress: "",
        creationDate: new Date().toISOString(),
        userId: "", // left empty for backend to generate
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Generate temporary userId in the format U001, U208, etc. if needed (if backend doesn't handle)
        const generateUserId = () => {
            const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // Replace with actual ID logic if needed
            return `U${randomNum}`;
        };
        const updatedUser = { ...user, userId: user.userId || generateUserId() };

        try {
            const response = await axios.post("http://localhost:5000/api/users", updatedUser, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 201) { // Assuming 201 is the success status for creation
                alert("User created successfully");
                navigate("/user-management");
            } else {
                alert("Failed to create user");
            }
        } catch (error) {
            console.error("Error creating user:", error);
            alert("An error occurred while creating the user");
        }
    };

    return (
        <Box padding={3}>
            <Typography variant="h4" gutterBottom>
                Thêm người dùng
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Tên"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={user.email}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Mật khẩu"
                            name="password"
                            type="password"
                            value={user.password}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Số điện thoại"
                            name="phoneNumber"
                            value={user.phoneNumber}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Địa chỉ giao hàng"
                            name="shippingAddress"
                            value={user.shippingAddress}
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
                        Thêm người dùng
                    </Button>
                    <Button
                        onClick={() => navigate("/user-management")}
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

export default AddUser;
