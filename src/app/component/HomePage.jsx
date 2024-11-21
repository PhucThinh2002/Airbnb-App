"use client";
import React, { useState } from "react";
import HeaderMenu from "./HomePage/HeaderMenu";
import Search from "./HomePage/Search";
import Carousel from "./HomePage/Carousel";

const HomePage = () => {


  return (
    <>
      <HeaderMenu/>
      <Search />
      <Carousel/>
    </>
  );
};

export default HomePage;
