import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Input,
  Button,
  Image,
} from "@chakra-ui/react";
import { MessageSquare, X } from "react-feather";
import axiosInstance from "../../../Api/axiosInstance";

const MotionBox = motion(Box);

// Base URL cho ảnh
const BASE_URL = "http://localhost:8080";

// Kịch bản phản hồi
const botResponses = {
  greeting: "Xin chào! Mình là trợ lý tư vấn sản phẩm. Bạn muốn tìm gì hôm nay? Áo thun, giày sneaker, hay phụ kiện chẳng hạn?",
  farewell: "Tạm biệt nhé! Hẹn gặp lại bạn!",
  thanks: "Không có gì! Rất vui được giúp bạn!",
  howAreYou: "Mình là bot nên luôn ổn! Bạn muốn tìm sản phẩm gì hôm nay?",
  default: "Xin lỗi, tôi không thể trả lời câu hỏi của bạn.",
};

// Ánh xạ từ khóa đến danh mục
const categoryAliases = {
  "áo thun": "Áo thun (T-SHIRT)",
  "áo tee": "Áo thun (T-SHIRT)",
  // Có thể thêm các ánh xạ khác nếu cần
  "áo dài tay": "Áo dài tay",
  "phụ kiện": "Phụ kiện",
  "giày sneaker": "Giày Sneaker",
  "dép": "Dép",
  "quần jogger": "Quần Jogger",
  "quần short": "Quần Short",
  "áo hoodie": "Áo Hoodie",
  "áo khoác": "Áo khoác",
  "túi": "Túi",
  "mũ": "Mũ",
};

