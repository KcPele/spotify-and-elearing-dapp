import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Head from "next/head"
import { NotificationProvider } from "web3uikit"
import { Navbar } from "../components"
import NftContextProvider from "../context/NftContext"

function MyApp({ Component, pageProps }) {
    return (
        <div className="scroll-smooth">
            <Head>
                <title>E&M Marketplace</title>
                <meta name="description" content="NFT Elearn & Music Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false} >
                <NotificationProvider>
                    <NftContextProvider>
                    <Navbar />
                    <div className=" min-h-screen">
                    <Component {...pageProps} />
                    </div>
                    </NftContextProvider>
                </NotificationProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp
