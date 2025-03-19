import React from "react";
import { Box } from "@chakra-ui/react";
import Header from "../../Home/Header/Header";
import Footer from "../../Home/Footer/Footer";

const MainLayout = ({ children }) => {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Header />

      {/* Nội dung chính */}
      <Box as="main" flex="1">
        {children}
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default MainLayout;