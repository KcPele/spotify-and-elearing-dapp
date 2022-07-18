
import { gql } from "@apollo/client"

export const GET_ACTIVE_MUSICS = gql`
    {
        activeMusic(first: 5, where: { buyer: "0x00000000" }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`

export const GET_ACTIVE_COURSES = gql`
    {
        activeCourse(first: 5, where: { buyer: "0x00000000" }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`
