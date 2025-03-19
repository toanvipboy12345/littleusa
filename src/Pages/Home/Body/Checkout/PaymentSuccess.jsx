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
            py={{ base: 8, md: 12, lg: 20 }}
            px={{ base: 2, md: 4, lg: 8 }}
            mx="auto"
            w={{ base: "95%", md: "90%", lg: "70%" }}
            textAlign="center"
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