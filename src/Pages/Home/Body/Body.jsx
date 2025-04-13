import React from "react";
import Promotion from "./Index/Promotion";
import Banner from "./Index/Banner";
import TopVariantsSlider from "./Index/TopVariantsSlider";
import { Box } from "@chakra-ui/react";
import Brandslider from "./Index/Brandslider";
import BlogListView from "./Index/BlogListView";
const Body = () => {
  return (
    <Box bg ="white">
      {/* Banner */}
      <Banner></Banner>
      {/*  */}
      <TopVariantsSlider></TopVariantsSlider>
      {/*  */}
      <Promotion></Promotion>
      {/*  */}
      <BlogListView></BlogListView>
      {/*  */}
      <Brandslider></Brandslider>
      {/*  */}
    </Box>
  );
};

export default Body;
