// src/hooks/useDocumentTitle.js
import { useEffect } from "react";

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title || "Tên Cửa Hàng"; // Tiêu đề mặc định nếu không cung cấp
  }, [title]);
};

export default useDocumentTitle;