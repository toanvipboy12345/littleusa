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

// API key của Gemini (LƯU Ý: Không nên hard-code trong code, chỉ dùng cho test)
const GEMINI_API_KEY = "AIzaSyAtG7DmUglmdA_w9aIexPRhXEZaOQGMku0"; // Thay bằng API key mới của bạn

// Ánh xạ từ khóa danh mục để phát hiện chính xác hơn
const categoryAliases = {
  "áo thun": "Áo thun (T-SHIRT)",
  "áo tee": "Áo thun (T-SHIRT)",
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

// Ánh xạ các biến thể từ khóa ngữ cảnh đến ngữ cảnh chính
const contextAliases = {
  "mùa hè": "ngày hè",
  "hè": "ngày hè",
  "trời nóng": "ngày hè",
  "mùa đông": "ngày đông",
  "đông": "ngày đông",
  "trời lạnh": "ngày đông",
  "xuân": "mùa xuân",
  "mùa xuân": "mùa xuân",
  "thu": "mùa thu",
  "mùa thu": "mùa thu",
  "năng động": "năng động",
  "đi chơi": "đi chơi",
  "đi làm": "đi làm",
  "chơi thể thao mùa hè": "thể thao mùa hè",
  "thể thao mùa hè": "thể thao mùa hè",
  "chơi thể thao mùa đông": "thể thao mùa đông",
  "thể thao mùa đông": "thể thao mùa đông",
  "chơi thể thao": "thể thao", // Ưu tiên cụm từ dài hơn
  "thể thao": "thể thao",
};

// Ánh xạ danh mục theo ngữ cảnh
const contextCategoryMapping = {
  "ngày hè": {
    top: "Áo thun (T-SHIRT)",
    bottom: "Quần Short",
    footwear: ["Giày Sneaker", "Dép"],
    accessories: ["Túi", "Mũ"],
  },
  "ngày đông": {
    top: "Áo Khoác",
    bottom: "Quần Jogger",
    footwear: ["Giày Sneaker"],
    accessories: [],
  },
  "mùa xuân": {
    top: "Áo Hoodie",
    bottom: "Quần Jogger",
    footwear: ["Giày Sneaker"],
    accessories: ["Túi", "Mũ"],
  },
  "mùa thu": {
    top: "Áo dài tay",
    bottom: "Quần Jogger",
    footwear: ["Giày Sneaker"],
    accessories: ["Túi", "Mũ"],
  },
  "năng động": {
    top: "Áo thun (T-SHIRT)",
    bottom: "Quần Jogger",
    footwear: ["Giày Sneaker"],
    accessories: ["Túi", "Mũ"],
  },
  "đi chơi": {
    top: "Áo thun (T-SHIRT)",
    bottom: "Quần Short",
    footwear: ["Giày Sneaker"],
    accessories: ["Túi", "Mũ"],
  },
  "thể thao": {
    top: "Áo thun (T-SHIRT)",
    bottom: "Quần Jogger",
    footwear: ["Giày Sneaker"],
    accessories: [],
  },
  "thể thao mùa hè": {
    top: "Áo thun (T-SHIRT)",
    bottom: "Quần Short",
    footwear: ["Giày Sneaker"],
    accessories: [],
  },
  "thể thao mùa đông": {
    top: "Áo dài tay",
    bottom: "Quần Jogger",
    footwear: ["Giày Sneaker"],
    accessories: [],
  },
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
    priceText = priceText.toLowerCase().trim();
    let priceValue = parseFloat(priceText.replace(/[^0-9.]/g, ""));
    if (priceText.includes("nghìn đồng") || priceText.includes("nghìn")) {
      priceValue *= 1000;
    } else if (priceText.includes("triệu")) {
      priceValue *= 1000000;
    } else if (priceText.includes("k")) {
      priceValue *= 1000;
    }
    return Math.round(priceValue);
  };

  const getBotResponse = async (userMessage) => {
    const message = userMessage.trim().toLowerCase();
    console.log("User message:", message);

    if (
      message.includes("thương hiệu") &&
      (message.includes("xem") || message.includes("danh sách") || message.includes("có những") || message.includes("nào"))
    ) {
      console.log("Detected request for brand list");
      const brandListText = brands.length > 0
        ? `Đây là danh sách các thương hiệu hiện có: ${brands.join(", ")}. Bạn muốn tìm sản phẩm của thương hiệu nào?`
        : "Hiện tại mình không có thông tin về các thương hiệu. Bạn có thể hỏi về sản phẩm khác không?";
      return { text: brandListText };
    }

    if (
      message.includes("danh mục") &&
      (message.includes("xem") || message.includes("danh sách") || message.includes("có những") || message.includes("nào"))
    ) {
      console.log("Detected request for category list");
      const categoryListText = categories.length > 0
        ? `Đây là danh sách các danh mục hiện có: ${categories.join(", ")}. Bạn muốn tìm sản phẩm thuộc danh mục nào?`
        : "Hiện tại mình không có thông tin về các danh mục. Bạn có thể hỏi về sản phẩm khác không?";
      return { text: categoryListText };
    }

    if (message.includes("bộ lọc hiện tại") || message.includes("xem bộ lọc")) {
      console.log("Detected request to view current filters");
      console.log("Current filters:", currentFilters);
      const filterText = Object.keys(currentFilters).length > 0
        ? `Bộ lọc hiện tại: ${JSON.stringify(currentFilters, null, 2).replace(/"/g, "").replace(/{|}/g, "")}`
        : "Hiện tại chưa có bộ lọc nào được áp dụng.";
      return { text: filterText };
    }

    try {
      const categoryList = categories.join(", ");
      const prompt = `Bạn là trợ lý tư vấn sản phẩm chuyên nghiệp. Người dùng hỏi bằng tiếng Việt. Trả lời tự nhiên, thân thiện và chi tiết bằng tiếng Việt. Cung cấp thông tin chuyên sâu về sản phẩm, ví dụ: phong cách (casual, thể thao, sang trọng), mục đích sử dụng (đi học, đi làm, đi chơi, chơi thể thao), chất liệu (thoáng khí, giữ ấm, co giãn), hoặc các đặc điểm nổi bật (thấm hút mồ hôi, chống trượt, v.v.). 

**Quan trọng:** 
- Bạn chỉ được gợi ý các sản phẩm thuộc danh mục có sẵn trong hệ thống. Danh sách danh mục hiện có: ${categoryList}. Không gợi ý các sản phẩm ngoài danh sách này (ví dụ: không gợi ý "áo len cao cổ" nếu danh mục không có, mà hãy chọn "Áo Hoodie" hoặc "Áo khoác" nếu phù hợp).
- Nếu người dùng hỏi về trang phục thể thao (ví dụ: "chơi thể thao mùa hè", "thể thao mùa đông", "đi đá bóng", "chạy bộ", "chơi thể thao"), hãy ưu tiên gợi ý các sản phẩm của thương hiệu Nike cho áo và quần, vì chúng nổi tiếng với chất liệu thoáng khí, co giãn và hỗ trợ vận động. Chỉ gợi ý thương hiệu khác nếu ngữ cảnh không liên quan đến thể thao hoặc người dùng yêu cầu rõ ràng.
- Đối với outfit thể thao (bao gồm "thể thao mùa hè", "thể thao mùa đông", "thể thao", "chơi thể thao"), chỉ gợi ý áo, quần, và giày sneaker. Không bao gồm phụ kiện như túi hay mũ để giữ sự tối giản và phù hợp khi vận động. Lưu ý: "chơi thể thao" khác với "đi chơi", không nhầm lẫn giữa hai ngữ cảnh này.
- Đối với "thể thao mùa hè", gợi ý trang phục thoáng mát (ví dụ: áo thun, quần short, giày sneaker). Đối với "thể thao mùa đông", gợi ý trang phục giữ ấm nhưng linh hoạt (ví dụ: áo dài tay, quần jogger, giày sneaker).

Nếu người dùng yêu cầu gợi ý sản phẩm (ví dụ: tìm áo thun, giày sneaker, sản phẩm giảm giá, v.v.), hãy trả lời chi tiết và thêm "GỢI Ý SẢN PHẨM" vào cuối câu để kích hoạt logic lấy sản phẩm. Nếu người dùng yêu cầu tư vấn outfit (ví dụ: "tôi muốn có 1 outfit đi chơi ngày hè", "trời lạnh mặc gì thì đẹp", "bộ đồ năng động", "mùa đông chơi thể thao mặc gì"), hãy gợi ý một bộ trang phục hoàn chỉnh bao gồm áo, quần, giày/dép, và chỉ thêm phụ kiện (túi, mũ) nếu không phải ngữ cảnh thể thao, sử dụng các danh mục trong danh sách trên, phù hợp với ngữ cảnh (thời tiết, phong cách, mục đích sử dụng), sau đó thêm "GỢI Ý SẢN PHẨM" để kích hoạt logic lấy sản phẩm. Nếu không hiểu hoặc không có thông tin, trả lời: "Xin lỗi, mình không hiểu ý bạn. Bạn có thể nói rõ hơn không?"

Người dùng: ${userMessage}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Gemini API error");
      }

      const botReply = data.candidates[0].content.parts[0].text;
      console.log("Gemini response:", botReply);

      if (botReply.includes("GỢI Ý SẢN PHẨM")) {
        let filters = {};
        let outfitFilters = [];

        const isOutfitRequest =
          message.includes("outfit") ||
          message.includes("bộ đồ") ||
          message.includes("mặc gì") ||
          message.includes("phù hợp");

        let context = null;
        // Ưu tiên cụm từ dài hơn khi tìm ngữ cảnh
        const aliasKeys = Object.keys(contextAliases).sort((a, b) => b.length - a.length);
        for (const alias of aliasKeys) {
          if (message.includes(alias)) {
            context = contextAliases[alias];
            break;
          }
        }

        if (isOutfitRequest && !context) {
          context = "đi chơi";
        }

        const foundBrand = brands.find((brand) =>
          message.includes(brand.toLowerCase())
        );
        if (foundBrand) {
          console.log("Found brand:", foundBrand);
          filters.brand = foundBrand;
        }

        if (
          message.includes("giảm giá") ||
          message.includes("khuyến mại") ||
          message.includes("sale") ||
          message.includes("giảm giá sâu")
        ) {
          console.log("Detected discount request");
          filters.hasDiscount = true;
        }

        let totalBudget = null;
        const priceMatch = message.match(
          /dưới\s*(\d+\s*(?:nghìn đồng|nghìn|triệu|k)?)|trên\s*(\d+\s*(?:nghìn đồng|nghìn|triệu|k)?)|từ\s*(\d+\s*(?:nghìn đồng|nghìn|triệu|k)?)\s*(?:đến|trở xuống)\s*(\d+\s*(?:nghìn đồng|nghìn|triệu|k)?)?|khoảng\s*(\d+\s*(?:nghìn đồng|nghìn|triệu|k)?)|tầm giá\s*(\d+)-(\d+)(nghìn|triệu|k)?/i
        );
        if (priceMatch) {
          console.log("Detected price filter:", priceMatch);
          if (message.includes("dưới")) {
            totalBudget = parsePrice(priceMatch[1]);
            filters.priceMax = totalBudget;
          } else if (message.includes("trên")) {
            filters.priceMin = parsePrice(priceMatch[2]);
          } else if (message.includes("từ")) {
            filters.priceMin = parsePrice(priceMatch[3]);
            if (priceMatch[4]) {
              totalBudget = parsePrice(priceMatch[4]);
              filters.priceMax = totalBudget;
            } else {
              totalBudget = parsePrice(priceMatch[3]);
              filters.priceMax = totalBudget;
            }
          } else if (message.includes("khoảng")) {
            totalBudget = parsePrice(priceMatch[5]);
            filters.priceMin = totalBudget - 100000;
            filters.priceMax = totalBudget + 100000;
          } else if (message.includes("tầm giá")) {
            const priceLow = parseInt(priceMatch[6]);
            const priceHigh = parseInt(priceMatch[7]);
            const unit = priceMatch[8]?.toLowerCase();
            if (unit === "nghìn" || unit === "k") {
              filters.priceMin = priceLow * 1000;
              filters.priceMax = priceHigh * 1000;
              totalBudget = (priceLow + priceHigh) * 1000 / 2;
            } else if (unit === "triệu") {
              filters.priceMin = priceLow * 1000000;
              filters.priceMax = priceHigh * 1000000;
              totalBudget = (priceLow + priceHigh) * 1000000 / 2;
            } else {
              filters.priceMin = priceLow;
              filters.priceMax = priceHigh;
              totalBudget = (priceLow + priceHigh) / 2;
            }
          }
        }

        if (isOutfitRequest && context) {
          console.log("Detected outfit request for context:", context);
          const outfitCategories = contextCategoryMapping[context];

          // Phân bổ ngân sách: 3 danh mục cho thể thao, 5 cho các ngữ cảnh khác
          let budgetPerCategory = totalBudget
            ? Math.round(totalBudget / (context.includes("thể thao") ? 3 : 5))
            : null;

          const isSportContext = context.includes("thể thao");

          // 1. Áo (top)
          let topFilter = {
            ...filters,
            category: outfitCategories.top,
          };
          if (isSportContext && !filters.brand) {
            topFilter.brand = "NIKE";
          }
          if (budgetPerCategory) {
            topFilter.priceMin = budgetPerCategory - 50000;
            topFilter.priceMax = budgetPerCategory + 50000;
          }
          outfitFilters.push({ type: "Áo", filter: topFilter });

          // 2. Quần (bottom)
          let bottomFilter = {
            ...filters,
            category: outfitCategories.bottom,
          };
          if (isSportContext && !filters.brand) {
            bottomFilter.brand = "NIKE";
          }
          if (budgetPerCategory) {
            bottomFilter.priceMin = budgetPerCategory - 50000;
            bottomFilter.priceMax = budgetPerCategory + 50000;
          }
          outfitFilters.push({ type: "Quần", filter: bottomFilter });

          // 3. Giày/Dép (footwear)
          let footwearFilter = { ...filters };
          if (Array.isArray(outfitCategories.footwear)) {
            footwearFilter.category = outfitCategories.footwear[0];
          } else {
            footwearFilter.category = outfitCategories.footwear;
          }
          if (budgetPerCategory) {
            footwearFilter.priceMin = budgetPerCategory - 50000;
            footwearFilter.priceMax = budgetPerCategory + 50000;
          }
          outfitFilters.push({ type: "Giày/Dép", filter: footwearFilter });

          // Chỉ thêm phụ kiện nếu không phải ngữ cảnh thể thao
          if (!isSportContext && outfitCategories.accessories?.length > 0) {
            if (outfitCategories.accessories.includes("Túi")) {
              let bagFilter = { ...filters, category: "Túi" };
              if (budgetPerCategory) {
                bagFilter.priceMin = budgetPerCategory - 50000;
                bagFilter.priceMax = budgetPerCategory + 50000;
              }
              outfitFilters.push({ type: "Túi", filter: bagFilter });
            }

            if (outfitCategories.accessories.includes("Mũ")) {
              let hatFilter = { ...filters, category: "Mũ" };
              if (budgetPerCategory) {
                hatFilter.priceMin = budgetPerCategory - 50000;
                hatFilter.priceMax = budgetPerCategory + 50000;
              }
              outfitFilters.push({ type: "Mũ", filter: hatFilter });
            }
          }

          let outfitProducts = [];
          for (const outfitFilter of outfitFilters) {
            console.log(`Fetching products for ${outfitFilter.type}:`, outfitFilter.filter);
            let products = await fetchProducts(outfitFilter.filter);
            if (products.length === 0 && isSportContext && outfitFilter.filter.brand === "NIKE") {
              console.log(`No Nike products found for ${outfitFilter.type}, trying without brand filter`);
              const fallbackFilter = { ...outfitFilter.filter };
              delete fallbackFilter.brand;
              products = await fetchProducts(fallbackFilter);
            }
            if (products.length > 0) {
              outfitProducts.push({ type: outfitFilter.type, product: products[0] });
            }
          }

          if (outfitProducts.length > 0) {
            let responseText = botReply.replace("GỢI Ý SẢN PHẨM", "") + "\nĐây là gợi ý outfit cho bạn:\n";
            outfitProducts.forEach((item) => {
              responseText += `- ${item.type}: ${item.product.name} - ${item.product.price.toLocaleString("vi-VN")} đ${
                item.product.discountRate > 0 ? ` (giảm ${item.product.discountRate}%)` : ""
              }\n`;
            });
            return {
              text: responseText,
              products: outfitProducts.map((item) => item.product),
            };
          }
          return { text: botReply.replace("GỢI Ý SẢN PHẨM", "") + " Hiện tại không có outfit nào phù hợp." };
        }

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
        } else {
          foundCategory = categories.find((cat) =>
            message.includes(cat.toLowerCase())
          );
          if (foundCategory) {
            console.log("Found category (direct match):", foundCategory);
            filters.category = foundCategory;
          }
        }

        console.log("Applied filters for product search:", filters);
        setCurrentFilters(filters);

        const products = await fetchProducts(filters);
        if (products.length > 0) {
          const sampleProducts = products.slice(0, 2);
          return {
            text: botReply.replace("GỢI Ý SẢN PHẨM", "") + " Đây là gợi ý sản phẩm:",
            products: sampleProducts,
          };
        }
        return { text: botReply.replace("GỢI Ý SẢN PHẨM", "") + " Hiện tại không có sản phẩm nào phù hợp." };
      }

      return { text: botReply };
    } catch (error) {
      console.error("Gemini API error:", error);
      return { text: "Xin lỗi, mình gặp lỗi rồi. Thử lại nhé!" };
    }
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
      maxH="60vh"
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

      <Box flex="1" overflowY="auto" mb={4} pr={2}>
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
                          {product.name} - ${product.price.toLocaleString("vi-VN")} đ
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