import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Head from "next/head"
import { NotificationProvider } from "web3uikit"
import { Navbar } from "../components"
import NftContextProvider from "../context/NftContext"

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
})

function MyApp({ Component, pageProps }) {
 
    return (
        <div className="scroll-smooth">
            <Head>
                <title>E&M Marketplace</title>
                <meta name="description" content="NFT Elearn & Music Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false} >
            <ApolloProvider client={client}>
                <NotificationProvider>
                    <NftContextProvider>
                    <Navbar />
                    <div className=" min-h-full font-mono">
                    <Component {...pageProps} />
                    </div>
                    </NftContextProvider>
                </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp
