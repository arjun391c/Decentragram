pragma solidity >=0.4.21 <0.7.0;

contract Decentragram {
    string public name = "Decentragram";

    //store images
    uint public imageCount = 0;
    mapping (uint => Image) public images;

    struct Image {
        uint id;
        string hash;
        string description;
        uint tipAmount;
        address payable author;
    }

    //events
    event ImageCreated (
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
    );

     event ImageTipped (
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
    );
    
    //create images
    function uploadImage(string memory _hash, string memory _description) public {
        //validating the data
        require(bytes(_hash).length > 0);
        require(bytes(_description).length > 0);
        require(msg.sender != address(0x0));

        //increment image id
        imageCount++;

        //add image to contract
        images[imageCount] = Image(imageCount, _hash, _description, 0, msg.sender);

        //emiting event
        emit ImageCreated(imageCount, _hash, _description, 0, msg.sender);
    }

    //tip images
    function tipImageOwner(uint _id) public payable {
        //validate 
        require(_id > 0 && _id <= imageCount);

        //pickimage with _id 
        Image memory _image = images[_id];

        address payable _author = _image.author;
        //we need to pay author
        address(_author).transfer(msg.value);
        //increment tip for image
        _image.tipAmount = _image.tipAmount + msg.value;
        //store updated image back
        images[_id] = _image;

        emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
    }
}