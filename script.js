document.addEventListener('DOMContentLoaded', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const contractAddress = '0xCb4B6Eb3C7F7776daBB3Fc6e659FC5C8DD495da7';
        const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"distributeDividends","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"dividends","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dividendsPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDividendsDistribution","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"treasury","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

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
