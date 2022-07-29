// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
const fs = require("fs");
const contractsDir = __dirname + "/../frontend/contracts"

const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")
    const args = []
    const courseFactory = await deploy("CourseFactory", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(courseFactory.address, args)
    }
    log("----------------------------------------------------")
    console.log("CourseFactory address:", courseFactory.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(courseFactory);

  fs.writeFileSync(
    contractsDir + "/Course.json",
    JSON.stringify(artifacts.readArtifactSync("Course"), null, 2)
  );
//   fs.writeFileSync(
//     contractsDir + "/QnABoard.json",
//     JSON.stringify(artifacts.readArtifactSync("QnABoard"), null, 2)
//   );
}

function saveFrontendFiles(courseFactory) {
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    fs.writeFileSync(
      contractsDir + "/contract-address.json",
      JSON.stringify({ CourseFactory: courseFactory.address }, undefined, 2)
    );
  
    const CourseFactoryArtifact = artifacts.readArtifactSync("CourseFactory");
  
    fs.writeFileSync(
      contractsDir + "/CourseFactory.json",
      JSON.stringify(CourseFactoryArtifact, null, 2)
    );
  }

module.exports.tags = ["all", "courseFactory"]
