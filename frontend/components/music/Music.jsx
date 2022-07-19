import React, { useContext, useEffect, useState } from "react"
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

const Music = ({ price, seller, cover, description, musicId }) => {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const dispatch = useNotification()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    //will change it to nftaddress

    const marketplaceAddress = networkMapping[chainString]["NftMarketplace"][0]

    const nftAddress = networkMapping[chainString].NftAddress[0]
    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)

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
                <Image
                    className="rounded-full m-auto"
                    loader={() => cover}
                    src={cover}
                    width="120px"
                    height="170px"
                />
                <div className="flex flex-wrap flex-col text-center">
                    <p>{description}</p>
                </div>
            </div>
        </div>
    )
}

export default Music
