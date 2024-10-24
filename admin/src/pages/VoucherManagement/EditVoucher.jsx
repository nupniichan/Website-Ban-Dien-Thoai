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
        usageDate: '',
        expirationDate: '',
        discountRate: 0,
        applicableCode: '',
    });
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchVoucher = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/vouchers/${voucherId}`);
                // Format dates for input fields
                const voucherData = {
                    ...response.data,
                    usageDate: response.data.usageDate.split('T')[0],
                    expirationDate: response.data.expirationDate.split('T')[0]
                };
                setVoucher(voucherData);
            } catch (error) {
                console.error("Lỗi khi tải voucher:", error);
                alert("Không thể tải thông tin voucher");
            } finally {
                setLoading(false);
            }
        };

        fetchVoucher();
    }, [voucherId]);

    const validateForm = () => {
        const newErrors = {};

        // Validate tên voucher
        if (!voucher.name.trim()) {
            newErrors.name = 'Vui lòng nhập tên voucher';
        } else if (voucher.name.length < 3) {
            newErrors.name = 'Tên voucher phải có ít nhất 3 ký tự';
        }

        // Validate ngày sử dụng
        if (!voucher.usageDate) {
            newErrors.usageDate = 'Vui lòng chọn ngày bắt đầu';
        }

        // Validate ngày hết hạn
        if (!voucher.expirationDate) {
            newErrors.expirationDate = 'Vui lòng chọn ngày hết hạn';
        } else if (new Date(voucher.expirationDate) <= new Date(voucher.usageDate)) {
            newErrors.expirationDate = 'Ngày hết hạn phải sau ngày bắt đầu';
        }

        // Validate tỷ lệ giảm giá
        const discountRate = Number(voucher.discountRate);
        if (!voucher.discountRate && voucher.discountRate !== 0) {
            newErrors.discountRate = 'Vui lòng nhập tỷ lệ giảm giá';
        } else if (isNaN(discountRate) || discountRate < 0 || discountRate > 100) {
            newErrors.discountRate = 'Tỷ lệ giảm giá phải từ 0% đến 100%';
        }

        // Validate mã áp dụng
        if (!voucher.applicableCode.trim()) {
            newErrors.applicableCode = 'Vui lòng nhập mã voucher';
        } else if (!/^[A-Z0-9]{3,20}$/.test(voucher.applicableCode)) {
            newErrors.applicableCode = 'Mã voucher chỉ được chứa chữ hoa và số, độ dài 3-20 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVoucher(prev => ({
            ...prev,
            [name]: value
        }));
        // Xóa lỗi khi người dùng thay đổi giá trị
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.put(`${BASE_URL}/api/discountCodes/${voucherId}`, voucher, {
                headers: { "Content-Type": "application/json" },
            });
            if (response.status === 200) {
                alert("Cập nhật voucher thành công");
                navigate("/voucher-management");
            } else {
                alert("Không thể cập nhật voucher");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật voucher:", error);
            alert(error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật voucher");
        }
    };

    if (loading) return <CircularProgress />;
    if (!voucher) return <div>Không tìm thấy voucher</div>;

    return (
        <Box padding={3}>
            <Typography variant="h4" gutterBottom>
                Chỉnh sửa Voucher
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Tên Voucher"
                            name="name"
                            value={voucher.name}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            margin="normal"
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Ngày bắt đầu"
                            name="usageDate"
                            type="date"
                            value={voucher.usageDate}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            error={!!errors.usageDate}
                            helperText={errors.usageDate}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Ngày hết hạn"
                            name="expirationDate"
                            type="date"
                            value={voucher.expirationDate}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            error={!!errors.expirationDate}
                            helperText={errors.expirationDate}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Tỷ lệ giảm giá (%)"
                            name="discountRate"
                            type="number"
                            value={voucher.discountRate}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            margin="normal"
                            inputProps={{ min: 0, max: 100 }}
                            error={!!errors.discountRate}
                            helperText={errors.discountRate}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Mã áp dụng"
                            name="applicableCode"
                            value={voucher.applicableCode}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            margin="normal"
                            error={!!errors.applicableCode}
                            helperText={errors.applicableCode || 'Chỉ sử dụng chữ hoa và số'}
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
