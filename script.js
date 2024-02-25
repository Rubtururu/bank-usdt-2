// Conectar con MetaMask
window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
        } catch (error) {
            console.error("User denied account access");
        }
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        console.error("No Ethereum provider detected");
    }
});

// Obtener instancia del contrato
const contractAddress = '0x863364617697dEEc32653FFf98c1ff5Cf04d5e71'; // Reemplaza con la dirección de tu contrato
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawal","type":"event"},{"inputs":[],"name":"ceoAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ceoAddress2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimDividends","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"deposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"distributeFunds","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"dividendsPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastDepositTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDividendsPaymentTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]; // Reemplaza con el ABI de tu contrato
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Actualizar las estadísticas del contrato
async function updateContractStats() {
    const ceoAddress = await contract.methods.ceoAddress().call();
    const ceoAddress2 = await contract.methods.ceoAddress2().call();
    const lastDividendsPaymentTime = await contract.methods.lastDividendsPaymentTime().call();
    const dividendsPool = await contract.methods.dividendsPool().call();
    const timeSinceLastDividends = Math.floor((Date.now() / 1000) - lastDividendsPaymentTime);
    const totalDeposits = await contract.methods.totalDeposits().call();
    const contractBalance = await web3.eth.getBalance(contractAddress);
    
    document.getElementById('ceo-address').textContent = ceoAddress;
    document.getElementById('ceo-address2').textContent = ceoAddress2;
    document.getElementById('last-dividends-payment-time').textContent = new Date(lastDividendsPaymentTime * 1000).toLocaleString();
    document.getElementById('dividends-pool').textContent = web3.utils.fromWei(dividendsPool, 'ether') + ' ETH';
    document.getElementById('time-since-last-dividends').textContent = formatTime(timeSinceLastDividends);
    document.getElementById('total-deposits').textContent = web3.utils.fromWei(totalDeposits, 'ether') + ' ETH';
    document.getElementById('contract-balance').textContent = web3.utils.fromWei(contractBalance, 'ether') + ' ETH';
}

// Formatear el tiempo en segundos a días, horas, minutos y segundos
function formatTime(timeInSeconds) {
    const days = Math.floor(timeInSeconds / (24 * 3600));
    const hours = Math.floor((timeInSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    
    let timeString = '';
    if (days > 0) timeString += `${days} días, `;
    if (hours > 0) timeString += `${hours} horas, `;
    if (minutes > 0) timeString += `${minutes} minutos, `;
    timeString += `${seconds} segundos`;

    return timeString;
}

// Ejecutar la actualización de estadísticas al cargar la página
window.addEventListener('load', () => {
    updateContractStats();
});
