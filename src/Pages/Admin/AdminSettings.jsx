// AdminSettings.jsx
import React from "react";
import { Box, Text } from "@chakra-ui/react";

const AdminSettings = () => {
  return (
    <Box
      p={4}
      bg="white"
      borderRadius="md"
      boxShadow="sm"
      _dark={{ bg: "gray.800", boxShadow: "md" }}
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Cài đặt
      </Text>
      <Text color="gray.600" _dark={{ color: "gray.300" }}>
        Đây là trang cài đặt. Bạn có thể thêm các nội dung hoặc chức năng cài đặt hệ thống tại đây.
      </Text>
    </Box>
  );
};

export default AdminSettings;