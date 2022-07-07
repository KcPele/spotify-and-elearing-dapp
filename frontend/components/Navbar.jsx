import { ConnectButton } from "web3uikit"
import Link from "next/link"

const Navbar = () => {
  return (
    <nav className="p-3 flex flex-row justify-between items-center">
    <h1 className="py-4 px-4 font-bold text-3xl">E&M</h1>
    <div className="flex flex-row items-center">
        <Link href="/">
            <a className="mr-4 p-6">Home</a>
        </Link>
        <Link href="/list-course">
            <a className="mr-4 p-6">List Course</a>
        </Link>
        <Link href="/list-music">
            <a className="mr-4 p-6">List Music</a>
        </Link>
        <ConnectButton moralisAuth={false} />
    </div>
</nav>
  )
}

export default Navbar