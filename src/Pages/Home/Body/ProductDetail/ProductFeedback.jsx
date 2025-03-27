import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../../../../Api/axiosInstance";
import {
  Box,
  VStack,
  Heading,
  Text,
  HStack,
  Button,
  Input,
  Image,
  useToast,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { UserContext } from "../../../../context/UserContext";

const ProductFeedback = ({ productId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({ rating: 0, comment: "", images: [] });
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const toast = useToast();
  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axiosInstance.get(`/api/feedback/product/${productId}`);
        setFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        toast({
          title: "Lỗi khi lấy đánh giá",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [productId, toast]);

  const handleFeedbackSubmit = async () => {
    if (!user) {
      toast({
        title: "Vui lòng đăng nhập để gửi đánh giá!",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if (newFeedback.rating === 0 || !newFeedback.comment) {
      toast({
        title: "Vui lòng chọn số sao và nhập bình luận!",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("productId", productId);
    formData.append("rating", newFeedback.rating);
    formData.append("comment", newFeedback.comment);
    newFeedback.images.forEach((image) => formData.append("images", image));

    try {
      const response = await axiosInstance.post("/api/feedback/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast({
        title: "Đã gửi đánh giá thành công!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      // Thêm feedback mới với fullName từ UserContext
      const newFeedbackWithName = {
        ...response.data,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        averageRating: feedbacks.length > 0 
          ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) + newFeedback.rating) / (feedbacks.length + 1) 
          : newFeedback.rating // Tính lại averageRating tạm thời
      };
      setFeedbacks((prevFeedbacks) => [...prevFeedbacks, newFeedbackWithName]);
      setNewFeedback({ rating: 0, comment: "", images: [] });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Lỗi khi gửi đánh giá",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const getImageUrl = (imagePath) => `${BASE_URL}${imagePath}`;

  return (
    <Box mt={8} w="full">
      <Heading size="md" mb={4}>Đánh giá sản phẩm</Heading>

      {/* Hiển thị rating trung bình */}
      {feedbacks.length > 0 && (
        <HStack mb={4}>
          <Text fontWeight="bold">Đánh giá trung bình:</Text>
          <Text>{feedbacks[0].averageRating.toFixed(1)} / 5</Text>
          <HStack>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                color={star <= Math.round(feedbacks[0].averageRating) ? "yellow.400" : "gray.300"}
              />
            ))}
          </HStack>
        </HStack>
      )}

      {user ? (
        <VStack spacing={4} align="start" mb={6}>
          <HStack>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                color={star <= newFeedback.rating ? "yellow.400" : "gray.300"}
                cursor="pointer"
                onClick={() => setNewFeedback({ ...newFeedback, rating: star })}
              />
            ))}
          </HStack>
          <Input
            placeholder="Viết bình luận của bạn..."
            value={newFeedback.comment}
            onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
          />
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setNewFeedback({ ...newFeedback, images: Array.from(e.target.files) })}
          />
          <Button onClick={handleFeedbackSubmit} colorScheme="blackAlpha" size="sm">
            Gửi đánh giá
          </Button>
        </VStack>
      ) : (
        <Text mb={6}>Vui lòng đăng nhập để gửi đánh giá.</Text>
      )}

      {loading ? (
        <Text>Loading...</Text>
      ) : feedbacks.length > 0 ? (
        <VStack spacing={4} align="start">
          {feedbacks.map((fb) => (
            <Box key={fb.id} p={4} borderWidth="1px" borderRadius="md" w="full">
                              <Text fontSize="sm" color="gray.500" mt={2}>
                {fb.fullName || "Ẩn danh"} - {new Date(fb.createdAt).toLocaleDateString()}
              </Text>
              <HStack>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} color={star <= fb.rating ? "yellow.400" : "gray.300"} />
                ))}
              </HStack>
              <Text mt={2}>{fb.comment}</Text>
              {fb.images && fb.images.length > 0 && (
                <HStack mt={2} spacing={2}>
                  {fb.images.map((img, idx) => (
                    <Image
                      key={idx}
                      src={getImageUrl(img)}
                      alt={`Feedback image ${idx}`}
                      w="50%"
                      objectFit="cover"
                    />
                  ))}
                </HStack>
              )}
            </Box>
          ))}
        </VStack>
      ) : (
        <Text>Chưa có đánh giá nào cho sản phẩm này.</Text>
      )}
    </Box>
  );
};

export default ProductFeedback;