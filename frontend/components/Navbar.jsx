import { ConnectButton } from "web3uikit"
import Link from "next/link"
import { useMoralis } from "react-moralis"
const Navbar = () => {
    const { isWeb3Enabled } = useMoralis()
    return (
        <nav className="p-2 flex flex-row justify-between items-center card-shadow">
            <h1 className="py-4 px-6 font-bold text-3xl shadow">E&M</h1>
            <div className="flex flex-row items-center">
                <Link href="/">
                    <a className="mr-4 py-2 px-5 bg-blue-500 text-white rounded-full">Home</a>
                </Link>
                {isWeb3Enabled && (
                    <>
                        <Link href="/list-course">
                            <a className="mr-4 py-2 px-5 bg-blue-500 text-white rounded-full">All Courses</a>
                        </Link>
                        <Link href="/list-music">
                            <a className="mr-4 py-2 px-5 bg-blue-500 text-white rounded-full">All Music</a>
                        </Link>
                    </>
                )}
                        <span>Rinkeby Only</span>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}

export default Navbar
