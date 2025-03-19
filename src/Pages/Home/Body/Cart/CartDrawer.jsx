import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Box,
  Flex,
  Text,
  Image,
  Button,
  Input,
  Grid,
  GridItem,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { ShoppingCart, Trash2 } from "react-feather";
import { useCart } from "../../../../context/CartContext";
import { useEffect, useRef } from "react";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, totalItems, totalPrice, isLoading, deleteFromCart, updateQuantity, fetchCart } = useCart();
  const hasFetched = useRef(false); // Theo dõi xem fetchCart đã được gọi chưa

  // Gọi fetchCart khi CartDrawer mở, chỉ gọi một lần nếu chưa fetch
  useEffect(() => {
    const storedCartToken = localStorage.getItem("cartToken");
    const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    if (isOpen && (storedCartToken || storedUser) && !hasFetched.current) {
      fetchCart()
        .then(() => {
          hasFetched.current = true;
        })
        .catch((error) => {
          console.error("Error fetching cart in CartDrawer:", error);
        });
    }

    // Reset hasFetched khi Drawer đóng để cho phép gọi lại khi mở lần sau
    return () => {
      if (!isOpen) {
        hasFetched.current = false;
      }
    };
  }, [isOpen, fetchCart]); // Chỉ phụ thuộc vào isOpen và fetchCart

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity)
      .then(() => fetchCart())
      .catch((error) => {
        console.error("Error updating quantity in CartDrawer:", error);
      });
  };

  const handleDelete = (itemId) => {
    deleteFromCart(itemId)
      .then(() => fetchCart())
      .catch((error) => {
        console.error("Error deleting item in CartDrawer:", error);
      });
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size={{ base: "xs", md: "md", lg: "lg" }}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>GIỎ HÀNG ({totalItems})</DrawerHeader>
        <DrawerBody>
          {isLoading ? (
            <Flex justify="center" align="center" h="100%">
              <Spinner size="lg" />
            </Flex>
          ) : cartItems.length === 0 ? (
            <Flex direction="column" align="center" justify="center" h="100%">
              <ShoppingCart size={48} />
              <Text mt={4}>Giỏ hàng của bạn đang trống.</Text>
              <Button as={RouterLink} to="/product" mt={4} colorScheme="blue" onClick={onClose}>
                Tiếp tục mua sắm
              </Button>
            </Flex>
          ) : (
            <Box>
              {cartItems.map((item) => (
                <Grid
                  key={item.id}
                  templateColumns={{ base: "1fr 2fr", md: "1fr 3fr" }}
                  gap={4}
                  mb={4}
                  alignItems="center"
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  pb={4}
                >
                  <GridItem>
                    <Image
                      src={`http://localhost:8080${item.variant.mainImage}`}
                      alt={item.productName}
                      objectFit="cover"
                      boxSize={{ base: "80px", md: "100px" }}
                    />
                  </GridItem>
                  <GridItem>
                    <Flex direction="column" justify="space-between" h="100%">
                      <Box>
                        <Text fontWeight="bold">{item.productName}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {item.variant.color} - {item.size}
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" mt={1}>
                          {item.discountPrice > 0
                            ? `${item.discountPrice.toLocaleString("vi-VN")} VND`
                            : `${item.price.toLocaleString("vi-VN")} VND`}
                        </Text>
                      </Box>
                      <Flex align="center" mt={2}>
                        <Button
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <Input
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                          }
                          type="number"
                          size="sm"
                          w="50px"
                          textAlign="center"
                          mx={2}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <IconButton
                          icon={<Trash2 />}
                          aria-label="Xóa sản phẩm"
                          size="sm"
                          ml={4}
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDelete(item.id)}
                        />
                      </Flex>
                    </Flex>
                  </GridItem>
                </Grid>
              ))}
            </Box>
          )}
        </DrawerBody>
        <DrawerFooter p={{ base: 3, md: 4, lg: 6 }} justifyContent="space-between">
          {cartItems.length > 0 && (
            <>
              <Box>
                <Text fontWeight="bold">Tổng tiền:</Text>
                <Text fontSize="lg" fontWeight="bold" color="red.500">
                  {totalPrice.toLocaleString("vi-VN")} VND
                </Text>
              </Box>
              <Button
                as={RouterLink}
                to="/checkout"
                colorScheme="blue"
                onClick={onClose}
                size={{ base: "sm", md: "md" }}
              >
                Thanh toán
              </Button>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;