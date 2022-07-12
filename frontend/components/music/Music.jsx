import React, { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import nftAbi from "../../constants/BasicCourseNft.json"
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

const Music = ({price, seller, cover, description, musicId }) => {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const [title, setTitle] = useState("")
    const [artist, setArtist] = useState("")
    const [imageURI, setImageURI] = useState("")
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]
    const nftAddress = networkMapping[chainString].NftAddress[0]
    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)

    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    //will change it to nftaddress

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: musicId,
        },
    })

    async function updateUI() {
        const tokenURI = await getTokenURI()
        console.log(`The TokenURI is ${tokenURI}`)
        // We are going to cheat a little here...
        if (tokenURI) {
            // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")

            console.log(tokenURIResponse)
    
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])
    const handleCardClick = () => {
        console.log("card clicked")
    }
    return (
        <div className="max-w-[60%] flex  rounded p-3 card-shadow text-white">
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
