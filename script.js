document.addEventListener('DOMContentLoaded', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const contractAddress = '0x863364617697dEEc32653FFf98c1ff5Cf04d5e71';
        const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawal","type":"event"},{"inputs":[],"name":"ceoAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ceoAddress2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimDividends","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"deposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"distributeFunds","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"dividendsPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastDepositTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDividendsPaymentTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

        const contract = new web3.eth.Contract(contractABI, contractAddress);

        const accounts = await web3.eth.getAccounts();
        const userAccount = accounts[0];

        updateStats(); // Actualizar estadísticas iniciales

        // Event listeners para los botones de depositar, retirar y reclamar dividendos
        document.getElementById('deposit-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = document.getElementById('deposit-amount').value;
            await contract.methods.deposit().send({ from: userAccount, value: web3.utils.toWei(amount, 'ether') });
            updateStats();
            document.getElementById('deposit-amount').value = ''; // Limpiar el campo después del depósito
        });

        document.getElementById('withdraw-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = document.getElementById('withdraw-amount').value;
            await contract.methods.withdraw(web3.utils.toWei(amount, 'ether')).send({ from: userAccount });
            updateStats();
            document.getElementById('withdraw-amount').value = ''; // Limpiar el campo después del retiro
        });

        document.getElementById('claim-dividends').addEventListener('click', async () => {
            await contract.methods.claimDividends().send({ from: userAccount });
            updateStats();
        });

        // Función para actualizar las estadísticas del contrato
        async function updateStats() {
            const treasurePool = await contract.methods.getTreasurePool().call();
            const dividendsPool = await contract.methods.getDividendsPool().call();
            const lastDistribution = await contract.methods.getLastDividendsPaymentTime().call();
            const dailyDividends = await contract.methods.getDailyDividends().call();
            const userDeposit = await contract.methods.deposits(userAccount).call();
            const userDividendsEarned = await contract.methods.calculateDividends(userAccount).call();
            const userDailyDividends = await contract.methods.calculateDailyDividends(userAccount).call();
            const userAccumulatedDividends = await contract.methods.calculateAccumulatedDividends(userAccount).call();

            document.getElementById('treasure-pool').innerText = web3.utils.fromWei(treasurePool, 'ether');
            document.getElementById('dividends-pool').innerText = web3.utils.fromWei(dividendsPool, 'ether');
            document.getElementById('last-distribution').innerText = new Date(lastDistribution * 1000).toLocaleString();
            document.getElementById('daily-dividends').innerText = web3.utils.fromWei(dailyDividends, 'ether');
            document.getElementById('your-deposit').innerText = web3.utils.fromWei(userDeposit, 'ether');
            document.getElementById('your-dividends-earned').innerText = web3.utils.fromWei(userDividendsEarned, 'ether');
            document.getElementById('your-dividends-daily').innerText = web3.utils.fromWei(userDailyDividends, 'ether');
            document.getElementById('your-dividends-accumulated').innerText = web3.utils.fromWei(userAccumulatedDividends, 'ether');
        }
    } else {
        alert('Por favor, instala MetaMask para utilizar esta aplicación.');
    }
});
