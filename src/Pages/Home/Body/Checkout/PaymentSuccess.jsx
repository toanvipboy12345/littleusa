import { Box, Text, Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const query = new URLSearchParams(location.search);
    const orderId = query.get("orderId");
    const paymentMethod = query.get("paymentMethod"); // Lấy paymentMethod từ query string

    useEffect(() => {
        if (!orderId) {
            navigate("/"); // Chuyển hướng về trang chủ nếu không có orderId
        }
    }, [orderId, navigate]);

    // Xác định thông điệp hiển thị trên giao diện
    const pageTitle = paymentMethod === "COD" ? "Đặt hàng thành công" : "Thanh toán thành công";
    const pageDescription =
        paymentMethod === "COD"
            ? `Đơn hàng của bạn đã được đặt thành công. Vui lòng thanh toán khi nhận hàng!`
            : `Đơn hàng của bạn đã được đặt thành công!`;

    return (
        <Box
            display="flex" // Sử dụng flexbox để căn giữa
            flexDirection="column" // Xếp nội dung theo cột
            justifyContent="center" // Căn giữa theo chiều dọc
            alignItems="center" // Căn giữa theo chiều ngang
            minHeight="50vh" // Chiều cao tối thiểu bằng viewport để căn giữa toàn màn hình
            px={{ base: 2, md: 4, lg: 8 }} // Padding ngang
            mx="auto"
            w={{ base: "95%", md: "90%", lg: "70%" }} // Chiều rộng
            textAlign="center" // Căn giữa văn bản
        >
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
                {pageTitle}
            </Text>
            <Text mb={4}>{pageDescription}</Text>
            <Button colorScheme="blue" onClick={() => navigate("/")}>
                Tiếp tục mua sắm
            </Button>
        </Box>
    );
};

export default PaymentSuccess;