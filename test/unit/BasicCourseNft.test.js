const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic NFT Unit Tests", function () {
          let deployer, basicNft, basicNftContract
          const TOKEN_ID = 0
          const TOKEN_URI = "https://ipfs.infura.io/ipfs/Qma9TYRgjJVfNm4x78GNZERHeL8GNfGFoVELxq4mjUfN1e"
          beforeEach(async () => {
              accounts = await ethers.getSigners() // could also do with getNamedAccounts
              deployer = accounts[0]
              await deployments.fixture(["all"])
              basicNftContract = await ethers.getContract("BasicCourseNft")
              basicNft = basicNftContract.connect(deployer)
              await basicNft.mintNftContent(TOKEN_URI)
          })
          describe("basic Nft", function () {
              it("should mint and nft and set the token id", async function(){
                let tokenId = await basicNft.getTokenCounter() - 1
                  expect(tokenId ).to.be.equal(TOKEN_ID)
              })
              it("should mint and nft and set the token uri", async function() {
                
                let tokenUri = await basicNft.tokenURI(TOKEN_ID)
                  expect(tokenUri).to.be.equal(TOKEN_URI)
              })
          })

          describe("basic nft events", function () {
            it("should emit an event after minting", async function (){
                expect(await basicNft.mintNftContent(TOKEN_URI)).to.emit("CourseMinted")
            })
            it("should emit the correct Id and Uri", async function() {
                await expect(basicNft.mintNftContent(TOKEN_URI)).to.emit(basicNftContract, "CourseMinted").withArgs(TOKEN_ID + 1, TOKEN_URI)
            })
          })
      })
