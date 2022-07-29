import React from 'react'
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Dapp } from "../components/courses/Dapp";
import { ChakraProvider } from '@chakra-ui/react';
const ListCourse = () => {

  return (
    <ChakraProvider>
    <Dapp />
  </ChakraProvider>

  )
}

export default ListCourse