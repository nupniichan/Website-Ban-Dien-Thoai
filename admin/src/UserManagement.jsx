import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography
} from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

const usersData = [
    {
        id: "U001",
        name: "Nguyễn Văn A",
        createdDate: "01/01/2023",
        shippingAddress: "Hà Nội",
    },
    {
        id: "U002",
        name: "Trần Thị B",
        createdDate: "15/03/2023",
        shippingAddress: "Đà Nẵng",
    },
    {
        id: "U003",
        name: "Lê Văn C",
        createdDate: "22/05/2023",
        shippingAddress: "TP Hồ Chí Minh",
    },
];

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState(usersData);

    const handleViewDetails = (user) => {
        setSelectedUser(user);
    };

    const handleCloseDialog = () => {
        setSelectedUser(null);
    };

    const handleDeleteUser = (userId) => {
        setUsers(users.filter((user) => user.id !== userId));
    };

    const handleAddUser = () => {
        const newUser = {
            id: `U00${users.length + 1}`,
            name: "Nguyễn Văn D",
            createdDate: new Date().toLocaleDateString("vi-VN"),
            shippingAddress: "Huế",
        };
        setUsers([...users, newUser]);
    };

    const filteredUsers = users.filter((user) => {
        return (
            user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <>
            <h3>Quản lý người dùng</h3>
            <Box padding={3}>
                {/* Thanh tìm kiếm */}
                <TextField
                    label="Tìm kiếm người dùng"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    margin="normal"
                />

                {/* Nút thêm người dùng */}
                <Box marginBottom={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddUser}
                    >
                        Thêm người dùng
                    </Button>
                </Box>

                {/* Danh sách người dùng */}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Ngày tạo tài khoản</TableCell>
                            <TableCell>Địa chỉ giao hàng</TableCell>
                            <TableCell>Chi tiết</TableCell>
                            <TableCell>Chức năng</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.createdDate}</TableCell>
                                <TableCell>{user.shippingAddress}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleViewDetails(user)}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() =>
                                            handleDeleteUser(user.id)
                                        }
                                    >
                                        Xóa
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Dialog Chi tiết người dùng */}
                {selectedUser && (
                    <Dialog open={true} onClose={handleCloseDialog}>
                        <DialogTitle>Chi tiết người dùng</DialogTitle>
                        <DialogContent>
                            <Typography>ID: {selectedUser.id}</Typography>
                            <Typography>Tên: {selectedUser.name}</Typography>
                            <Typography>
                                Ngày tạo tài khoản: {selectedUser.createdDate}
                            </Typography>
                            <Typography>
                                Địa chỉ giao hàng:{" "}
                                {selectedUser.shippingAddress}
                            </Typography>
                        </DialogContent>
                    </Dialog>
                )}
            </Box>
        </>
    );
};

export default UserManagement;
