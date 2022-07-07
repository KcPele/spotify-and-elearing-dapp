
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./QuestionAndAnswer.sol";

error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error ItemNotForSale(address nftAddress, uint256 tokenId);
error NotListed(address nftAddress, uint256 tokenId);
error AlreadyListed(uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();
error PriceNotMetOnEnrollment( uint256 tokenId, uint256 price);
error NotOwnerOfCourse();
error RefundPeriodNotOver(uint256 tokenId);
error AmountMustBeAboveZero();
error NotCrowdFunding();
error CrowdFundHasStarted();
error CrowdFundNotOver();
error AlreadyPurchased();
error TransFerFailed();
abstract contract Handlers {

        event CourseListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
    event MusicListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event CourseBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
    event SongBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event CourseCreated(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );
    
    struct Course{
        address creator;
        uint256 crowdfundPeriod;
        uint256 crowdfundEndTime;
        bool isCrowdfund;
        uint256 refundPeriod;
        bool active;
        uint256 refundEndTime;
        bool crowdfundStarted;
        uint256 crowdfundGoalStudentCount;
        address[] tutors;
        QnABoard qaBoard;

    }

 


    struct SongListing {
        uint256 price;
        address seller;
    }
    struct Listing {
        uint256 price;
        address seller;
    }

}