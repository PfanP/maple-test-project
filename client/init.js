// This initializes the web3 object.
if (typeof web3 !== 'undefined') {
    window.addEventListener('load', async () => {
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                // Request account access if needed
                await ethereum.enable();
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */});
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);
        }
        // Non-dapp browsers...
        else {
            web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/3cffedfbe585497ebbcc14a820ee7bf1'));
        }
    });

}
else {
    web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/3cffedfbe585497ebbcc14a820ee7bf1'));
}