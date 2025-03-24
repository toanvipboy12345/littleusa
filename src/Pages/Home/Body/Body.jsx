import React from "react";
import Promotion from "./Index/Promotion";
import Banner from "./Index/Banner";
import TopVariantsSlider from "./Index/TopVariantsSlider";
import { Box } from "@chakra-ui/react";
const Body = () => {
  return (
    <Box>
      {/* Banner */}
      <Banner></Banner>
      {/*  */}
      <TopVariantsSlider></TopVariantsSlider>
      {/*  */}
      <Promotion></Promotion>
    </Box>
  );
};

export default Body;
