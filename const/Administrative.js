export const COLORS = {
    'teal_main': '#27B18A',
    'teal_darker': '#239F7C',
    'teal_lighter': '#52c0a1',
    'rose': '#b1274e',
    'gold': '#c0a152'
}

export const VERSION_ADDRESS = {
    'v1': "0xc4e58899d03EC476492EB4e903e0D4d3684a3Db3",
    undefined: '0x7F9c733d83b0942AE9172f74EC806C32891ddc34',
    'v1.1': '0x7F9c733d83b0942AE9172f74EC806C32891ddc34'
}

export const ETHERLOANS_ADDRESS_V1 = "0xc4e58899d03EC476492EB4e903e0D4d3684a3Db3";

export const ETHERLOANS_ADDRESS_V1_1 = "0x7F9c733d83b0942AE9172f74EC806C32891ddc34";

export const MINTABLE_ADDRESS_DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

export const MINTABLE_ADDRESS_USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

export const ERC20_ABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "spender",
                "type": "address"
            },
            {
                "name": "tokens",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "from",
                "type": "address"
            },
            {
                "name": "to",
                "type": "address"
            },
            {
                "name": "tokens",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "tokenOwner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "showMeTheMoney",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "to",
                "type": "address"
            },
            {
                "name": "tokens",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "tokenOwner",
                "type": "address"
            },
            {
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "remaining",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

export const ERC721_ABI = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_approved",
                "type": "address"
            },
            {
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_to",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_approved",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    }
];

export const ETHERLOANS_ABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "name": "_person",
                "type": "address"
            },
            {
                "name": "_lenderTrueBorrowerFalse",
                "type": "bool"
            },
            {
                "name": "_status",
                "type": "bool"
            }
        ],
        "name": "setStatus",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_name",
                "type": "string"
            },
            {
                "name": "_collateralPercentageRequirement",
                "type": "uint256"
            }
        ],
        "name": "createCommunity",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "",
            "type": "uint256"
        }],
        "name": "getCommunitySize",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "name": "_loanID",
                "type": "uint256"
            }
        ],
        "name": "rollMonthlyPayment",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "name": "_asset",
                "type": "address"
            }
        ],
        "name": "withdrawAllowance",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "name": "_lender",
                "type": "address"
            }
        ],
        "name": "allowanceView",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "name": "_loanID",
                "type": "uint256"
            }
        ],
        "name": "claimLoanDeposit",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "name": "_assetRequested",
                "type": "address"
            },
            {
                "name": "_notionalRequested",
                "type": "uint256"
            },
            {
                "name": "_monthlyPayments",
                "type": "uint256"
            },
            {
                "name": "_aprRequested",
                "type": "uint256"
            },
            {
                "name": "_assumedCollateralPercent",
                "type": "uint256"
            }
        ],
        "name": "createLoanRequest",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_fee",
                "type": "uint256"
            }
        ],
        "name": "setFee",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "name": "_collateralPercentageRequirement",
                "type": "uint256"
            }
        ],
        "name": "changeCollateralRequirement",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "name": "_loanID",
                "type": "uint256"
            }
        ],
        "name": "loanStatus",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            },
            {
                "name": "",
                "type": "bool"
            },
            {
                "name": "",
                "type": "bool"
            },
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "Communities",
        "outputs": [
            {
                "name": "Leader",
                "type": "address"
            },
            {
                "name": "Community_Name",
                "type": "string"
            },
            {
                "name": "Loans_Count",
                "type": "uint256"
            },
            {
                "name": "Loan_Offers_Count",
                "type": "uint256"
            },
            {
                "name": "Collateralization_Percentage_Required",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "name": "_loanID",
                "type": "uint256"
            }
        ],
        "name": "loanInformation",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "Communities_Created",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "name": "_loanID",
                "type": "uint256"
            }
        ],
        "name": "haltLoanRequest",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "name": "_loanID",
                "type": "uint256"
            },
            {
                "name": "_borrower",
                "type": "address"
            }
        ],
        "name": "makeMonthlyPayment",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "name": "_loanID",
                "type": "uint256"
            }
        ],
        "name": "makeFullPayment",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "name": "_lender",
                "type": "address"
            },
            {
                "name": "_asset",
                "type": "address"
            }
        ],
        "name": "allowanceView",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_asset",
                "type": "address"
            },
            {
                "name": "_status",
                "type": "bool"
            },
            {
                "name": "_precision",
                "type": "uint256"
            }
        ],
        "name": "changeAsset",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "name": "_loanID",
                "type": "uint256"
            },
            {
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "fundLoanRequest",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "indexed": true,
                "name": "_loanID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_amount",
                "type": "uint256"
            },
            {
                "indexed": true,
                "name": "_borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_asset",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_apr",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_monthlyPayments",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_firstPaymentUnix",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_collateralPercentageRequirement",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_fee",
                "type": "uint256"
            }
        ],
        "name": "loanRequested",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "indexed": true,
                "name": "_loanID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_asset",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_lender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_borrower",
                "type": "address"
            }
        ],
        "name": "loanFunded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "indexed": true,
                "name": "_loanID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_asset",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_borrower",
                "type": "address"
            }
        ],
        "name": "paymentMade",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_leader",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "communityCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_addedPerson",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_communityID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_name",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "_lenderTrueBorrowerFalse",
                "type": "bool"
            },
            {
                "indexed": false,
                "name": "_status",
                "type": "bool"
            }
        ],
        "name": "addedToCommunity",
        "type": "event"
    }
];

export const MINTABLE_ABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseApproval",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseApproval",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Mint",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "previousOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipRenounced",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];