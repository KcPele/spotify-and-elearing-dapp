// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
contract BasicCourseNft is ERC721URIStorage {
   
    uint256 private s_tokenCounter;
    string[] private s_tokenUris;


    event CourseMinted(uint256 indexed tokenId, string indexed tokenUri);

    constructor() ERC721("ElearnAndMusic", "EAM") {
        s_tokenCounter = 0;
    }

    //should not be caled if not from the ui
    function mintNftContent(string memory _tokenURI) public {
        _safeMint(msg.sender, s_tokenCounter);
        _setTokenURI(s_tokenCounter, _tokenURI);
        s_tokenUris.push(_tokenURI);
        emit CourseMinted(s_tokenCounter, _tokenURI);
        s_tokenCounter = s_tokenCounter + 1;
    }


    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

}
