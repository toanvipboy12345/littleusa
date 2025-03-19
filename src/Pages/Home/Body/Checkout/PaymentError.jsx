import { Box, Text, Button, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentError = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();

    const query = new URLSearchParams(location.search);
    const error = query.get("error");

    useEffect(() => {
        if (error) {
            toast({
                title: "Thanh toán không thành công",
                description: error,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [error, toast]);

    return (
        <Box py={{ base: 8, md: 12, lg: 20 }} px={{ base: 2, md: 4, lg: 8 }} mx="auto" w={{ base: "95%", md: "90%", lg: "70%" }} textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
                Thanh toán không thành công
            </Text>
            <Text mb={4}>"Đã xảy ra lỗi khi giao dịch , vui lòng thử lại sau"</Text>
            <Button onClick={() => navigate("/checkout")}>
                Thử lại
            </Button>
        </Box>
    );
};

export default PaymentError;