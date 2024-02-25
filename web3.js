const Web3 = require('web3');
const contractABI = [[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"distributeDividends","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"dividends","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dividendsPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDividendsDistribution","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"treasury","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]];
const contractAddress = '0xCb4B6Eb3C7F7776daBB3Fc6e659FC5C8DD495da7';

const web3 = new Web3('https://bsc-dataseed.binance.org/');
const contract = new web3.eth.Contract(contractABI, contractAddress);

const account = '0xYourAccountAddress';
const provider = new HDWalletProvider(mnemonic, 'https://bsc-dataseed.binance.org/');
web3.eth.setProvider(provider);

async function deposit(amount) {
  const accounts = await web3.eth.getAccounts();
  const tx = {
    from: accounts[0],
    to: contractAddress,
    value: web3.utils.toWei(amount.toString(), 'ether'),
    gas: 1000000,
  };
  const receipt = await web3.eth.sendTransaction(tx);
  console.log(`Deposit successful: ${receipt.transactionHash}`);
}

async function withdraw(amount) {
  const accounts = await web3.eth.getAccounts();
  const tx = {
    from: accounts[0],
    to: contractAddress,
    data: contract.methods.withdraw(web3.utils.toWei(amount.toString(), 'ether')).encodeABI(),
    gas: 1000000,
  };
  const receipt = await web3.eth.sendTransaction(tx);
  console.log(`Withdraw successful: ${receipt.transactionHash}`);
}

async function distributeDividends() {
  const accounts = await web3.eth.getAccounts();
  const tx = {
    from: accounts[0],
    to: contractAddress,
    data: contract.methods.distributeDividends().encodeABI(),
    gas: 1000000,
  };
  const receipt = await web3.eth.sendTransaction(tx);
  console.log(`Dividends distributed successful: ${receipt.transactionHash}`);
}

// Example usage:
deposit(1); // deposit 1 ether
withdraw(0.5); // withdraw 0.5 ether
distributeDividends(); // distribute dividends