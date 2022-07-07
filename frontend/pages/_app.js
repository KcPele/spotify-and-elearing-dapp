import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Head from "next/head"
import { NotificationProvider } from "web3uikit"
import { Navbar } from "../components"


function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>E&M Marketplace</title>
                <meta name="description" content="NFT Elearn & Music Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false} >
                <NotificationProvider>
                    <Navbar />
                    <Component {...pageProps} />
                </NotificationProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp
