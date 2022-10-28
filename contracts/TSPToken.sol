// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract TSPToken is ERC20 {

    uint256 constant TOTAL_SUPPLY = 1000000 * (10**18);

    constructor() ERC20("The Startup Place", "TSP") {
        _mint(msg.sender, TOTAL_SUPPLY);
    }
}