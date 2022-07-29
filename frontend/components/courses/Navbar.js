import { Spacer, Flex, Box, Text, Image, Button } from "@chakra-ui/react";
import { Popup } from "./Popup";
export let Navbar = ({
  selectedAddress,
  balance,
  tokenData,
  ConnectWalletBtn,
  disconnectWallet,
  createCourse,
}) => {
  return (
   
      <Flex
        px="10"
        py="3"
        backgroundColor="white"
        shadow="xl"
        borderRadius="50"
        align="center"
      >
        <Spacer></Spacer>
        { selectedAddress && (
          <Popup createCourse={ (data) => createCourse(data) }></Popup>
        ) }
        <Flex>
          { selectedAddress && (
            <b>
              { " " }
              { selectedAddress.slice(0, 6) + "..." + selectedAddress.slice(-4) }
            </b>
          ) }
          <Spacer w="5"></Spacer>
          { balance !== undefined && (balance || 0).toString() }{ " " }
          { tokenData?.symbol }
        </Flex>

        { !selectedAddress && ConnectWalletBtn }
        {/* { selectedAddress && <Button
          borderRadius={ 50 }
          px={ 6 }
          type="button"
          onClick={ disconnectWallet }
        > Disconnect
        </Button> } */}
      </Flex>
  );
};
