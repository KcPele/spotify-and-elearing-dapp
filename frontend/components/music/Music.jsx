import React, { useRef, useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import nftAbi from "../../constants/BasicCourseNft.json"
import nftMarketplaceAbi from "../../constants/NftMarketplace.json"
import networkMapping from "../../constants/networkMapping.json"
import Image from "next/image"
import { ethers } from "ethers"
const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}

const Music = ({ price, seller, musicId }) => {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const [cover, setImageURI] = useState("https://media.istockphoto.com/photos/concert-stage-on-rock-festival-music-instruments-silhouettes-picture-id1199243596?k=20&m=1199243596&s=612x612&w=0&h=5L3fWhbB4YtVOPsnnqrUg22FaHnSGVCjkrG79wB31Tc=")
    const [description, setDescription] = useState("")
    const [title, setTitle] = useState("")
    const dispatch = useNotification()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    //will change it to nftaddress
    const {runContractFunction} = useWeb3Contract()

    const marketplaceAddress = networkMapping[chainString]["NftMarketplace"][0]

    const nftAddress = networkMapping[chainString].NftAddress[0]
    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)

    async function updateUI() {
        const tokenURIOption = {
          abi: nftAbi,
          contractAddress: nftAddress,
          functionName: "tokenURI",
          params: {
              tokenId: musicId,
          },
        }
        const tokenURI =  await runContractFunction({
          params: tokenURIOption,
          onSuccess: () => {console.log("token getton")},
          onError: (error) => {
              console.log(error, "error here")
          },
      })
        // We are going to cheat a little here..
        if (tokenURI) {
            const tokenURIResponse = await (await fetch(tokenURI)).json()
            let desc = tokenURIResponse.description
           setTitle(tokenURIResponse.title)
            setImageURI(tokenURIResponse.image)
        
            setDescription(desc)
           

    
        }
    }
  
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyMusic",
        msgValue: price,
        params: {
            _musicId: musicId,
        },
    })
    const handleBuyItemSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: " Song Payed!",
            title: "Song Bought",
            position: "topR",
        })
    }
    const handleCardClick = () => {
        console.log("card clicked")
        buyItem({
            onError: (error) => console.log(error),
            onSuccess: handleBuyItemSuccess,
        })
        // isOwnedByUser
        //     ? "min"
        //     : buyItem({
        //           onError: (error) => console.log(error),
        //           onSuccess: handleBuyItemSuccess,
        //       })
    }
    

    return (
        <div
            className="max-w-[60%] flex cursor-pointer rounded p-3 card-shadow text-white"
            onClick={handleCardClick}
        >
            <div className="flex flex-col items-center">
            <div className="flex flex-wrap flex-col text-center">
                    <h3>{title}</h3>
                    
                </div>
                <Image
                    className="rounded-full m-auto"
                    loader={() => cover}
                    src={cover}
                    width="120px"
                    height="170px"
                />
                <div className="flex flex-wrap flex-col text-center">
                    <p>{description}</p>
                    <p>uploaded by {formattedSellerAddress}</p>
                </div>
            </div>
        </div>
    )
}

export default Music
