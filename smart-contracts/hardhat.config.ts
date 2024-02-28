import { HardhatUserConfig } from "hardhat/config";
require("@nomiclabs/hardhat-ethers");
import dotenv from "dotenv";
import "@nomiclabs/hardhat-ethers";

dotenv.config();



const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
