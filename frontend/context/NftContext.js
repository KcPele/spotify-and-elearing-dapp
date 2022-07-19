import { useQuery, gql } from '@apollo/client'
import React, {createContext, useReducer, useEffect} from 'react'
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import nftAbi from "../constants/BasicCourseNft.json"
import networkMapping from "../constants/networkMapping.json"
// import { GET_USER_MUSICS } from '../constants/subgraphQueries'


export const nftContext = createContext()

const contentReducer = (state, action) => {
    switch (action.type) {
      case "ADD_TRACK":
           return {
            tracks: [...state.tracks, action.payload]
           }
      case "ADD_COURSE":
          return {
            courses: [...state.courses, action.payload]
          }
      default:
        return state;
    }
}

const NftContextProvider = ({children}) => {

    const [content, dispatch] = useReducer(contentReducer, {tracks: [
      {
        title: "Heart",
        artist: "Adele",
        audioSrc: "https://ipfs.infura.io/ipfs/QmUcWbUDMjpJesDziA3tSZ8uN982MsmzR3YkYpccaq1Ls1",
        image: "https://ipfs.infura.io/ipfs/QmZMkxeC1PwKXPPc36XTVzNGsU6qZ71b5Fe5yw1Bk1bGwa",
        color: "orange",
      }
    ], courses: []})
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const GET_USER_MUSICS = gql`
{
  songBought(first: 5, where: { buyer: "${account}" }) {
        id
        buyer
        seller
        nftAddress
        tokenId
        price
    }
}
`

const {tracks, courses} = content

    // const {data, loading, error} = useQuery(GET_USER_MUSICS)
    
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    //will change it to nftaddress

    const marketplaceAddress = networkMapping[chainString]["NftMarketplace"][0]
    // console.log(marketplaceAddress)
    const nftAddress = networkMapping[chainString].NftAddress[0]
   
    const { runContractFunction} = useWeb3Contract()
  
    async function updateUI(tokenId) {
      const tokenURIOption = {
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
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
          let title = tokenURIResponse.title
          let artist = tokenURIResponse.attributes[0].artist
          let image = tokenURIResponse.image
          let audioSrc = tokenURIResponse.attributes[0].audioSrc
          let color = tokenURIResponse.attributes[0].color

          
          for(let i of tracks){
             if(i.title == title) {
              return
             }
          }
          dispatch({
              type: "ADD_TRACK",
              payload: {
                  title,
                  artist,
                  audioSrc,
                  image,
                  color,
              }
          })
          
  
      }
  }
  const getOwnerTracks = async () => {
    // loop through the returned graphql data and pass the id
      updateUI(0)
  }

  useEffect(() => {
      if (isWeb3Enabled) {
          getOwnerTracks()
      }
  }, [isWeb3Enabled])
  //set tracks to localStorage
  //use reducers to add the tracts from the graph
   
    
  return (
    <nftContext.Provider value={{  tracks, dispatch, courses }}>
      {children}
    </nftContext.Provider>
  )
}

export default NftContextProvider