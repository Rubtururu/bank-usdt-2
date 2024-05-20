// Asegúrate de reemplazar 'YOUR_CONTRACT_ADDRESS' y 'YOUR_CONTRACT_ABI' con los valores correctos.
const contractAddress = '0x09739FD707EfdB5DbaceA1566cd3CA5f62E67Aaf';
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"DividendClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"ceo","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimDividends","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"dividendPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getContractStats","outputs":[{"internalType":"uint256","name":"totalDepositedBNB","type":"uint256"},{"internalType":"uint256","name":"currentTreasuryPool","type":"uint256"},{"internalType":"uint256","name":"currentDividendPool","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserInfo","outputs":[{"internalType":"uint256","name":"userDeposit","type":"uint256"},{"internalType":"uint256","name":"lastDividendClaim","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDeposited","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"treasuryPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"deposit","type":"uint256"},{"internalType":"uint256","name":"lastDividendClaim","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

let web3;
let contract;

window.onload = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        alert("Please install MetaMask to use this dApp!");
    }
};

async function deposit() {
    const accounts = await web3.eth.getAccounts();
    const depositAmount = document.getElementById('depositAmount').value;
    contract.methods.deposit().send({ from: accounts[0], value: web3.utils.toWei(depositAmount, 'ether') })
        .on('transactionHash', (hash) => {
            console.log('Transaction sent with hash: ', hash);
        })
        .on('receipt', (receipt) => {
            console.log('Transaction confirmed with receipt: ', receipt);
        })
        .on('error', (error) => {
            console.error('Transaction failed with error: ', error);
        });
}

async function withdraw() {
    const accounts = await web3.eth.getAccounts();
    const withdrawAmount = document.getElementById('withdrawAmount').value;
    contract.methods.withdraw(web3.utils.toWei(withdrawAmount, 'ether')).send({ from: accounts[0] })
        .on('transactionHash', (hash) => {
            console.log('Transaction sent with hash: ', hash);
        })
        .on('receipt', (receipt) => {
            console.log('Transaction confirmed with receipt: ', receipt);
        })
        .on('error', (error) => {
            console.error('Transaction failed with error: ', error);
        });
}

async function claimDividends() {
    const accounts = await web3.eth.getAccounts();
    contract.methods.claimDividends().send({ from: accounts[0] })
        .on('transactionHash', (hash) => {
            console.log('Transaction sent with hash: ', hash);
        })
        .on('receipt', (receipt) => {
            console.log('Transaction confirmed with receipt: ', receipt);
        })
        .on('error', (error) => {
            console.error('Transaction failed with error: ', error);
        });
}

async function getUserInfo() {
    const accounts = await web3.eth.getAccounts();
    const userInfo = await contract.methods.getUserInfo(accounts[0]).call();
    document.getElementById('userInfo').innerText = `Deposit: ${web3.utils.fromWei(userInfo[0], 'ether')} BNB, Last Dividend Claim: ${new Date(userInfo[1] * 1000).toLocaleString()}`;
}

async function getContractStats() {
    const contractStats = await contract.methods.getContractStats().call();
    document.getElementById('contractStats').innerText = `Total Deposited: ${web3.utils.fromWei(contractStats[0], 'ether')} BNB, Treasury Pool: ${web3.utils.fromWei(contractStats[1], 'ether')} BNB, Dividend Pool: ${web3.utils.fromWei(contractStats[2], 'ether')} BNB`;
}
