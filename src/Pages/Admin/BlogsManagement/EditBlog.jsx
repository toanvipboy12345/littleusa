import React, { useState, useRef, useEffect, useContext } from "react";
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
  Stack,
  Box,
  Button,
  useToast,
  Switch,
  Text,
  Flex,
  Image as ChakraImage,
} from "@chakra-ui/react";
import axiosInstance from "../../../Api/axiosInstance";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import EditorImage from "@editorjs/image";
import { UserContext } from "../../../context/UserContext";

const EditBlog = ({ isOpen, onClose, blog, onEditSuccess }) => {
  const { user } = useContext(UserContext);
  const [editedBlog, setEditedBlog] = useState({
    title: "",
    thumbnailFile: null,
    isPublished: false,
  });
  const [editorInstance, setEditorInstance] = useState(null);
  const editorRef = useRef(null);
  const toast = useToast();

  // Hàm chuẩn hóa dữ liệu cho EditorJS
  const normalizeEditorData = (blocks) => {
    return blocks.map((block) => {
      if (block.type === "image") {
        return {
          ...block,
          data: {
            file: {
              url: block.data.url, // Chuyển URL từ data.url sang data.file.url
            },
            caption: block.data.caption || "",
            alt: block.data.alt || block.data.caption || "",
          },
        };
      }
      return block;
    });
  };

  // Hàm khởi tạo EditorJS
  const initializeEditor = (data) => {
    if (!editorRef.current) {
      console.log("Editor ref is not ready yet!");
      return;
    }

    // Hủy EditorJS cũ nếu tồn tại
    if (editorInstance) {
      editorInstance.destroy();
      setEditorInstance(null);
    }

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
          class: EditorImage,
          config: {
            uploader: {
              // Upload ảnh mới
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
              // Hỗ trợ tải ảnh từ URL (dành cho ảnh được thêm mới qua URL)
              async uploadByUrl(url) {
                return {
                  success: 1,
                  file: {
                    url: url,
                  },
                };
              },
            },
            endpoints: {
              byUrl: "/api/fetch-image",
            },
          },
        },
      },
      data: data || { blocks: [] },
      placeholder: "Bắt đầu nhập nội dung tại đây...",
      onReady: () => {
        console.log("Editor.js is ready!");
        setEditorInstance(editor);
        const editorElement = editorRef.current.querySelector(".codex-editor__redactor");
        if (editorElement) {
          editorElement.focus();
        }
      },
      onChange: () => {
        console.log("Editor content changed!");
      },
    });
  };

  // Khởi tạo EditorJS khi modal mở
  useEffect(() => {
    if (isOpen) {
      let initialData = { blocks: [] };
      try {
        if (blog?.content) {
          const parsedData = JSON.parse(blog.content);
          // Chuẩn hóa dữ liệu trước khi truyền vào EditorJS
          initialData = {
            blocks: normalizeEditorData(parsedData.blocks || []),
          };
          console.log("Normalized blog content for EditorJS:", initialData);
        } else {
          console.log("No content found in blog:", blog);
          toast({
            title: "Cảnh báo",
            description: "Bài viết không có nội dung để hiển thị.",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error parsing blog content:", error);
        toast({
          title: "Lỗi",
          description: `Không thể tải nội dung bài viết: ${error.message}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }

      // Trì hoãn khởi tạo EditorJS để đảm bảo DOM sẵn sàng
      const timer = setTimeout(() => {
        if (editorRef.current) {
          console.log("Editor ref is ready, initializing EditorJS...");
          initializeEditor(initialData);
        } else {
          console.log("Editor ref is still not ready after timeout!");
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        if (editorInstance && typeof editorInstance.destroy === "function") {
          editorInstance.destroy();
          setEditorInstance(null);
        }
      };
    }
  }, [isOpen, blog, toast]);

  // Cập nhật state khi mở Modal với dữ liệu của blog
  useEffect(() => {
    if (blog) {
      setEditedBlog({
        title: blog.title || "",
        thumbnailFile: null,
        isPublished: blog.isPublished || false,
      });
    }
  }, [blog]);

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBlog((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi file ảnh
  const handleFileChange = (e) => {
    setEditedBlog((prev) => ({ ...prev, thumbnailFile: e.target.files[0] }));
  };

  // Xử lý thay đổi trạng thái xuất bản
  const handleSwitchChange = (e) => {
    setEditedBlog((prev) => ({ ...prev, isPublished: e.target.checked }));
  };

  // Xử lý submit form chỉnh sửa bài viết
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      toast({
        title: "Lỗi",
        description: "Bạn cần đăng nhập để chỉnh sửa bài viết.",
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

      // Lấy dữ liệu gốc từ blog.content để bảo toàn các khối không được chỉnh sửa
      let originalBlocks = [];
      try {
        if (blog?.content) {
          const parsedContent = JSON.parse(blog.content);
          originalBlocks = parsedContent.blocks || [];
        }
      } catch (error) {
        console.error("Error parsing original blog content:", error);
      }

      // Xử lý các khối từ editorData, đồng thời bảo toàn các khối không được hỗ trợ
      const updatedBlocks = editorData.blocks.map((block) => {
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
                url: block.data.file?.url || block.data.url, // Chuyển từ data.file.url về data.url để tương thích với backend
                caption: block.data.caption || "",
                alt: block.data.alt || block.data.caption || "",
              },
            };
          default: {
            // Nếu gặp khối không được hỗ trợ, tìm trong originalBlocks để bảo toàn
            const originalBlock = originalBlocks.find(
              (origBlock) => origBlock.type === block.type
            );
            return originalBlock || null; // Giữ nguyên khối gốc nếu có, nếu không thì bỏ
          }
        }
      }).filter((block) => block !== null);

      // Thêm lại các khối gốc chưa được chỉnh sửa (nếu có)
      const finalBlocks = [
        ...updatedBlocks,
        ...originalBlocks.filter(
          (origBlock) =>
            !updatedBlocks.some(
              (updatedBlock) =>
                updatedBlock.type === origBlock.type &&
                updatedBlock.data?.text === origBlock.data?.text &&
                updatedBlock.data?.url === origBlock.data?.url
            )
        ),
      ];

      const contentJson = JSON.stringify({ blocks: finalBlocks });

      const formData = new FormData();
      const blogData = {
        title: editedBlog.title,
        content: contentJson,
        isPublished: editedBlog.isPublished,
        userId: user.id,
      };
      formData.append("blog", new Blob([JSON.stringify(blogData)], { type: "application/json" }));
      if (editedBlog.thumbnailFile) {
        formData.append("thumbnailFile", editedBlog.thumbnailFile);
      }

      console.log("FormData trước khi gửi:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axiosInstance.put(`/api/blogs/${blog.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật bài viết.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        onEditSuccess(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      const errorMessage =
        error.customMessage || error.response?.data || "Không thể cập nhật bài viết.";
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW={{ base: "90%", md: "800px" }} borderRadius="md">
        <ModalHeader fontSize="lg" fontWeight="bold">
          Cập nhật bài viết
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box as="form" onSubmit={handleSubmit}>
            <Stack spacing={{ base: 6, md: 8 }}>
              {/* Tiêu đề bài viết */}
              <FormControl isRequired>
                <FormLabel fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
                  Tiêu đề bài viết
                </FormLabel>
                <Input
                  name="title"
                  value={editedBlog.title}
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
                    borderColor: "var(--hover-color)",
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
                  <div
                    ref={editorRef}
                    style={{
                      minHeight: "400px",
                      width: "100%",
                      padding: "0",
                    }}
                  />
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
                {blog?.thumbnail && (
                  <Box mt={3}>
                    <Text fontSize="sm" mb={1}>
                      Ảnh hiện tại:
                    </Text>
                    <ChakraImage
                      src={blog.thumbnail}
                      alt="Thumbnail"
                      maxW="150px"
                      borderRadius="md"
                      boxShadow="sm"
                    />
                  </Box>
                )}
              </FormControl>

              {/* Switch Xuất bản */}
              <FormControl display="flex" alignItems="center">
                <FormLabel fontSize={{ base: "md", md: "lg" }} fontWeight="bold" mb={0}>
                  Xuất bản ngay
                </FormLabel>
                <Switch
                  name="isPublished"
                  isChecked={editedBlog.isPublished}
                  onChange={handleSwitchChange}
                  size="lg"
                />
              </FormControl>
            </Stack>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onClose}
            variant="ghost"
            size="lg"
            _dark={{ color: "white", _hover: { bg: "gray.700" } }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            ml={3}
            variant="solid"
            size="lg"
            _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
            _active={{ transform: "translateY(0)", boxShadow: "sm" }}
            _dark={{
              bg: "gray.700",
              color: "white",
              _hover: { bg: "gray.600", transform: "translateY(-2px)", boxShadow: "md" },
              _active: { bg: "gray.700", transform: "translateY(0)", boxShadow: "sm" },
            }}
          >
            Lưu
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditBlog;