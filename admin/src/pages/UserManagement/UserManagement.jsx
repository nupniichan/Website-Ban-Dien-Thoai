import { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/users");
                if (response.ok) {
                    const data = await response.json();
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
                <Button variant="contained" color="primary" onClick={handleAddUser}>
                    Thêm người dùng
                </Button>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Họ tên</TableCell>
                            <TableCell>Số điện thoại liên lạc</TableCell>
                            <TableCell>Địa chỉ giao hàng</TableCell>
                            <TableCell>Quyền truy cập</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.phoneNumber}</TableCell>
                                <TableCell>{user.address}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleViewDetails(user)}
                                        color="primary"
                                    >
                                        <Visibility />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDeleteUser(user.id)}
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
                        <Typography>Ngày sinh: {selectedUser.dayOfBirth}</Typography>
                        <Typography>Giới tính: {selectedUser.gender}</Typography>
                        <Typography>Email: {selectedUser.email}</Typography>
                        <Typography>Số điện thoại: {selectedUser.phoneNumber}</Typography>
                        <Typography>Địa chỉ giao hàng: {selectedUser.address}</Typography>
                        <Typography>Tên tài khoản: {selectedUser.accountName}</Typography>
                        <Typography>Mật khẩu: {selectedUser.password}</Typography>
                    </DialogContent>
                </Dialog>
            )}
        </Box>
    );
};

export default UserManagement;
