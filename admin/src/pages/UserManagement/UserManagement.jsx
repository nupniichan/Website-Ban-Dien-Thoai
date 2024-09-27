import { useState, useEffect } from "react";
import { Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, DialogTitle, DialogContent, IconButton} from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const exampleUsers = [
    {
        id: "U001",
        name: "Nguyễn Văn A",
        creationDate: "2024/05/23",
        shippingAddress: "Hà Nội",
    },
    {
        id: "U003",
        name: "Lê Văn C",
        creationDate: "2023/09/12",
        shippingAddress: "TP Hồ Chí Minh",
    },
];

const UserManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState(exampleUsers);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/users");
                if (response.status === 200) {
                    const data = response.data;
                    setUsers(data);
                } else {
                    console.error(`Failed to fetch users: ${response.status} ${response.statusText}`);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleViewDetails = (user) => {
        setSelectedUser(user);
    };

    const handleCloseDialog = () => {
        setSelectedUser(null);
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/users/${userId}`,
                {
                    method: "DELETE",
                }
            );
            if (response.ok) {
                setUsers(users.filter((user) => user.id !== userId));
            } else {
                console.error("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleAddUser = () => {
        navigate("/add-user");
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id.includes(searchTerm)
    );

    return (
        <Box padding={3}>
            <Typography variant="h4" gutterBottom>
                Quản lý người dùng
            </Typography>

            <TextField
                label="Tìm kiếm người dùng"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                margin="normal"
            />

            <Box marginY={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddUser}
                >
                    Thêm người dùng
                </Button>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Ngày tạo tài khoản</TableCell>
                            <TableCell>Địa chỉ giao hàng</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{(new Date(user.creationDate).toLocaleDateString("vi-VN"))}</TableCell>
                                <TableCell>{user.shippingAddress}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleViewDetails(user)}
                                        color="primary"
                                    >
                                        <Visibility />
                                    </IconButton>
                                    <IconButton
                                        onClick={() =>
                                            handleDeleteUser(user.id)
                                        }
                                        color="error"
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {selectedUser && (
            <Dialog open={true} onClose={handleCloseDialog}>
                <DialogTitle>Chi tiết người dùng</DialogTitle>
                <DialogContent>
                    <Typography>ID: {selectedUser.id}</Typography>
                    <Typography>Tên: {selectedUser.name}</Typography>
                    <Typography>Ngày tạo tài khoản: {(new Date(selectedUser.creationDate).toLocaleDateString("vi-VN"))}</Typography>
                    <Typography>Địa chỉ giao hàng: {selectedUser.shippingAddress}</Typography>
                </DialogContent>
            </Dialog>
)}

        </Box>
    );
};

export default UserManagement;
