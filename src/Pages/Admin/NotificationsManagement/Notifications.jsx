// src/components/Admin/Notifications/Notifications.js
import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Badge,
  Divider,
  Spinner,
  IconButton,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { CheckCircle, Trash2 } from "react-feather";
import axiosInstance from "../../../Api/axiosInstance";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Hàm lấy danh sách thông báo từ server
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách thông báo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm đánh dấu thông báo là đã đọc
  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/api/notifications/${id}`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
      toast({
        title: "Thành công",
        description: "Thông báo đã được đánh dấu là đã đọc.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Lỗi",
        description: "Không thể đánh dấu thông báo là đã đọc.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Hàm xóa thông báo (placeholder - cần thêm API DELETE trong backend)
  const deleteNotification = async (id) => {
    // Hiện tại backend chưa có API DELETE, tôi để placeholder
    // Bạn có thể thêm API DELETE /api/notifications/{id} trong NotificationController
    try {
      // Giả lập gọi API xóa
      // await axiosInstance.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      toast({
        title: "Thành công",
        description: "Thông báo đã được xóa.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa thông báo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Lấy thông báo khi component được mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Hàm định dạng thời gian
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
     <Box p={{ base: 4, md: 6 }} mx="auto" w="100%">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Thông báo
      </Text>
      {loading ? (
        <Box textAlign="center">
          <Spinner size="lg" />
        </Box>
      ) : notifications.length > 0 ? (
        <VStack spacing={3} align="stretch">
          {notifications.map((notification) => (
            <Box
              key={notification.id}
              p={3}
              borderWidth="1px"
              borderRadius="md"
              bg={notification.isRead ? "gray.50" : "blue.50"}
              _dark={{ bg: notification.isRead ? "gray.700" : "blue.900" }}
            >
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={1}>
                  <Text
                    fontWeight={notification.isRead ? "normal" : "bold"}
                    color={notification.isRead ? "gray.600" : "blue.600"}
                    _dark={{
                      color: notification.isRead ? "gray.300" : "blue.300",
                    }}
                  >
                    {notification.message}
                  </Text>
                  <Badge colorScheme="gray" fontSize="xs">
                    {formatDateTime(notification.createdAt)}
                  </Badge>
                </VStack>
                <HStack spacing={2}>
                  {!notification.isRead && (
                    <IconButton
                      icon={<CheckCircle size={16} />}
                      aria-label="Mark as read"
                      size="sm"
                      variant="ghost"
                      colorScheme="green"
                      onClick={() => markAsRead(notification.id)}
                    />
                  )}
                  <IconButton
                    icon={<Trash2 size={16} />}
                    aria-label="Delete notification"
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => deleteNotification(notification.id)}
                  />
                </HStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text color="gray.500" textAlign="center">
          Không có thông báo nào.
        </Text>
      )}
    </Box>
  );
};

export default Notifications;