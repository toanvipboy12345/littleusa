import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../../Api/axiosInstance";
import {
  Box,
  Image,
  Text,
  VStack,
  Flex,
  BreadcrumbLink,
  BreadcrumbItem,
  Breadcrumb,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const imageRefs = useRef([]);

  // Fetch danh sách thương hiệu từ API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axiosInstance.get("/api/brands");
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  // Lazy loading cho hình ảnh
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1, // Khi 10% hình ảnh xuất hiện trong viewport, tải hình
    };

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src; // Tải hình ảnh từ dataset.src
          observer.unobserve(img); // Ngừng theo dõi hình ảnh sau khi tải
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    imageRefs.current.forEach((img) => {
      if (img) observer.observe(img);
    });

    return () => observer.disconnect(); // Dọn dẹp khi component unmount
  }, [brands]);

  return (
    <Box
      py={{ base: 8, md: 12, lg: 20 }}
      px={{ base: 2, md: 4, lg: 12 }}
      mx="auto"
      w={{ base: "95%", md: "90%", lg: "70%" }}
    >

      {/* Hiển thị danh sách thương hiệu dạng list view */}
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
      <Breadcrumb mb={6} px={{ base: 2, md: 8 }} fontSize="sm">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Thương hiệu</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
        {brands.map((brand, index) => (
          <Box key={brand.id} p={{ base: 2, md: 3 }} w="100%">
            <Flex
              align="center"
              gap={{ base: 4, md: 6 }} 
              direction={{ base: "row", md: "row" }} 
            >
              {/* Hình ảnh thương hiệu với lazy loading */}
              <Image
                ref={(el) => (imageRefs.current[index] = el)} // Thêm ref cho lazy loading
                data-src={`http://localhost:8080${brand.image}`} // Dữ liệu hình ảnh để lazy load
                alt={brand.name}
                src="" // Không tải ngay, đợi lazy loading
                objectFit="contain"
                w={{ base: "100px", md: "180px", lg: "200px" }} 
                h={{ base: "100px", md: "180px", lg: "200px" }} 
              />

              {/* Thông tin thương hiệu */}
              <VStack align="start" spacing={1} flex="1">
                <Text
                  fontSize={{ base: "sm", md: "md" }} 
                  fontWeight="bold"
                >
                  {brand.name}
                </Text>
                <Text
                  fontSize={{ base: "xs", md: "sm" }} 
                  noOfLines={{ base: 3, md: 3, lg: "none" }} 
                >
                  {brand.description || "Không có mô tả"}
                </Text>
              </VStack>
            </Flex>
          </Box>
        ))}
      </VStack>

      {/* Hiển thị thông báo nếu không có thương hiệu */}
      {brands.length === 0 && (
        <Text
          textAlign="center"
          fontSize={{ base: "sm", md: "md" }} 
        >
          Không có thương hiệu nào để hiển thị.
        </Text>
      )}
    </Box>
  );
};

export default Brands;