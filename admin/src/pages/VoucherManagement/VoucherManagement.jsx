import { useState, useEffect } from "react";
import { Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, DialogTitle, DialogContent, IconButton} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const exampleVouchers = [
    {
        id: "V001",
        name: "GIAM10",
        startDate: "24/11/2023",
        endDate: "31/12/2023",
        discountRate: 10,
        applyCode: "ALL"
    },
    {
        id: "V002",
        name: "MUADOI",
        startDate: "01/12/2023",
        endDate: "10/12/2023",
        discountRate: 50,
        applyCode: "SP001"
    }
];

const VoucherManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [vouchers, setVouchers] = useState(exampleVouchers);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/vouchers");
                if (response.status === 200) {
                    const data = response.data;
                    setVouchers(data);
                } else {
                    console.error(`Failed to fetch vouchers: ${response.status} ${response.statusText}`);
                }
            } catch (error) {
                console.error("Error fetching vouchers:", error);
            }
        };
        fetchVouchers();
    }, []);

    const handleViewDetails = (voucher) => {
        setSelectedVoucher(voucher);
    };

    const handleCloseDialog = () => {
        setSelectedVoucher(null);
    };

    const handleDeleteVoucher = async (voucherId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/vouchers/${voucherId}`);
            if (response.status === 200) {
                setVouchers(vouchers.filter((voucher) => voucher.id !== voucherId));
            } else {
                console.error("Failed to delete voucher");
            }
        } catch (error) {
            console.error("Error deleting voucher:", error);
        }
    };

    const handleAddVoucher = () => {
        navigate("/add-voucher");
    };

    const handleEditVoucher = (voucherId) => {
        navigate(`/edit-voucher/${voucherId}`);
    };

    const filteredVouchers = vouchers.filter(
        (voucher) =>
            voucher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            voucher.id.includes(searchTerm)
    );

    return (
        <Box padding={3}>
            <Typography variant="h4" gutterBottom>
                Quản lý mã giảm giá
            </Typography>

            <TextField
                label="Tìm kiếm mã giảm giá"
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
                    onClick={handleAddVoucher}
                >
                    Thêm mã giảm giá
                </Button>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tên mã</TableCell>
                            <TableCell>Ngày sử dụng</TableCell>
                            <TableCell>Ngày hết hạn</TableCell>
                            <TableCell>Tỉ lệ chiết khấu</TableCell>
                            <TableCell>Mã áp dụng</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredVouchers.map((voucher) => (
                            <TableRow key={voucher.id}>
                                <TableCell>{voucher.id}</TableCell>
                                <TableCell>{voucher.name}</TableCell>
                                <TableCell>{voucher.startDate}</TableCell>
                                <TableCell>{voucher.endDate}</TableCell>
                                <TableCell>{voucher.discountRate}%</TableCell>
                                <TableCell>{voucher.applyCode}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() =>
                                            handleViewDetails(voucher)
                                        }
                                        color="primary"
                                    >
                                        <Visibility />
                                    </IconButton>
                                    <IconButton
                                        onClick={() =>
                                            handleEditVoucher(voucher.id)
                                        }
                                        color="secondary"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        onClick={() =>
                                            handleDeleteVoucher(voucher.id)
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

            {selectedVoucher && (
                <Dialog open={true} onClose={handleCloseDialog}>
                    <DialogTitle>Chi tiết mã giảm giá</DialogTitle>
                    <DialogContent>
                        <Typography>ID: {selectedVoucher.id}</Typography>
                        <Typography>Tên mã: {selectedVoucher.name}</Typography>
                        <Typography>
                            Ngày sử dụng: {selectedVoucher.startDate}
                        </Typography>
                        <Typography>
                            Ngày hết hạn: {selectedVoucher.endDate}
                        </Typography>
                        <Typography>
                            Tỉ lệ chiết khấu: {selectedVoucher.discountRate}%
                        </Typography>
                        <Typography>
                            Mã áp dụng: {selectedVoucher.applyCode}
                        </Typography>
                    </DialogContent>
                </Dialog>
            )}
        </Box>
    );
};

export default VoucherManagement;