import React, { useState, useRef, useEffect, useContext } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  useToast,
  VStack,
  Box,
  Switch,
  Text,
  Flex,
} from "@chakra-ui/react";
import { Plus } from "react-feather";
import axiosInstance from "../../../Api/axiosInstance";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Image from "@editorjs/image";
import { UserContext } from "../../../context/UserContext";

const AddBlog = ({ onAddSuccess }) => {
  const { user } = useContext(UserContext);
  const [newBlog, setNewBlog] = useState({
    title: "",
    thumbnailFile: null,
    isPublished: false,
  });
  const [editorInstance, setEditorInstance] = useState(null);
  const editorRef = useRef(null);
  const isMounted = useRef(false);
  const toast = useToast();

  useEffect(() => {
    if (editorRef.current && !isMounted.current) {
      isMounted.current = true;

      const editor = new EditorJS({
        holder: editorRef.current,
        tools: {
          header: {
            class: Header,
            config: {
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 2,
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          image: {
            class: Image,
            config: {
              uploader: {
                async uploadByFile(file) {
                  const formData = new FormData();
                  formData.append("file", file);

                  try {
                    const response = await axiosInstance.post("/api/blogs/upload-image", formData, {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    });
                    return {
                      success: 1,
                      file: {
                        url: response.data,
                      },
                    };
                  } catch (error) {
                    toast({
                      title: "Lỗi",
                      description: error.customMessage || "Không thể tải ảnh lên.",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                    return {
                      success: 0,
                    };
                  }
                },
              },
              endpoints: {
                byUrl: "/api/fetch-image",
              },
            },
          },
        },
        data: {
          blocks: [
            {
              type: "paragraph",
              data: {
                text: "",
              },
            },
          ],
        },
        placeholder: "Bắt đầu nhập nội dung tại đây...",
        onReady: () => {
          console.log("Editor.js is ready!");
          setEditorInstance(editor);
        },
        onChange: () => {
          console.log("Editor content changed!");
        },
      });

      return () => {
        if (editor && typeof editor.destroy === "function") {
          editor.destroy();
          setEditorInstance(null);
          isMounted.current = false;
        }
      };
    }
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewBlog((prev) => ({ ...prev, thumbnailFile: e.target.files[0] }));
  };

  const handleSwitchChange = (e) => {
    setNewBlog((prev) => ({ ...prev, isPublished: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      toast({
        title: "Lỗi",
        description: "Bạn cần đăng nhập để thêm bài viết.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!editorInstance) {
      toast({
        title: "Lỗi",
        description: "Trình soạn thảo chưa sẵn sàng.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await editorInstance.isReady;

      const editorData = await editorInstance.save();
      console.log("Editor data on submit:", editorData);

      if (!editorData.blocks || editorData.blocks.length === 0) {
        toast({
          title: "Lỗi",
          description: "Nội dung bài viết không được để trống.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const blocks = editorData.blocks
        .map((block) => {
          switch (block.type) {
            case "header":
              return {
                type: "header",
                data: {
                  text: block.data.text,
                  level: block.data.level,
                },
              };
            case "paragraph":
              return {
                type: "paragraph",
                data: {
                  text: block.data.text,
                },
              };
            case "list":
              return {
                type: "list",
                data: {
                  style: block.data.style,
                  items: block.data.items,
                },
              };
            case "image":
              return {
                type: "image",
                data: {
                  url: block.data.file.url,
                  caption: block.data.caption || "",
                  alt: block.data.caption || "",
                },
              };
            default:
              return null;
          }
        })
        .filter((block) => block !== null);

      const contentJson = JSON.stringify({ blocks });

      const formData = new FormData();
      const blogData = {
        title: newBlog.title,
        content: contentJson,
        isPublished: newBlog.isPublished,
        userId: user.id,
      };
      formData.append("blog", new Blob([JSON.stringify(blogData)], { type: "application/json" }));
      if (newBlog.thumbnailFile) {
        formData.append("thumbnailFile", newBlog.thumbnailFile);
      }

      console.log("FormData trước khi gửi:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axiosInstance.post("/api/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setNewBlog({ title: "", thumbnailFile: null, isPublished: false });
        editorInstance.clear();
        toast({
          title: "Thành công",
          description: "Đã thêm bài viết mới.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        onAddSuccess(response.data);
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      // Sử dụng customMessage từ interceptor nếu có, nếu không thì fallback về thông báo mặc định
      const errorMessage = error.customMessage || error.response?.data || "Không thể thêm bài viết.";
      toast({
        title: "Lỗi",
        description:
          typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      maxW={{ base: "100%", md: "90%" }}
      mx="auto"
      p={{ base: 4, md: 6 }}
      bg="transparent"
      _dark={{ bg: "gray.900" }}
      borderRadius="md"
      boxShadow="sm"
    >
      <VStack spacing={{ base: 6, md: 8 }} align="stretch">
        {/* Tiêu đề bài viết */}
        <FormControl isRequired>
          <FormLabel fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
            Tiêu đề bài viết
          </FormLabel>
          <Input
            name="title"
            value={newBlog.title}
            onChange={handleInputChange}
            placeholder="Nhập tiêu đề bài viết (ví dụ: Chính sách thanh toán)"
            variant="outline"
            border="1px solid"
            borderColor="var(--primary-color)"
            bg="transparent"
            color="black"
            fontSize={{ base: "sm", md: "md" }}
            size="lg"
            _dark={{
              bg: "gray.800",
              borderColor: "gray.600",
              color: "white",
              _placeholder: { color: "gray.400" },
            }}
            _focus={{
              borderColor: "var(--primary-color)",
              boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
            }}
            _hover={{
              borderColor: "var(---hover-color)",
            }}
          />
        </FormControl>

        {/* Nội dung bài viết */}
        <FormControl isRequired>
          <FormLabel fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
            Nội dung bài viết
          </FormLabel>
          <Text
            fontSize={{ base: "sm", md: "sm" }}
            color="gray.500"
            _dark={{ color: "gray.400" }}
            mb={3}
          >
            Sử dụng thanh công cụ để định dạng văn bản, thêm danh sách hoặc chèn hình ảnh.
          </Text>
          <Box
            border="1px solid"
            borderColor="var(--primary-color)"
            borderRadius="md"
            p={{ base: 3, md: 4 }}
            bg="white"
            _dark={{ bg: "gray.800", borderColor: "gray.600" }}
            minHeight="400px"
            boxShadow="inset 0 1px 3px rgba(0, 0, 0, 0.1)"
          >
            <div ref={editorRef} style={{ minHeight: "400px" }} />
          </Box>
        </FormControl>

        {/* Ảnh đại diện */}
        <FormControl>
          <FormLabel fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
            Ảnh đại diện
          </FormLabel>
          <Text
            fontSize={{ base: "sm", md: "sm" }}
            color="gray.500"
            _dark={{ color: "gray.400" }}
            mb={3}
          >
            Chọn một hình ảnh để làm ảnh đại diện cho bài viết (không bắt buộc).
          </Text>
          <Input
            type="file"
            name="thumbnailFile"
            onChange={handleFileChange}
            accept="image/*"
            border="1px solid"
            borderColor="var(--primary-color)"
            borderRadius="md"
            p={2}
            bg="white"
            _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white" }}
            _hover={{
              borderColor: "var(--hover-color)",
            }}
            _focus={{
              borderColor: "var(--primary-color)",
              boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
            }}
          />
        </FormControl>

        {/* Switch và Nút Thêm bài viết */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          gap={{ base: 4, md: 0 }}
        >
          <FormControl display="flex" alignItems="center">
            <FormLabel fontSize={{ base: "md", md: "lg" }} fontWeight="bold" mb={0}>
              Xuất bản ngay
            </FormLabel>
            <Switch
              name="isPublished"
              isChecked={newBlog.isPublished}
              onChange={handleSwitchChange}
              size="lg"
            />
          </FormControl>

          <Button
            leftIcon={<Plus size={20} />}
            variant="solid"
            type="submit"
            isDisabled={!newBlog.title.trim()}
          >
            Thêm bài viết
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default AddBlog;