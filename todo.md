nest coin hackathon
-- by the grace of God i wil be creating Song and E-liearning Dapp
or Ebook and Music Marketplace.
its a place where content creators can mint there music or books as 
nfts so the can prevent against copy/right and get paid for there content
-eth will be paid if someone is streaming your music. there is no middle man like spotify amason
-- ------------------Todos------------------------------
create a smart contract that mints music and ebooks 
   ---- there tokenURI will have the image: on IPFS, content: eg music or pdf books on ipfs before we construct the URI {
    like every other uri
   }
   --- to play a music you will pay eth
   --- to read a book,  u will have to pay eth
   ---- we store the eth of the content creator.
   ---- there will be a withdraw function for content creators to widthaw there funds
   ---- keep track of the music /books that has being paid for inother to allow users stream it again with out paying twice.
   ---- on minting the get to specify the price of each content

   -----createCourse.sol
   it will be an nftWere i get nave a function to creat course
   the function  will create the course then we set the tokenId and the url together

   --------------course nftUri/music-----------
   {
    "name": "CousName",
    "description": "about the couse",
    "image": "cousr coverPage https://ipfs.io/ipfs/ QmSsYRx3LpDAb1GZQm7zZ1AuHZjfbPkD6J7s9r41xu1mf8?filename=pug.png",
    "attributes": [
        {   
            "content": "course ipfs pdf URI",
            //any other thing here
        }
    ]
}


Team Mount

--------------note
to get the id of what is in place is
after seding the url to the basic contract
i will call the s_totalCorseId, as that will be the id of the minted Uri
and pass it as the id of the content to be listed

-------------frontend-----------
    ----it will ook like an e-com site
    ----hide the play/read button if u havent paid
    ---- buy the nft books




    if time
        implement puh notification to content creators


============not these
--- to get the books that the user has payied for.
--- there address shoud be the table name that stors the book id, uri, address, contractAdd--
--then when querying to show the one the have payied for will be using there address 
-to make things simple
----------------tech in use------------------
        NFT
        Hardhat
        Nextjs
        Moralis
        Web3uikit
        The graph

