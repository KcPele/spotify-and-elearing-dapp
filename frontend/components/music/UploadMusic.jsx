import React, { useState } from 'react'
import {Modal, Input } from "web3uikit"
import { useMoralis, useWeb3Contract } from 'react-moralis'
import {useNotification} from 'web3uikit'
import networkMapping from "../../constants/networkMapping.json"
import nftAbi from "../../constants/BasicCourseNft.json"
import nftMarketplaceAbi from '../../constants/NftMarketplace.json'
import { ethers } from "ethers"
const UploadMusic = ({isVisible, onClose}) => {
  const {chainId} = useMoralis()
    const [musicUri, setMusicUri] = useState("")
    const [price, setPrice] = useState(0)
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification() 
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    //will change it to nftaddress

    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]
    const nftAddress = networkMapping[chainString].NftAddress[0]
    const { runContractFunction: getMusicId } = useWeb3Contract({
      abi: nftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: "getId",
      params: {},
  })
  
 //https://ipfs.infura.io/ipfs/Qma9TYRgjJVfNm4x78GNZERHeL8GNfGFoVELxq4mjUfN1e
 async function handleOk () {
     
      const uploadMusicUri = {
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "mintNftContent",
        params: {
           _tokenURI: musicUri
        },
    }
  console.log("statring")
    await runContractFunction({
        params: uploadMusicUri,
        onSuccess: () => approveAndList,
        onError: (error) => {
            console.log(error)
        },
    })
    console.log("ending")

    }
  
    async function approveAndList(tx) {
      
      console.log("Approving")
      await tx.wait(1)
      console.log("Approving...")
      const tokenId = await getMusicId()
      const approveOptions = {
          abi: nftAbi,
          contractAddress: nftAddress,
          functionName: "approve",
          params: {
              to: marketplaceAddress,
              tokenId: tokenId,
          },
      }

      await runContractFunction({
          params: approveOptions,
          onSuccess: () => handleUploadSuccess(tokenId),
          onError: (error) => {
              console.log(error)
          },
      })
  }


    const handleUploadSuccess = async(tokenId) => {

      const uploadOption = {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "listMusic",
        params: {
          _musicId: tokenId,
          _price: ethers.utils.parseEther(price),
        },
    }

    await runContractFunction({
        params: uploadOption,
        onSuccess: handleListSuccess,
        onError: (error) => console.log(error),
    })
}

async function handleListSuccess(tx) {
    await tx.wait(1)
    dispatch({
        type: "success",
        message: "NFT listing",
        title: "NFT Muisc uploaded",
        position: "topR",
    })
    onClose && onClose()
    setMusicUri("")
    setPrice(0)
}


  return (
    <Modal
      cancelText="Discard Changes"
      isVisible={isVisible}
      okText="Upload"
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={handleOk}
      title="To upload your music" >
      <div className='mb-3'>


        <Input
        
          label="music Uri"
          width="100%"
          name="musicUri"
          type='text'
          value={musicUri}
          onChange={(e) => setMusicUri(e.target.value)}
        />
        </div>
        <div className='mb-1'>
        <Input
          label="price"
          width="100%"
          name="price"
          type='number'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
    </Modal>
  )
}

export default UploadMusic