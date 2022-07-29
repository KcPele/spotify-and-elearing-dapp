import React from 'react'
import Image from "next/image"
import styles from "../styles/Home.module.css"
// import { useMoralisQuery, useMoralis } from "react-moralis"
// import NFTBox from "../components/old/NFTBox"

const ListCourse = () => {
   // const { isWeb3Enabled } = useMoralis()
    // const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
    //     // TableName
    //     // Function for the query
    //     "ActiveItem",
    //     (query) => query.limit(10).descending("tokenId")
    // )
    // console.log(listedNfts)
  return (
    <h2>welcome</h2>
    // {/* <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
    // <div className="flex flex-wrap">
    //     {isWeb3Enabled ? (
    //         fetchingListedNfts ? (
    //             <div>Loading...</div>
    //         ) : (
    //             listedNfts.map((nft) => {
    //                 console.log(nft.attributes)
    //                 const { price, nftAddress, tokenId, marketplaceAddress, seller } =
    //                     nft.attributes
    //                 return (
    //                     <div>
    //                         <NFTBox
    //                             price={price}
    //                             nftAddress={nftAddress}
    //                             tokenId={tokenId}
    //                             marketplaceAddress={marketplaceAddress}
    //                             seller={seller}
    //                             key={`${nftAddress}${tokenId}`}
    //                         />
    //                     </div>
    //                 )
    //             })
    //         )
    //     ) : (
    //         <div>Web3 Currently Not Enabled</div>
    //     )}
    // </div> */}
  )
}

export default ListCourse