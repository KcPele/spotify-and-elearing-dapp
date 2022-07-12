// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./BasicCourseNft.sol";
import "./QuestionAndAnswer.sol";
import "./Handlers.sol";

contract NftMarketplace is ReentrancyGuard, Handlers, Ownable {
    uint256 public s_totalCourseId = 0;
    address public s_nftCourseAddress;
    uint256 private myBalance = 0;
    uint256 public constant platformFeeShare = 10;
    uint256 private constant s_CONTENT_PRICE = 0.01 ether;

    mapping(uint256 => mapping(address => bool)) public hasRefunded;
    mapping(uint256 => mapping(address => uint256)) public puchasedCourse;
    mapping(address => uint256) public s_songProceeds;
    mapping(uint256 => Listing) private s_listings;
    mapping(uint256 => SongListing) private s_songListings;
    mapping(uint256 => mapping(address => uint256)) private s_proceeds;
    mapping(uint256 => Course) private s_courses;

    constructor(address _nftCourseAddress) {
        s_nftCourseAddress = _nftCourseAddress;
    }

    ///////modifiers

    modifier notListed(uint256 _courseId) {
        Listing memory listing = s_listings[_courseId];
        if (listing.price > 0) {
            revert AlreadyListed(_courseId);
        }
        _;
    }

    modifier notListedMusic(uint256 _musicId) {
        SongListing memory music = s_songListings[_musicId];
        if (music.price > 0) {
            revert AlreadyListed(_musicId);
        }
        _;
    }

    modifier isListed(uint256 _courseId) {
        Listing memory listing = s_listings[_courseId];
        if (listing.price <= 0) {
            revert NotListed(s_nftCourseAddress, _courseId);
        }
        _;
    }

    modifier isOwner(uint256 _courseId, address spender) {
        IERC721 nft = IERC721(s_nftCourseAddress);
        address owner = nft.ownerOf(_courseId);
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }
    modifier isActive(uint256 _courseId) {
        require(s_courses[_courseId].active, "Course is not active.");
        _;
    }

    modifier isNotActive(uint256 _courseId) {
        require(!s_courses[_courseId].active, "Course is active.");
        _;
    }

    modifier isRefundActive(uint256 _courseId) {
        require(
            block.timestamp <= s_courses[_courseId].refundEndTime ||
                s_courses[_courseId].refundEndTime == 0,
            "Refund period is over."
        );
        _;
    }

    modifier onlyTutorAndOwner(uint256 _courseId) {
        bool isTutor = false;
        for (uint256 i = 0; i < s_courses[_courseId].tutors.length; i++) {
            if (s_courses[_courseId].tutors[i] == _msgSender()) {
                isTutor = true;
                break;
            }
        }
        require(isTutor || _msgSender() == owner(), "Not a tutor or owner.");
        _;
    }

    /////////////////////
    // Main Functions //
    /////////////////////
    /*
     * @notice Method for listing NFTCorse and Music
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT Course / MUsic
     * @param price sale price for each item
     */

    // when crating a course i mill mint courseUrl first
    // then create course.
    // the front end form will accept tokenURI thani will use for the above
    function createCourse(
        uint256 _crowdfundPeriod,
        uint256 _crowdfundEndTime,
        bool _isCrowdfund,
        uint256 _refundPeriod,
        uint256 _crowdfundGoalStudentCount,
        bool _crowdfundStarted,
        address[] memory _tutors
    ) public payable {
        if (msg.value < s_CONTENT_PRICE) {
            revert PriceMustBeAboveZero();
        }
        myBalance += msg.value;
        // require(_tutors.length == _tutorsPercent.length);
        QnABoard _qaBoard = new QnABoard(address(this));
        uint256 _refundEndTime;
        if (!_isCrowdfund) {
            _refundEndTime = block.timestamp + _refundPeriod;
        }
        address _creator = msg.sender;
        s_courses[s_totalCourseId] = Course({
            creator: _creator,
            crowdfundPeriod: _crowdfundPeriod,
            crowdfundEndTime: _crowdfundEndTime,
            isCrowdfund: _isCrowdfund,
            refundPeriod: _refundPeriod,
            active: !_isCrowdfund,
            refundEndTime: _refundEndTime,
            crowdfundStarted: _crowdfundStarted,
            crowdfundGoalStudentCount: _crowdfundGoalStudentCount,
            tutors: _tutors,
            qaBoard: _qaBoard
        });

        emit CourseCreated(msg.sender, s_nftCourseAddress, s_totalCourseId);
        s_totalCourseId += 1;
    }

    function listCourse(uint256 _courseId, uint256 price)
        external
        payable
        notListed(_courseId)
        isOwner(_courseId, msg.sender)
    {
        //change name to mint couse payable
        // call the course contract payin in the URI and token id with other stuff
        //nft(address).mint(uri)
        if (price <= 0) {
            revert PriceMustBeAboveZero();
        }
        IERC721 nft = IERC721(s_nftCourseAddress);
        if (nft.getApproved(_courseId) != address(this)) {
            revert NotApprovedForMarketplace();
        }
        Course memory course = s_courses[_courseId];
        s_listings[_courseId] = Listing(price, course.creator);
        emit CourseListed(msg.sender, s_nftCourseAddress, _courseId, price);
    }

    //music functions here==============================================

    //in the front end i will mintNFtContent first then approve before i list music
    // the front end form will accept tokenURI thani will use for the above
    function listMusic(uint256 _musicId, uint256 _price) external notListedMusic(_musicId) isOwner(_musicId, msg.sender){
        if (_price <= 0) {
            revert PriceMustBeAboveZero();
        }

        IERC721 nft = IERC721(s_nftCourseAddress);
        if (nft.getApproved(_musicId) != address(this)) {
            revert NotApprovedForMarketplace();
        }
        s_songListings[s_totalCourseId] = SongListing(_price, _msgSender());
        emit MusicListed(msg.sender, s_nftCourseAddress, s_totalCourseId, _price);
        s_totalCourseId = s_totalCourseId + 1;
    }

    function buyMusic(uint256 _musicId) external payable {
        SongListing memory song = s_songListings[_musicId];

        if (msg.value < song.price) {
            revert PriceNotMet(s_nftCourseAddress, _musicId, song.price);
        }

        s_songProceeds[song.seller] += msg.value;
        emit SongBought(msg.sender, s_nftCourseAddress, _musicId, song.price);
    }

    function withdrawMusicProceeds() external nonReentrant {
        uint256 proceeds = (s_songProceeds[_msgSender()] * 90) / 100;
        uint256 proceedsFee = s_songProceeds[_msgSender()] - proceeds;
        if (proceeds <= 0) {
            revert NoProceeds();
        }
        s_songProceeds[_msgSender()] = 0;
        Address.sendValue(payable(_msgSender()), proceeds);
        Address.sendValue(payable(owner()), proceedsFee + myBalance);
        myBalance = 0;
    }

    /*
     * @notice Method for buying listing
     * @notice The owner of an NFT could unapprove the marketplace,
     * which would cause this function to fail
     * Ideally you'd also have a `createOffer` functionality.
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     */
    function buyCourse(uint256 _courseId) external payable isListed(_courseId) {
        Listing memory listedItem = s_listings[_courseId];

        if (msg.value < listedItem.price) {
            revert PriceNotMet(s_nftCourseAddress, _courseId, listedItem.price);
        }
        if (puchasedCourse[_courseId][_msgSender()] > 0) {
            revert AlreadyPurchased();
        }
        s_proceeds[_courseId][listedItem.seller] += msg.value;
        puchasedCourse[_courseId][_msgSender()] = msg.value;
        emit CourseBought(msg.sender, s_nftCourseAddress, _courseId, listedItem.price);
    }

    //handling course

    function refund(uint256 _courseId) external isRefundActive(_courseId) nonReentrant {
        require(!hasRefunded[_courseId][_msgSender()], "Already refunded");
        Listing memory listedItem = s_listings[_courseId];
        uint256 refundAmount = puchasedCourse[_courseId][_msgSender()];
        require(refundAmount != 0, "Refund amount cannot be 0");
        puchasedCourse[_courseId][_msgSender()] = 0;
        hasRefunded[_courseId][_msgSender()] = true;
        (bool sent, ) = payable(_msgSender()).call{value: refundAmount}("");
        if (!sent) {
            revert TransFerFailed();
        }
        s_proceeds[_courseId][listedItem.seller] -= refundAmount;
    }

    function crowdFundStart(uint256 _courseId) external onlyOwner isNotActive(_courseId) {
        Course memory course = s_courses[_courseId];
        if (!course.isCrowdfund) {
            revert NotCrowdFunding();
        }
        if (course.crowdfundStarted) {
            revert CrowdFundHasStarted();
        }
        s_courses[_courseId].crowdfundEndTime = block.timestamp + course.crowdfundPeriod;
        s_courses[_courseId].crowdfundStarted = true;
    }

    function crowdfundEnd(uint256 _courseId) external isNotActive(_courseId) {
        if (!s_courses[_courseId].isCrowdfund) {
            revert NotCrowdFunding();
        }
        if (block.timestamp < s_courses[_courseId].crowdfundEndTime) {
            revert CrowdFundNotOver();
        }
        if (
            s_proceeds[_courseId][_msgSender()] >
            s_courses[_courseId].crowdfundGoalStudentCount * s_CONTENT_PRICE
        ) {
            s_courses[_courseId].active = true;
            s_courses[_courseId].refundEndTime =
                block.timestamp +
                s_courses[_courseId].refundPeriod;
        } else {
            // crowdfund fails, refund never ends
            s_courses[_courseId].refundEndTime = 0;
        }
    }

    function distributeRevenue(uint256 _courseId) external {
        Course memory course = s_courses[_courseId];
        if (block.timestamp < course.refundEndTime && course.refundEndTime != 0) {
            revert RefundPeriodNotOver(_courseId);
        }
        uint256 fullAmount = s_proceeds[_courseId][msg.sender];
        if (fullAmount < 0) {
            revert AmountMustBeAboveZero();
        }

        // tutor's revenue share
        for (uint256 i = 0; i < course.tutors.length; i++) {
            uint256 tutorRev = ((fullAmount * 40) / 100);
            fullAmount -= tutorRev;
            Address.sendValue(payable(course.tutors[i]), tutorRev);
        }

        // QnA board
        uint256 qnaRev = (fullAmount * 20) / 100;
        fullAmount -= qnaRev;
        Address.sendValue(payable(address(course.qaBoard)), qnaRev);

        // Platform fee
        Address.sendValue(payable(owner()), fullAmount);
    }

    /////////////////////
    // Getter Functions //
    /////////////////////

    function getListing(uint256 _courseId) external view returns (Listing memory) {
        return s_listings[_courseId];
    }
    function getSong(uint256 _musicId) external view returns (SongListing memory) {
        return s_songListings[_musicId];
    }
    function getId() public view returns(uint256){
        return s_totalCourseId;
    }

    function getProceeds(address seller, uint256 _courseId) external view returns (uint256) {
        return s_proceeds[_courseId][seller];
    }

    function getCourses(uint256 _courseId) external view returns (Course memory) {
        return s_courses[_courseId];
    }

    receive() external payable {}
}
