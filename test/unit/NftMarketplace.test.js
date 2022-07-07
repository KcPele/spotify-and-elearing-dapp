const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const PRICE = ethers.utils.parseEther("0.1")
const TOKEN_ID = 0
const TOKEN_URI = ""
let crowdPeriod = 1000;
let endTime = 100
let isFunding = false
let coursUri = ""
let refundPeriod = 10000
let crowdStudentCount = 3
let crowdFundStarted = true

let PriceForUpload = ethers.utils.parseEther("0.01")
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Nft Marketplace Unit Tests", function () {
          let nftMarketplace, deployer, user, nftMarketplaceContract, basicNft, basicNftContract
          
          beforeEach(async () => {
                 accounts = await ethers.getSigners() // could also do with getNamedAccounts
              deployer = accounts[0]
              user = accounts[1]
              await deployments.fixture(["all"])
              nftMarketplaceContract = await ethers.getContract("NftMarketplace")
              nftMarketplace = nftMarketplaceContract.connect(deployer)
              basicNftContract = await ethers.getContract("BasicCourseNft")
              basicNft = basicNftContract.connect(deployer)
              await basicNft.mintNftContent(TOKEN_URI)
              await nftMarketplace.createCourse(
                crowdPeriod, 
                endTime,
                isFunding,
                refundPeriod,
                crowdStudentCount,
                crowdFundStarted,
                [user.address],
                {value: PriceForUpload}
            )
              await basicNft.approve(nftMarketplaceContract.address, TOKEN_ID)
          })
         describe("constructor", function () {
            it ("should set the basic nft address in the constructor", async () => {
                expect(basicNftContract.address).to.be.equal(await nftMarketplaceContract.s_nftCourseAddress())
            })
         })

         describe("Course", function() {
            
            it("should rever with error", async function() {
                await expect(
                    nftMarketplace.createCourse(
                        crowdPeriod, 
                        endTime,
                        isFunding,
                        refundPeriod,
                        crowdStudentCount,
                        crowdFundStarted,
                        [user.address]
                    )
                ).to.be.revertedWith("PriceMustBeAboveZero()")
            })
            it("should create a course and emit event", async function () {
                expect(
                    await nftMarketplace.createCourse(
                        crowdPeriod, 
                        endTime,
                        isFunding,
                        refundPeriod,
                        crowdStudentCount,
                        crowdFundStarted,
                        [user.address],
                        {value: PriceForUpload}
                    )
                ).to.emit("CourseCreated").withArgs(deployer.address, basicNftContract.address, 0 )
            })
         })

         describe("listCourse", function() {
            it("emits an event after listing a course", async function() {
                expect( await nftMarketplace.listCourse(TOKEN_ID, PRICE)).to.emit("CourseListed")
            })

            it("exclusively items that haven't been listed", async function () {
                await nftMarketplace.listCourse(TOKEN_ID, PRICE)
                const error = `AlreadyListed(${TOKEN_ID})`
                await expect(
                    nftMarketplace.listCourse(TOKEN_ID, PRICE)
                ).to.be.revertedWith(error)
            })
            it("exclusively allows owners to list", async function () {
                nftMarketplace = nftMarketplaceContract.connect(user)
                await basicNft.approve(user.address, TOKEN_ID)
                await expect(
                    nftMarketplace.listCourse(TOKEN_ID, PRICE)
                ).to.be.revertedWith("NotOwner")
            })
            it("revert on low price listing", async function () {
                await expect(
                    nftMarketplace.listCourse(TOKEN_ID, 0)
                ).to.be.revertedWith("PriceMustBeAboveZero()")
            })
            it("needs approvals to list Course", async function () {
                await basicNft.approve(ethers.constants.AddressZero, TOKEN_ID)
                await expect(
                    nftMarketplace.listCourse(TOKEN_ID, PRICE)
                ).to.be.revertedWith("NotApprovedForMarketplace")
            })
            it("emits an event after listing a course with arguments", async function() {
                expect( await nftMarketplace.listCourse(TOKEN_ID, PRICE)).to.emit("CourseListed").withArgs(
                    deployer.address,
                    basicNft.address,
                    TOKEN_ID,
                    PRICE
                    )
            })
            it("Updates listing with seller and price", async function () {
                await nftMarketplace.listCourse(TOKEN_ID, PRICE)
                const listing = await nftMarketplace.getListing(TOKEN_ID)
                assert(listing.price.toString() == PRICE.toString())
                assert(listing.seller.toString() == deployer.address)
            })
         })

         describe("listMusic", function() {
            it("emits an event after listing a course", async function() {
                expect(await nftMarketplace.listMusic(TOKEN_ID, PRICE)).to.emit("MusicListed")
            })

            // it("exclusively music that haven't been listed", async function () {
            //     await nftMarketplace.listMusic(TOKEN_ID, PRICE)
            //     const error = `AlreadyListed(${TOKEN_ID})`
            //     await expect(
            //         nftMarketplace.listMusic(TOKEN_ID, PRICE)
            //     ).to.be.revertedWith(error)
            // })
            it("exclusively allows owners to list", async function () {
                nftMarketplace = nftMarketplaceContract.connect(user)
                await basicNft.approve(user.address, TOKEN_ID)
                await expect(
                    nftMarketplace.listMusic(TOKEN_ID, PRICE)
                ).to.be.revertedWith("NotOwner")
            })
            it("revert on low price listing", async function () {
                await expect(
                    nftMarketplace.listMusic(TOKEN_ID, 0)
                ).to.be.revertedWith("PriceMustBeAboveZero()")
            })
            it("needs approvals to list Course", async function () {
                await basicNft.approve(ethers.constants.AddressZero, TOKEN_ID)
                await expect(
                    nftMarketplace.listMusic(TOKEN_ID, PRICE)
                ).to.be.revertedWith("NotApprovedForMarketplace")
            })
            it("emits an event after listing a course with arguments", async function() {
                expect( await nftMarketplace.listMusic(TOKEN_ID, PRICE)).to.emit("MusicListed").withArgs(
                    deployer.address,
                    basicNft.address,
                    TOKEN_ID,
                    PRICE
                    )
            })
            // it("Updates listing with seller and price", async function () {
            //     await nftMarketplace.listMusic(TOKEN_ID, PRICE)
            //     const song = await nftMarketplace.getSong(TOKEN_ID)
            //     assert(song.price.toString() == PRICE.toString())
            //     assert(song.seller.toString() == deployer.address)
            // })
         })

        
        //   describe("withdrawProceeds", function () {
        //       it("doesn't allow 0 proceed withdrawls", async function () {
        //           await expect(nftMarketplace.withdrawProceeds()).to.be.revertedWith("NoProceeds")
        //       })
        //       it("withdraws proceeds", async function () {
        //           await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
        //           nftMarketplace = nftMarketplaceContract.connect(user)
        //           await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE })
        //           nftMarketplace = nftMarketplaceContract.connect(deployer)

        //           const deployerProceedsBefore = await nftMarketplace.getProceeds(deployer.address)
        //           const deployerBalanceBefore = await deployer.getBalance()
        //           const txResponse = await nftMarketplace.withdrawProceeds()
        //           const transactionReceipt = await txResponse.wait(1)
        //           const { gasUsed, effectiveGasPrice } = transactionReceipt
        //           const gasCost = gasUsed.mul(effectiveGasPrice)
        //           const deployerBalanceAfter = await deployer.getBalance()

        //           assert(
        //               deployerBalanceAfter.add(gasCost).toString() ==
        //                   deployerProceedsBefore.add(deployerBalanceBefore).toString()
        //           )
        //       })
        //   })
      })
