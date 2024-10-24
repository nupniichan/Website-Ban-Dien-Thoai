import { useState, useEffect } from "react";
import { Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, DialogTitle, DialogContent, IconButton} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {format} from "date-fns"
import axios from "axios";
import { BASE_URL } from '../../config.js'

const exampleVouchers = [
    {
        id: "V001",
        name: "GIAM10",
        startDate: "2024/09/09",
        endDate: "31/12/2023",
        discountRate: 10,
        applyCode: "ALL"
    },
    {
        id: "V002",
        name: "MUADOI",
        startDate: "2023/12/01",
        endDate: "2023/12/10",
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
                const response = await axios.get(`${BASE_URL}/api/discountCodes`);
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
            const response = await axios.delete(`${BASE_URL}/api/discountCodes/${voucherId}`);
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
            (voucher.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (voucher.id?.includes(searchTerm) || false)
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
                                <TableCell>
                                    {new Date(voucher.startDate || voucher.usageDate).toLocaleDateString("vi-VN")}
                                </TableCell>
                                <TableCell>
                                    {new Date(voucher.endDate || voucher.expirationDate).toLocaleDateString("vi-VN")}
                                </TableCell>
                                <TableCell>
                                    {(voucher.discountPercent || voucher.discountRate)}%
                                </TableCell>
                                <TableCell>{voucher.code || voucher.applicableCode}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleViewDetails(voucher)}
                                        color="primary"
                                    >
                                        <Visibility />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleEditVoucher(voucher.id)}
                                        color="secondary"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDeleteVoucher(voucher.id)}
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
                            Ngày sử dụng: {new Date(selectedVoucher.startDate || selectedVoucher.usageDate).toLocaleDateString('vi-VN')}
                        </Typography>
                        <Typography>
                            Ngày hết hạn: {new Date(selectedVoucher.endDate || selectedVoucher.expirationDate).toLocaleDateString("vi-VN")}
                        </Typography>
                        <Typography>
                            Tỉ lệ chiết khấu: {(selectedVoucher.discountPercent || selectedVoucher.discountRate)}%
                        </Typography>
                        <Typography>
                            Mã áp dụng: {selectedVoucher.code || selectedVoucher.applicableCode}
                        </Typography>
                        <Typography>
                            Giá trị đơn hàng tối thiểu: {selectedVoucher.minOrderValue?.toLocaleString('vi-VN')} VNĐ
                        </Typography>
                        <Typography>
                            Số tiền giảm tối đa: {selectedVoucher.maxDiscountAmount?.toLocaleString('vi-VN')} VNĐ
                        </Typography>
                    </DialogContent>
                </Dialog>
            )}
        </Box>
    );
};

export default VoucherManagement;
