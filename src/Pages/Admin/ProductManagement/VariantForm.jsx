import React from "react";
import {
  Box,
  HStack,
  Text,
  Input,
  Select,
  Button,
  FormControl,
  FormLabel,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

const VariantForm = ({
  variant,
  index,
  handleVariantChange,
  handleSizeChange,
  addSizeToVariant,
  removeSizeFromVariant,
  removeVariant,
  handleFileChange,
}) => {
  const sizeOptions = [
    "S", "M", "L", "XL", "XXL", "ONESIZE",
    "37", "38", "39", "40", "41", "42", "43"
  ];

  return (
    <Box
      p={{ base: 4, md: 6 }}
      mt={2}
      bg="transparent"
      _dark={{ bg: "gray.800", borderColor: "gray.700" }}
    >
      <HStack spacing={2} align="center" mb={4}>
        <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
          Biến thể {index + 1}
        </Text>
      </HStack>

      <HStack spacing={4} align="flex-start" flexWrap="wrap" justifyContent={{ base: "flex-start", md: "space-between" }}>
        <FormControl isRequired flex={{ base: "100%", md: "48%" }}>
          <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
            Màu sắc
          </FormLabel>
          <HStack spacing={2} align="center">
            <Input
              name="color"
              value={variant.color}
              onChange={(e) => handleVariantChange(index, "color", e.target.value)}
              placeholder="Nhập màu sắc (ví dụ: Red, Black)"
              variant="outline"
              border="1px solid"
              borderColor="var(--primary-color)"
              bg="transparent"
              color="black"
              fontSize={{ base: "sm", md: "md" }}
              size="md"
              _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
              _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
              _hover={{ borderColor: "var(--hover-color)" }}
            />
            <IconButton
              aria-label="Xóa biến thể"
              icon={<DeleteIcon />}
              onClick={() => removeVariant(index)}
              colorScheme="red"
              size="sm"
              _dark={{ bg: "gray.700", color: "white", _hover: { bg: "gray.600" }, _active: { bg: "gray.700" } }}
            />
          </HStack>
        </FormControl>

        <FormControl flex={{ base: "100%", md: "48%" }} mt={{ base: 4, md: 0 }}>
          <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
            Kích thước
          </FormLabel>
          {variant.sizes.map((size, sizeIndex) => (
            <HStack
              key={sizeIndex}
              spacing={2}
              mt={2}
              align="center"
              flexWrap="wrap"
              justifyContent={{ base: "flex-start", md: "space-between" }}
            >
              <HStack spacing={2} align="center" flex={{ base: "100%", md: "auto" }}>
                <Select
                  value={size.size}
                  onChange={(e) => handleSizeChange(index, sizeIndex, "size", e.target.value)}
                  placeholder="Chọn kích thước"
                  variant="outline"
                  border="1px solid"
                  borderColor="var(--primary-color)"
                  bg="transparent"
                  color="black"
                  fontSize={{ base: "sm", md: "md" }}
                  size="md"
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                  _focus={{ borderColor: "var(---primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
                  _hover={{ borderColor: "var(--hover-color)" }}
                >
                  {sizeOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
                <IconButton
                  aria-label="Xóa kích thước"
                  icon={<DeleteIcon />}
                  onClick={() => removeSizeFromVariant(index, sizeIndex)}
                  colorScheme="red"
                  size="sm"
                  _dark={{ bg: "gray.700", color: "white", _hover: { bg: "gray.600" }, _active: { bg: "gray.700" } }}
                />
              </HStack>
            </HStack>
          ))}
        </FormControl>
      </HStack>

      <Button
        mt={4}
        leftIcon={<AddIcon />}
        onClick={() => addSizeToVariant(index)}
        variant="solid"
        size="md"
        w={{ base: "full", md: "200px" }}
        bg="var(--primary-color)"
        color="var(--text-color)"
        _hover={{ bg: "var(--hover-color)" }}
        _active={{ bg: "var(--primary-color)" }}
        _dark={{ bg: "gray.700", color: "white", _hover: { bg: "gray.600" }, _active: { bg: "gray.700" } }}
      >
        Thêm kích thước
      </Button>

      <HStack spacing={4} mt={4} align="flex-start" flexWrap="wrap" justifyContent={{ base: "flex-start", md: "space-between" }}>
        <FormControl isRequired flex={{ base: "100%", md: "48%" }}>
          <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
            Hình ảnh chính
          </FormLabel>
          <Input
            type="file"
            onChange={(e) => handleFileChange(index, "mainImage", e.target.files)}
            accept="image/*"
            variant="outline"
            border="1px solid"
            borderColor="var(--primary-color)"
            bg="transparent"
            fontSize={{ base: "sm", md: "md" }}
            size="md"
            p={1}
            _dark={{ bg: "gray.800", borderColor: "gray.600", _placeholder: { color: "gray.400" } }}
            _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
            _hover={{ borderColor: "var(--hover-color)" }}
          />
        </FormControl>
        <FormControl flex={{ base: "100%", md: "48%" }}>
          <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
            Hình ảnh bổ sung
          </FormLabel>
          <Input
            type="file"
            multiple
            onChange={(e) => handleFileChange(index, "images", e.target.files)}
            accept="image/*"
            variant="outline"
            border="1px solid"
            borderColor="var(--primary-color)"
            bg="transparent"
            fontSize={{ base: "sm", md: "md" }}
            size="md"
            p={1}
            _dark={{ bg: "gray.800", borderColor: "gray.600", _placeholder: { color: "gray.400" } }}
            _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
            _hover={{ borderColor: "var(--hover-color)" }}
          />
        </FormControl>
      </HStack>
    </Box>
  );
};

export default VariantForm;