const ChatBox = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [currentFilters, setCurrentFilters] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Calling API /api/categories...");
        const response = await axiosInstance.get("/api/categories");
        const categoryList = response.data.map((cat) => cat.name);
        console.log("Categories fetched:", categoryList);
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([
          "Áo thun (T-SHIRT)",
          "Áo dài tay",
          "Phụ kiện",
          "Giày Sneaker",
          "Dép",
          "Quần Jogger",
          "Quần Short",
          "Áo Hoodie",
          "Áo khoác",
          "Túi",
          "Mũ",
        ]);
      }
    };

    const fetchBrands = async () => {
      try {
        console.log("Calling API /api/brands...");
        const response = await axiosInstance.get("/api/brands");
        const brandList = response.data.map((brand) => brand.name);
        console.log("Brands fetched:", brandList);
        setBrands(brandList);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands([
          "NEW ERA",
          "VANS",
          "BAPE",
          "NIKE",
          "ADIDAS",
          "STUSSY",
          "RIPNDIP",
          "47",
          "CHAMPION",
          "THRASHER",
          "LIFE WORK",
          "MLB KOREA",
          "FIER DE MOI",
          "DREW HOUSE",
          "RALPH LAUREN",
          "ACMÉ DE LA VIE",
          "FOG ESSENTIALS",
          "TOMMY HILFIGER",
          "ANTI SOCIAL SOCIAL CLUB",
        ]);
      }
    };

    fetchCategories();
    fetchBrands();
  }, []);

  const fetchProducts = async (filters) => {
    try {
      console.log("Calling API /api/product-dto/cards with filters:", filters);
      const response = await axiosInstance.get("/api/product-dto/cards", {
        params: {
          page: 0,
          size: 30,
          category: filters.category || undefined,
          brand: filters.brand || undefined,
          priceMin: filters.priceMin || undefined,
          priceMax: filters.priceMax || undefined,
          hasDiscount: filters.hasDiscount || undefined,
        },
      });
      const products = response.data.products;
      console.log("Products returned from API:", products);
      products.forEach((product) => {
        console.log(`Product: ${product.name}, discountRate: ${product.discountRate}`);
      });
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  const parsePrice = (priceText) => {
    priceText = priceText.toLowerCase();
    if (priceText.includes("k")) {
      return parseInt(priceText.replace("k", "")) * 1000;
    }
    if (priceText.includes("triệu")) {
      return parseInt(priceText.replace("triệu", "")) * 1000000;
    }
    return parseInt(priceText);
  };

  const getBotResponse = async (userMessage) => {
    const message = userMessage.toLowerCase().trim();
    console.log("User message:", message);

    let filters = {};

    // Tìm danh mục với ánh xạ từ khóa
    let foundCategory = null;
    for (const alias in categoryAliases) {
      if (message.includes(alias)) {
        foundCategory = categoryAliases[alias];
        break;
      }
    }
    if (foundCategory && categories.includes(foundCategory)) {
      console.log("Found category:", foundCategory);
      filters.category = foundCategory;
    }

    const foundBrand = brands.find((brand) =>
      message.includes(brand.toLowerCase())
    );
    if (foundBrand) {
      console.log("Found brand:", foundBrand);
      filters.brand = foundBrand;
    }

    if (message.includes("giảm giá") || message.includes("khuyến mại")) {
      console.log("Detected discount request");
      filters.hasDiscount = true;
    }

    const priceMatch = message.match(
        /dưới\s*(\d+k|\d+\s*triệu)|từ\s*(\d+k|\d+\s*triệu)\s*đến\s*(\d+k|\d+\s*triệu)|khoảng\s*(\d+k|\d+\s*triệu|\d+)|tầm giá\s*(\d+)-(\d+)(k|triệu)?/i
      );
      if (priceMatch) {
        console.log("Detected price filter:", priceMatch);
        if (message.includes("dưới")) {
          filters.priceMax = parsePrice(priceMatch[1]);
        } else if (message.includes("từ")) {
          filters.priceMin = parsePrice(priceMatch[2]);
          filters.priceMax = parsePrice(priceMatch[3]);
        } else if (message.includes("khoảng")) {
          const targetPrice = parsePrice(priceMatch[4] || priceMatch[0].replace("khoảng ", ""));
          filters.priceMin = targetPrice - 100000; // ±100k
          filters.priceMax = targetPrice + 100000;
        } else if (message.includes("tầm giá")) {
          const priceLow = parseInt(priceMatch[5]); // Giá thấp (X trong X-Y)
          const priceHigh = parseInt(priceMatch[6]); // Giá cao (Y trong X-Y)
          const unit = priceMatch[7]?.toLowerCase(); // Đơn vị: "k" hoặc "triệu"
          if (unit === "k") {
            filters.priceMin = priceLow * 1000;
            filters.priceMax = priceHigh * 1000;
          } else if (unit === "triệu") {
            filters.priceMin = priceLow * 1000000;
            filters.priceMax = priceHigh * 1000000;
          } else {
            // Nếu không có đơn vị, giả sử là số nguyên (VD: "tầm giá 800000-1000000")
            filters.priceMin = priceLow;
            filters.priceMax = priceHigh;
          }
        }
      }

    if (
      message.includes("gợi ý") ||
      message.includes("đẹp") ||
      message.includes("hot")
    ) {
      console.log("Detected suggestion request");
      if (Object.keys(filters).length === 0) {
        filters = { ...currentFilters };
      }
    }

    if (Object.keys(filters).length > 0 || foundCategory || foundBrand) {
      if (!message.includes("mua") && !message.includes("tôi muốn mua")) {
        filters = { ...currentFilters, ...filters };
      }
      setCurrentFilters(filters);

      const products = await fetchProducts(filters);
      if (products.length > 0) {
        const sampleProducts = products.slice(0, 2);
        setCurrentFilters({});
        return {
          text: "Dựa theo nhu cầu của bạn, mình sẽ đề xuất sản phẩm phù hợp:",
          products: sampleProducts,
        };
      }
      setCurrentFilters({});
      let noResultText = "Hiện tại không có sản phẩm nào phù hợp.";
      if (foundCategory && !foundBrand) {
        noResultText = `Hiện tại không có sản phẩm nào thuộc danh mục ${foundCategory}.`;
      } else if (foundBrand && !foundCategory) {
        noResultText = `Hiện tại không có sản phẩm nào của ${foundBrand}.`;
      } else if (foundCategory && foundBrand) {
        noResultText = `Hiện tại không có sản phẩm nào của ${foundBrand} trong danh mục ${foundCategory}.`;
      } else if (filters.hasDiscount) {
        noResultText = "Hiện tại không có sản phẩm giảm giá nào phù hợp.";
      } else if (filters.priceMin || filters.priceMax) {
        noResultText = "Không tìm thấy sản phẩm nào trong khoảng giá này.";
      }
      return { text: noResultText };
    }

    if (["xin chào", "chào", "hello", "hi"].includes(message)) {
      console.log("Detected greeting");
      return { text: botResponses.greeting };
    }
    if (["tạm biệt", "bye", "hẹn gặp lại"].includes(message)) {
      console.log("Detected farewell");
      return { text: botResponses.farewell };
    }
    if (["cảm ơn", "thanks", "thank you"].includes(message)) {
      console.log("Detected thanks");
      return { text: botResponses.thanks };
    }
    if (["bạn khỏe không", "bạn thế nào", "how are you"].includes(message)) {
      console.log("Detected how are you");
      return { text: botResponses.howAreYou };
    }

    console.log("No matching condition, using default response");
    return { text: botResponses.default };
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMsg = { text: inputMessage, sender: "user" };
      setMessages((prev) => [...prev, userMsg]);
      setInputMessage("");

      const botResponse = await getBotResponse(inputMessage);
      setTimeout(() => {
        setMessages((prev) => [...prev, { ...botResponse, sender: "bot" }]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <MotionBox
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: isOpen ? "450px" : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      bg="white"
      borderTopLeftRadius="8px"
      borderBottomLeftRadius="8px"
      borderRight="1px solid"
      borderColor="gray.300"
      minH="60vh"
      maxH="60vh" // Giới hạn chiều cao tối đa của khung chat
      display="flex"
      flexDirection="column"
      p={3}
      boxShadow="0 8px 20px rgba(0, 0, 0, 0.2)"
    >
      <Flex justify="space-between" align="center" w="100%" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Tư vấn sản phẩm
        </Text>
        <IconButton
          icon={<X />}
          size="sm"
          variant="ghost"
          onClick={onClose}
          aria-label="Đóng chat"
        />
      </Flex>

      <Box
        flex="1"
        overflowY="auto"
        mb={4}
        pr={2}
      >
        {messages.length === 0 ? (
          <Text textAlign="center" fontSize="sm" color="gray.500">
            Bắt đầu trò chuyện nào!
          </Text>
        ) : (
          messages.map((msg, index) => (
            <Flex
              key={index}
              justify={msg.sender === "user" ? "flex-end" : "flex-start"}
              mb={2}
            >
              <Box
                maxW="70%"
                bg={msg.sender === "user" ? "blue.100" : "gray.100"}
                p={2}
                borderRadius="md"
                boxShadow="sm"
              >
                <Text fontSize="sm" whiteSpace="pre-wrap">
                  {msg.text}
                </Text>
                {msg.products && msg.products.length > 0 && (
                  <Box mt={2}>
                    {msg.products.map((product, idx) => (
                      <Flex key={idx} mb={2}>
                        <Image
                          src={`${BASE_URL}${product.mainImage}`}
                          alt={product.name}
                          boxSize="100px"
                          objectFit="cover"
                          mr={1}
                          fallbackSrc="https://via.placeholder.com/100"
                        />
                        <Text fontSize="sm" fontWeight="bold">
                          {product.name} - {product.price.toLocaleString("vi-VN")} đ
                          {product.discountRate > 0
                            ? ` (giảm ${product.discountRate}%)`
                            : ""}
                        </Text>
                      </Flex>
                    ))}
                  </Box>
                )}
              </Box>
            </Flex>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Flex>
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn..."
          size="sm"
          mr={2}
        />
        <Button
          size="sm"
          onClick={handleSendMessage}
          isDisabled={!inputMessage.trim()}
        >
          Gửi
        </Button>
      </Flex>
    </MotionBox>
  );
};

export default ChatBox;