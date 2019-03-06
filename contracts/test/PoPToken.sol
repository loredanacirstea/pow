pragma solidity 0.5.4;

contract PoPToken is Token {
    string public name;
    string public symbol;
    uint8  public decimals = 18;
    uint256 public mint_value = 10 * 18;
    uint256 _totalSupply;

    event  Approval(address indexed source, address indexed target, uint amount);
    event  Transfer(address indexed source, address indexed target, uint amount);
    event  Minted(address indexed source, uint amount);

    mapping (address => uint) public  balanceOf;
    mapping (address => mapping (address => uint)) public allowance;

    constructor(string memory _name, string memory _symbol) public {
        name = _name;
        symbol = _symbol;
    }

    function() external payable {
        mint();
    }

    function mint() public payable {
        balanceOf[msg.sender] += mint_value;
        _totalSupply += mint_value;
        emit Minted(msg.sender, mint_value);
    }

    function totalSupply() public view returns (uint) {
        return _totalSupply;
    }

    function approve(address target, uint256 amount) public returns (bool success) {
        allowance[msg.sender][target] = amount;
        emit Approval(msg.sender, target, amount);
        return true;
    }

    function _transfer(address source, address target, uint amount) internal {
        require(target != address(0x0));
        require(balanceOf[source] >= amount);
        require(balanceOf[target] + amount >= balanceOf[target]);
        uint previousBalances = balanceOf[source] + balanceOf[target];
        balanceOf[source] -= amount;
        balanceOf[target] += amount;
        emit Transfer(source, target, amount);

        assert(balanceOf[source] + balanceOf[target] == previousBalances);
    }

    function transfer(address target, uint256 amount) public returns (bool success) {
        _transfer(msg.sender, target, amount);
        return true;
    }

    function transferFrom(address source, address target, uint256 amount) public returns (bool success) {
        require(amount <= allowance[source][msg.sender]);
        allowance[source][msg.sender] -= amount;
        _transfer(source, target, amount);
        return true;
    }
}
