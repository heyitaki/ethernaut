import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';

dotenv.config();

const privateKey: string =
  (process.env.PRIVATE_KEY?.slice(0, 2) === '0x' ? '' : '0x') + process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  defaultNetwork: 'rinkeby',
  etherscan: {
    // To verify contract on Etherscan
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    hardhat: {},
    mainnet: {
      url: process.env.MAINNET_URL,
      accounts: [privateKey],
    },
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [privateKey],
    },
    ropsten: {
      url: process.env.ROPSTEN_URL,
      accounts: [privateKey],
    },
  },
  solidity: {
    version: '0.8.0',
    settings: {
      optimizer: {
        enabled: true,
        runs: 3,
      },
    },
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false,
  },
};

export default config;
