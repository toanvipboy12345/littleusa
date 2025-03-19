import React from "react";
import Promotion from "./Index/Promotion";
import Banner from "./Index/Banner";
import { Box } from "@chakra-ui/react";
const Body = () => {
  return (
    <Box>
      {/* Banner */}
      <Banner></Banner>
      {/*  */}
      <Promotion></Promotion>
    </Box>
  );
};

export default Body;
