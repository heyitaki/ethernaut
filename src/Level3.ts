import { ethers } from 'hardhat';
import { deploy } from './utils';

async function solve() {
  const addr = await deploy('Level3');
  const contract = await ethers.getContractAt('Level3', addr, (await ethers.getSigners())[0]);
  for (let i = 0; i < 10; i++) {
    await (await contract.attack({ gasLimit: 100000 })).wait();
  }
}

solve();
