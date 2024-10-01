// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

interface INFTWithLevel is IERC721 {
    /**
     * @notice Returns level of the specified token.
     * @param _tokenId Token id.
     * @return level_ Level of the token.
     */
    function getLevelOfTokenById(uint256 _tokenId) external view returns (uint256 level_);
}
