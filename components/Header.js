import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="p-0.1 border-b-2 flex flex-row justify-between items-center bg-blue-100">

            <h2 className="py-4 px-4 font-bold text-2xl"><Link href={"/"}>NFT Marketplace</Link></h2>

            <div className="flex flex-row items-center">

                <Link href={"/"} className="mr-4 p-6">Home</Link>

                <Link href={"/sell-nft"} className="mr-4 p-6">
                    Sell NFT
                </Link>

                <ConnectButton moralisAuth={false} />

            </div>
        </nav>
    )
}
