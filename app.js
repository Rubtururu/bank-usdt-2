let web3;
let contract;

const contractAddress = '0xdB2E258Cb68A75405FE2ae84fC6DB833c7CA958D'; // Dirección de tu contrato
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"DividendClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"ceo","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimDividends","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"dividendPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"dividendsAvailableForUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getContractStats","outputs":[{"internalType":"uint256","name":"totalDepositedBNB","type":"uint256"},{"internalType":"uint256","name":"totalWithdrawnBNB","type":"uint256"},{"internalType":"uint256","name":"totalDividendsPaidBNB","type":"uint256"},{"internalType":"uint256","name":"currentTreasuryPool","type":"uint256"},{"internalType":"uint256","name":"currentDividendPool","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserInfo","outputs":[{"internalType":"uint256","name":"userDeposit","type":"uint256"},{"internalType":"uint256","name":"userWithdrawn","type":"uint256"},{"internalType":"uint256","name":"userDividendsClaimed","type":"uint256"},{"internalType":"uint256","name":"lastDividendClaim","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDividendAccumulationTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextDividendPaymentTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDeposited","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDividendsPaid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalWithdrawn","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"treasuryPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userAccumulatedDividends","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"deposit","type":"uint256"},{"internalType":"uint256","name":"withdrawn","type":"uint256"},{"internalType":"uint256","name":"dividendsClaimed","type":"uint256"},{"internalType":"uint256","name":"lastDividendClaim","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

async function init() {
    try {
        // Comprobar si MetaMask está instalado
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            await window.ethereum.enable(); // Habilitar MetaMask
            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log('Connected to contract:', contract);
            // Iniciar las funciones de escucha y actualización
            listenToEvents();
            updateUI();
            setInterval(updateUI, 30000); // Actualizar cada 30 segundos
        } else {
            console.error('MetaMask is not installed');
            alert("Please install MetaMask to use this dApp!");
        }
    } catch (error) {
        console.error('Error initializing:', error);
    }
}

async function deposit() {
    try {
        const accounts = await web3.eth.getAccounts();
        const depositAmount = document.getElementById('depositAmount').value;
        await contract.methods.deposit().send({ from: accounts[0], value: web3.utils.toWei(depositAmount, 'ether') });
        console.log('Deposit successful');
        updateUI();
    } catch (error) {
        console.error('Deposit failed:', error);
    }
}

async function withdraw() {
    try {
        const accounts = await web3.eth.getAccounts();
        const withdrawAmount = document.getElementById('withdrawAmount').value;
        await contract.methods.withdraw(web3.utils.toWei(withdrawAmount, 'ether')).send({ from: accounts[0] });
        console.log('Withdrawal successful');
        updateUI();
    } catch (error) {
        console.error('Withdrawal failed:', error);
    }
}

async function claimDividends() {
    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.claimDividends().send({ from: accounts[0] });
        console.log('Dividends claimed successfully');
        updateUI();
    } catch (error) {
        console.error('Failed to claim dividends:', error);
    }
}

async function updateUI() {
    try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            // Obtener la información del usuario
            const userInfo = await contract.methods.getUserInfo(accounts[0]).call();
            // Actualizar la interfaz de usuario con la información obtenida
            document.getElementById('userDeposit').innerText = `Deposit: ${web3.utils.fromWei(userInfo[0], 'ether')} BNB`;
            document.getElementById('userWithdrawn').innerText = `Withdrawn: ${web3.utils.fromWei(userInfo[1], 'ether')} BNB`;
            document.getElementById('userDividendsClaimed').innerText = `Dividends Claimed: ${web3.utils.fromWei(userInfo[2], 'ether')} BNB`;
            document.getElementById('userLastDividendClaim').innerText = `Last Dividend Claim: ${new Date(userInfo[3] * 1000).toLocaleString()}`;
            // Obtener y mostrar las estadísticas del contrato
            const contractStats = await contract.methods.getContractStats().call();
            document.getElementById('totalDeposited').innerText = `Total Deposited: ${web3.utils.fromWei(contractStats[0], 'ether')} BNB`;
            document.getElementById('totalWithdrawn').innerText = `Total Withdrawn: ${web3.utils.fromWei(contractStats[1], 'ether')} BNB`;
            document.getElementById('totalDividendsPaid').innerText = `Total Dividends Paid: ${web3.utils.fromWei(contractStats[2], 'ether')} BNB`;
            document.getElementById('treasuryPool').innerText = `Treasury Pool: ${web3.utils.fromWei(contractStats[3], 'ether')} BNB`;
            document.getElementById('dividendPool').innerText = `Dividend Pool: ${web3.utils.fromWei(contractStats[4], 'ether')} BNB`;
            // Actualizar el temporizador de dividendos
            const currentTime = Math.floor(Date.now() / 1000);
            const nextDividendPaymentTime = await contract.methods.nextDividendPaymentTime().call();
            const timeUntilNextDividend = nextDividendPaymentTime - currentTime;
            if (timeUntilNextDividend <= 0) {
                document.getElementById('dividendTimer').innerText = 'Dividends Ready to Claim';
            } else {
                const minutes = Math.floor(timeUntilNextDividend / 60);
                const seconds = timeUntilNextDividend % 60;
                document.getElementById('dividendTimer').innerText = `Next Dividend in: ${minutes}m ${seconds}s`;
            }
        } else {
            console.log('No accounts found');
        }
    } catch (error) {
        console.error('Error updating UI:', error);
    }
}

function listenToEvents() {
    // Escuchar eventos relevantes del contrato
    contract.events.Deposit({}, (error, event) => {
        if (!error) {
            console.log('Deposit event:', event);
            updateUI();
        } else {
            console.error('Error in Deposit event:', error);
        }
    });
    contract.events.Withdraw({}, (error, event) => {
        if (!error) {
            console.log('Withdrawal event:', event);
            updateUI();
        } else {
            console.error('Error in Withdrawal event:', error);
        }
    });
    contract.events.DividendClaimed({}, (error, event) => {
        if (!error) {
            console.log('Dividend claimed event:', event);
            updateUI();
        } else {
            console.error('Error in Dividend claimed event:', error);
        }
    });
}

// Llamar a la función init al cargar la página
init();
