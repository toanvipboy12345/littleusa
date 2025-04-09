import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../../../../Api/axiosInstance";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  Image,
  useToast,
  Progress,
  Avatar,
  Divider,
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
        console.log("Feedbacks response:", response.data);
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

      const newFeedbackWithName = {
        ...response.data,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        averageRating: feedbacks.length > 0 
          ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) + newFeedback.rating) / (feedbacks.length + 1) 
          : newFeedback.rating,
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

  // Hàm tạo màu ngẫu nhiên dựa trên userId
  const getAvatarColor = (userId) => {
    const colors = ["teal", "blue", "purple", "pink", "orange", "green"];
    return colors[userId % colors.length];
  };

  return (
    <Box mt={8} w="full">
      <Heading size="md" mb={4}>Đánh giá sản phẩm</Heading>

      {/* Phần hiển thị đánh giá trung bình và phân phối đánh giá */}
      {feedbacks.length > 0 && feedbacks[0] ? (
        <Box mb={6} w="full">
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "center", md: "center" }}
            gap={{ base: "1rem", md: "2rem" }}
            justify="center"
          >
            {/* Đánh giá trung bình */}
            <Box
              textAlign="center"
              w={{ base: "100%", md: "250px" }}
            >
              <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold">
                {feedbacks[0].averageRating?.toFixed(1) || "0.0"}/5
              </Text>
              <Flex justify="center" gap="0.25rem">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    boxSize={{ base: 5, md: 6 }}
                    color={star <= Math.round(feedbacks[0].averageRating || 0) ? "yellow.400" : "gray.300"}
                  />
                ))}
              </Flex>
              <Text fontSize={{ base: "md", md: "lg" }} color="gray.500">
                {feedbacks[0].totalFeedbacks || 0} đánh giá
              </Text>
            </Box>


            {/* Phân phối đánh giá */}
            <Box w={{ base: "100%", md: "auto" }} flex={{ md: 1 }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const ratingDist = feedbacks[0].ratingDistribution || { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
                const percentage = ratingDist[star.toString()] || 0;
                const totalFeedbacks = feedbacks[0].totalFeedbacks || 0;
                const count = Math.round((percentage / 100) * totalFeedbacks); // Tính số lượng đánh giá
                return (
                  <Flex key={star} align="center" mb="0.5rem">
                    <Box w="50px" display="flex" alignItems="center">
                      <Text fontSize={{ base: "md", md: "lg" }} mr="0.25rem">{star}</Text>
                      <StarIcon color="yellow.400" boxSize={{ base: 3, md: 4 }} />
                    </Box>
                    <Box flex="1" minW={{ base: "150px", md: "200px" }}>
                      <Progress
                        value={percentage}
                        size="md"
                        bg="gray.100"
                        sx={{
                          "& > div": {
                            backgroundColor: "var(--primary-color)",
                          },
                        }}
                      />
                    </Box>
                    <Text fontSize={{ base: "md", md: "lg" }} ml="1rem">{count} đánh giá</Text>
                  </Flex>
                );
              })}
            </Box>
          </Flex>
        </Box>
      ) : null}

      {/* Phần form đánh giá */}
      <Box mb={6} w="full">
        {user ? (
          <Box>
            <Flex gap="0.25rem" mb="1rem">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  color={star <= newFeedback.rating ? "yellow.400" : "gray.300"}
                  cursor="pointer"
                  onClick={() => setNewFeedback({ ...newFeedback, rating: star })}
                />
              ))}
            </Flex>
            <Input
              placeholder="Viết bình luận của bạn..."
              value={newFeedback.comment}
              onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
              mb="1rem"
            />
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setNewFeedback({ ...newFeedback, images: Array.from(e.target.files) })}
              mb="1rem"
            />
            <Button onClick={handleFeedbackSubmit} colorScheme="blackAlpha" size="sm">
              Gửi đánh giá
            </Button>
          </Box>
        ) : (
          <Text>Vui lòng đăng nhập để gửi đánh giá.</Text>
        )}
      </Box>

      {/* Phần hiển thị danh sách đánh giá */}
      {loading ? (
        <Text>Loading...</Text>
      ) : feedbacks.length > 0 ? (
        <Box>
          {feedbacks.map((fb) => (
            <Box key={fb.id} p={4} borderWidth="1px" borderRadius="md" w="full" mb="1rem">
              <Flex align="center" mb="0.5rem">
                <Avatar
                  size="sm"
                  name={fb.fullName || "Ẩn danh"}
                  bg={getAvatarColor(fb.userId)}
                  color="white"
                  mr="0.75rem"
                />
                <Box>
                  <Text fontWeight="bold">{fb.fullName || "Ẩn danh"}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </Text>
                </Box>
              </Flex>
              <Flex gap="0.25rem" mb="0.5rem">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} color={star <= fb.rating ? "yellow.400" : "gray.300"} />
                ))}
              </Flex>
              <Text mb="0.5rem">{fb.comment}</Text>
              {fb.images && fb.images.length > 0 && (
                <Flex gap="0.5rem">
                  {fb.images.map((img, idx) => (
                    <Image
                      key={idx}
                      src={getImageUrl(img)}
                      alt={`Feedback image ${idx}`}
                      w="50%"
                      objectFit="cover"
                    />
                  ))}
                </Flex>
              )}
            </Box>
          ))}
        </Box>
      ) : (
        <Text>Chưa có đánh giá nào cho sản phẩm này.</Text>
      )}
    </Box>
  );
};

export default ProductFeedback;