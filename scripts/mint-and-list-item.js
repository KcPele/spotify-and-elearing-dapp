const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const PRICE = ethers.utils.parseEther("0.01")

async function mintAndList() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")

    let basicNft = await ethers.getContract("BasicCourseNft")
    console.log("Minting NFT...")
    // const mintTx = await basicNft.mintNftContent("https://ipfs.infura.io/ipfs/Qma9TYRgjJVfNm4x78GNZERHeL8GNfGFoVELxq4mjUfN1e")
    // const mintTxReceipt = await mintTx.wait(1)
    // const tokenId = mintTxReceipt.events[0].args.tokenId
    console.log("Approving NFT...")
    const approvalTx = await basicNft.approve(nftMarketplace.address, 9)
    await approvalTx.wait(1)
    console.log("Listing NFT...")
    const tx = await nftMarketplace.listMusic(9, PRICE)
    await tx.wait(1)
    console.log("NFT Listed!")
    if (network.config.chainId == 31337) {
        // Moralis has a hard time if you move more than 1 at once!
        await moveBlocks(1, (sleepAmount = 1000))
    }
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
