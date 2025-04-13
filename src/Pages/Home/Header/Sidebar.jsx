import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { User, LogOut, ChevronDown } from "react-feather";
import axiosInstance from "../../../Api/axiosInstance";

const Sidebar = ({
  showSidebar,
  closeSidebar,
  user,
  handleLogout,
  showAccountNav,
  setShowAccountNav,
}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Drawer isOpen={showSidebar} placement="left" onClose={closeSidebar}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          {user && user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Menu"}
        </DrawerHeader>
        <DrawerBody>
          <VStack align="start" spacing={4}>
            <Box as={RouterLink} to="/product" onClick={closeSidebar}>
              <Text fontSize="lg" fontWeight="bold" color="var(--primary-color)">
                Sản phẩm
              </Text>
            </Box>
            <Box as={RouterLink} to="/about-us" onClick={closeSidebar}>
              <Text fontSize="lg" fontWeight="bold" color="var(--primary-color)">
                Về chúng tôi
              </Text>
            </Box>
            <Box as={RouterLink} to="/brands" onClick={closeSidebar}>
              <Text fontSize="lg" fontWeight="bold" color="var(--primary-color)">
                Thương hiệu
              </Text>
            </Box>
            <Box as={RouterLink} to="/promotions" onClick={closeSidebar}>
              <Text fontSize="lg" fontWeight="bold" color="var(--primary-color)">
                Khuyến mãi
              </Text>
            </Box>
            <Accordion allowToggle w="100%">
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Text fontSize="lg" fontWeight="bold" color="var(--primary-color)">
                      Danh mục
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack align="start" spacing={2}>
                    {categories.map((category) => (
                      <Box
                        key={category.id}
                        as={RouterLink}
                        to={`/product?category=${encodeURIComponent(category.name)}`}
                        onClick={closeSidebar}
                        w="100%"
                        p={2}
                        _hover={{ bg: "gray.100", color: "var(--hover-color)" }}
                      >
                        <Text fontSize="md" textTransform="uppercase">
                          {category.name}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Box as={RouterLink} to="/blogs" onClick={closeSidebar}>
              <Text fontSize="lg" fontWeight="bold" color="var(--primary-color)">
                Bài viết
              </Text>
            </Box>
            <Box w="100%">
              <Accordion allowToggle w="100%">
                <AccordionItem>
                  <AccordionButton
                    onClick={() => setShowAccountNav(!showAccountNav)}
                  >
                    <Box flex="1" textAlign="left">
                      <Flex align="center">
                        <User size={20} style={{ marginRight: "8px" }} />
                        <Text fontSize="lg" fontWeight="bold" color="var(--primary-color)">
                          Tài khoản
                        </Text>
                      </Flex>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <VStack align="start" spacing={2}>
                      {user ? (
                        <>
                          <Box
                            as={RouterLink}
                            to="/account"
                            onClick={closeSidebar}
                            w="100%"
                            p={2}
                            _hover={{ bg: "gray.100", color: "var(--hover-color)" }}
                          >
                            <Text fontSize="md">Trang tài khoản</Text>
                          </Box>
                          <Box
                            as="button"
                            onClick={() => {
                              handleLogout();
                              closeSidebar();
                            }}
                            w="100%"
                            p={2}
                            textAlign="left"
                            _hover={{ bg: "gray.100", color: "var(--hover-color)" }}
                          >
                            <Text fontSize="md">Đăng xuất</Text>
                          </Box>
                        </>
                      ) : (
                        <>
                          <Box
                            as={RouterLink}
                            to="/Login"
                            onClick={closeSidebar}
                            w="100%"
                            p={2}
                            _hover={{ bg: "gray.100", color: "var(--hover-color)" }}
                          >
                            <Text fontSize="md">Đăng nhập</Text>
                          </Box>
                          <Box
                            as={RouterLink}
                            to="/order"
                            onClick={closeSidebar}
                            w="100%"
                            p={2}
                            _hover={{ bg: "gray.100", color: "var(--hover-color)" }}
                          >
                            <Text fontSize="md">Lịch sử đơn hàng</Text>
                          </Box>
                        </>
                      )}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;