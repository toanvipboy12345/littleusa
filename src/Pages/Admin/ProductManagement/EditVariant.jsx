import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Grid,
  Text,
  Select,
  IconButton,
  Image,
  Wrap,
  Box,
  WrapItem,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { Plus as AddIcon, Trash2 } from "react-feather";
import axiosInstance from "../../../Api/axiosInstance";

const EditVariant = ({ isOpen, onClose, variant, onEditSuccess }) => {
  const [editedVariant, setEditedVariant] = useState({
    color: "",
    sizes: [{ size: "", quantity: 0 }],
    mainImage: null,
    images: [],
    imageActions: [],
    productId: null,
    id: null,
    existingImages: [],
  });
  const toast = useToast();

  useEffect(() => {
    if (variant) {
      setEditedVariant({
        color: variant.color || "",
        sizes: variant.sizes
          ? variant.sizes.map((size) => ({
              size: size.size || "",
              quantity: size.quantity || 0,
              id: size.id || null,
            }))
          : [{ size: "", quantity: 0 }],
        mainImage: null,
        images: [],
        imageActions: [],
        productId: variant.productId || null,
        id: variant.id || null,
        existingImages: variant.images || [],
      });
    } else {
      setEditedVariant({
        color: "",
        sizes: [{ size: "" }],
        mainImage: null,
        images: [],
        imageActions: [],
        productId: null,
        id: null,
        existingImages: [],
      });
    }
  }, [variant]);

  const handleVariantInputChange = (field, value) => {
    setEditedVariant((prev) => ({ ...prev, [field]: value }));
  };

  const handleSizeChange = (sizeIndex, field, value) => {
    const updatedSizes = [...editedVariant.sizes];
    updatedSizes[sizeIndex][field] = value;
    setEditedVariant((prev) => ({ ...prev, sizes: updatedSizes }));
  };

  const addSize = () => {
    setEditedVariant((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "" }],
    }));
  };

  const removeSize = (sizeIndex) => {
    const updatedSizes = editedVariant.sizes.filter((_, i) => i !== sizeIndex);
    setEditedVariant((prev) => ({ ...prev, sizes: updatedSizes }));
  };

  const handleFileChange = (type, files) => {
    if (type === "mainImage") {
      setEditedVariant((prev) => ({ ...prev, mainImage: files[0] }));
    } else if (type === "images") {
      setEditedVariant((prev) => ({ ...prev, images: Array.from(files) }));
    }
  };

  const handleRemoveExistingImage = (imageIndex) => {
    const updatedExistingImages = [...editedVariant.existingImages];
    const removedImage = updatedExistingImages.splice(imageIndex, 1)[0];
    const updatedImageActions = [
      ...(editedVariant.imageActions || []),
      { action: "remove", imagePath: removedImage },
    ];
    setEditedVariant((prev) => ({
      ...prev,
      existingImages: updatedExistingImages,
      imageActions: updatedImageActions,
    }));
  };

  const handleSubmit = async () => {
    if (!editedVariant.color || editedVariant.color.trim() === "") {
      toast({
        title: "Lỗi",
        description: "Màu sắc không được để trống.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if (editedVariant.sizes.length === 0 || editedVariant.sizes.some(size => !size.size || size.size.trim() === "")) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ kích thước.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const variantData = {
      color: editedVariant.color.trim(),
      sizes: editedVariant.sizes.map((size) => ({
        size: size.size,
        id: size.id || null,
      })),
      imageActions: editedVariant.imageActions || [],
    };

    try {
      let response;
      const formData = new FormData();
      formData.append("variant", JSON.stringify(variantData));

      if (editedVariant.mainImage) {
        formData.append("mainImage", editedVariant.mainImage);
      }
      if (editedVariant.images && editedVariant.images.length > 0) {
        editedVariant.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      response = editedVariant.id
        ? await axiosInstance.put(
            `/api/products/${editedVariant.productId}/variants/${editedVariant.id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          )
        : await axiosInstance.post(
            `/api/products/${editedVariant.productId}/variants`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

      setEditedVariant((prev) => ({
        ...prev,
        color: response.data.color,
        sizes: response.data.sizes.map(size => ({
          size: size.size,
          quantity: size.quantity || 0,
          id: size.id || null,
        })),
        existingImages: response.data.images || [],
        imageActions: [],
        mainImage: null,
        images: [],
      }));

      if (variantData.imageActions.length > 0) {
        const removedImages = variantData.imageActions.filter(action => action.action === "remove").length;
        if (removedImages > 0) {
          toast({
            title: "Thành công",
            description: `Đã xóa ${removedImages} ảnh phụ thành công.`,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        }
      }

      if (variantData.imageActions.length === 0 || editedVariant.mainImage || editedVariant.images.length > 0 || editedVariant.color !== variant?.color || JSON.stringify(editedVariant.sizes.map(s => s.size)) !== JSON.stringify(variant?.sizes.map(s => s.size))) {
        toast({
          title: "Thành công",
          description: `Đã ${editedVariant.id ? "cập nhật" : "thêm"} biến thể thành công.`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }

      onEditSuccess(response.data);
      onClose();
    } catch (error) {
      console.error("Error editing variant:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message || "Không thể cập nhật/thêm biến thể.";
      toast({
        title: "Lỗi",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteVariant = async () => {
    if (!editedVariant.id) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa biến thể mới chưa được lưu.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try {
      await axiosInstance.delete(`/api/products/${editedVariant.productId}/variants/${editedVariant.id}`);
      onEditSuccess({ id: editedVariant.id, productId: editedVariant.productId, deleted: true });
      toast({
        title: "Thành công",
        description: "Đã xóa biến thể thành công.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      onClose();
    } catch (error) {
      console.error("Error deleting variant:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message || "Không thể xóa biến thể.";
      toast({
        title: "Lỗi",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{editedVariant.id ? "Chi tiết & Chỉnh sửa biến thể" : "Thêm biến thể mới"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateRows="auto auto auto auto auto" gap={6}>
            <Flex align="flex-start">
              <FormControl flex={1} isRequired>
                <FormLabel color="var(--primary-color)" _dark={{ color: "white" }}>
                  Màu sắc
                </FormLabel>
                <Input
                  value={editedVariant.color}
                  onChange={(e) => handleVariantInputChange("color", e.target.value)}
                  placeholder="Nhập màu sắc (ví dụ: RED, BLACK)"
                  variant="outline"
                  border="1px solid"
                  borderColor="var(--primary-color)"
                  bg="transparent"
                  color="black"
                  _dark={{
                    bg: "gray.800",
                    borderColor: "gray.600",
                    color: "white",
                    _placeholder: { color: "gray.400" },
                  }}
                />
              </FormControl>
            </Flex>

            <Box>
              <Grid templateColumns={editedVariant.sizes.some(size => size.id) ? "2fr 1fr 50px" : "2fr 1fr 50px"} gap={3} alignItems="center">
                {editedVariant.sizes.length > 0 && (
                  <Flex gridColumn="span 3" gap={3} mb={2}>
                    <Text flex="2" color="var(--primary-color)" _dark={{ color: "white" }}>
                      Kích thước *
                    </Text>
                    {editedVariant.sizes.some(size => size.id) && (
                      <Text flex="1" color="var(--primary-color)" _dark={{ color: "white" }}>
                        Số lượng
                      </Text>
                    )}
                    <Box width="50px" />
                  </Flex>
                )}
                {editedVariant.sizes.map((size, index) => (
                  <>
                    <Select
                      key={`${index}-size`}
                      value={size.size}
                      onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                      placeholder="Chọn kích thước"
                      variant="outline"
                      border="1px solid"
                      borderColor="var(--primary-color)"
                      bg="transparent"
                      color="black"
                      _dark={{
                        bg: "gray.800",
                        borderColor: "gray.600",
                        color: "white",
                        _placeholder: { color: "gray.400" },
                      }}
                    >
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="ONESIZE">ONESIZE</option>
                      <option value="36">36</option>
                      <option value="37">37</option>
                      <option value="38">38</option>
                      <option value="39">39</option>
                      <option value="40">40</option>
                      <option value="41">41</option>
                      <option value="42">42</option>
                      <option value="43">43</option>
                      <option value="XXL">XXL</option>
                    </Select>
                    {size.id && (
                      <Input
                        key={`${index}-quantity`}
                        value={size.quantity || 0}
                        isReadOnly
                        placeholder="Số lượng"
                        variant="outline"
                        border="1px solid"
                        borderColor="var(--primary-color)"
                        bg="transparent"
                        color="black"
                        _dark={{
                          bg: "gray.800",
                          borderColor: "gray.600",
                          color: "white",
                          _placeholder: { color: "gray.400" },
                        }}
                      />
                    )}
                    {!size.id && <Box />}
                    <Tooltip label="Xóa kích thước" placement="top">
                      <IconButton
                        key={`${index}-delete`}
                        icon={<Trash2 size={20} />}
                        aria-label="Xóa kích thước"
                        onClick={() => removeSize(index)}
                        variant="solid"
                        _dark={{
                          borderColor: "red.400",
                        }}
                      />
                    </Tooltip>
                  </>
                ))}
              </Grid>
            </Box>
            <Flex align="flex-start">
              <Button
                leftIcon={<AddIcon />}
                onClick={addSize}
                variant="solid"
                size="sm"
                bg="var(--primary-color)"
                color="var(--text-color)"
                _hover={{ bg: "var(--hover-color)" }}
                _dark={{
                  bg: "gray.700",
                  color: "white",
                  _hover: { bg: "gray.600" },
                }}
              >
                Thêm kích thước
              </Button>
            </Flex>

            {editedVariant.id && (
              <Flex align="flex-start" gap={4}>
                <FormControl flex={1}>
                  <FormLabel color="var(--primary-color)" _dark={{ color: "white" }}>
                    Hình ảnh chính 
                  </FormLabel>
                  {variant.mainImage && (
                    <Image
                      src={`http://localhost:8080${variant.mainImage}`}
                      alt="Hình ảnh chính"
                      boxSize="200px"
                      objectFit="cover"
                      
                      mb={2}
                    />
                  )}
                </FormControl>
                <FormControl flex={1}>
                  <FormLabel color="var(--primary-color)" _dark={{ color: "white" }}>
                    Hình ảnh bổ sung 
                  </FormLabel>
                  {editedVariant.existingImages && editedVariant.existingImages.length > 0 ? (
                    <Wrap spacing={2}>
                      {editedVariant.existingImages.map((image, index) => (
                        <WrapItem key={index}>
                          <Box position="relative">
                            <Image
                              src={`http://localhost:8080${image}`}
                              alt={`Hình ảnh bổ sung ${index + 1}`}
                              boxSize="100px"
                              objectFit="cover"
                              
                            />
                            <IconButton
                              aria-label="Xóa ảnh bổ sung"
                              icon={<Trash2 size={16} />}
                              size="sm"
                              position="absolute"
                              top="5px"
                              right="5px"
                              onClick={() => handleRemoveExistingImage(index)}
                            />
                          </Box>
                        </WrapItem>
                      ))}
                    </Wrap>
                  ) : (
                    <Text>Không có hình ảnh bổ sung</Text>
                  )}
                </FormControl>
              </Flex>
            )}

            <Flex align="flex-start" gap={4}>
              <FormControl flex={1}>
                <FormLabel color="var(--primary-color)" _dark={{ color: "white" }}>
                  Hình ảnh chính mới
                </FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("mainImage", e.target.files)}
                  variant="outline"
                  border="1px solid"
                  borderColor="var(--primary-color)"
                  bg="transparent"
                  color="black"
                  _dark={{
                    bg: "gray.800",
                    borderColor: "gray.600",
                    color: "white",
                  }}
                />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel color="var(--primary-color)" _dark={{ color: "white" }}>
                  Hình ảnh bổ sung mới
                </FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange("images", e.target.files)}
                  variant="outline"
                  border="1px solid"
                  borderColor="var(--primary-color)"
                  bg="transparent"
                  color="black"
                  _dark={{
                    bg: "gray.800",
                    borderColor: "gray.600",
                    color: "white",
                  }}
                />
              </FormControl>
            </Flex>
          </Grid>
        </ModalBody>
        <Flex justify="flex-end" gap={3} p={4}>
          <Button onClick={onClose} variant="ghost">
            Hủy
          </Button>
          {editedVariant.id && (
            <Button
              onClick={handleDeleteVariant}
              ml={2}
              colorScheme="red"
              variant="outline"
            >
              Xóa
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            variant="solid"
            bg="var(--primary-color)"
            color="var(--text-color)"
            _hover={{ bg: "var(--hover-color)" }}
            _dark={{
              bg: "gray.700",
              color: "white",
              _hover: { bg: "gray.600" },
            }}
          >
            Lưu
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default EditVariant;