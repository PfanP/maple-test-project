    pragma solidity 0.5.10;

    library SafeMath {

        function mul(uint256 a, uint256 b) internal pure returns (uint256) {
            if (a == 0) {return 0;}
            uint256 c = a * b;
            require(c / a == b);
            return c;
        }

        function div(uint256 a, uint256 b) internal pure returns (uint256) {
            require(b > 0);
            uint256 c = a / b;
            return c;
        }

        function sub(uint256 a, uint256 b) internal pure returns (uint256) {
            require(b <= a);
            uint256 c = a - b;
            return c;
        }

        function add(uint256 a, uint256 b) internal pure returns (uint256) {
            uint256 c = a + b;
            require(c >= a);
            return c;
        }

        function mod(uint256 a, uint256 b) internal pure returns (uint256) {
            require(b != 0);
            return a % b;
        }
    }

    contract UncollateralizedLoans {

        using SafeMath for uint256;

        address Admin = 0xe1C407c7f8bCE7592cC422fB82c29E0A7d6a4f5d;

        // The primary hierarchy, Communities are formed to invite trusted lenders and borrowers to transact.
        mapping(uint => Community) public Communities;
        mapping(address => uint) public Communities_Created;
        uint Community_Count;
        uint Fee;

        // Controlled by uber admin.
        mapping(address => bool) Permitted_Underlying_Assets;
        mapping(address => uint) Permitted_Underlying_Asset_Precisions;

        struct Community {
            address Leader;
            string Community_Name;
            uint Loans_Count;
            uint Loan_Offers_Count;
            uint Collateralization_Percentage_Required;
            mapping(address => bool) Permitted_Lenders;                     // Track the permitted lenders.
            mapping(address => bool) Permitted_Borrowers;                   // Track the permitted borrowers.
            mapping(address => mapping (address => uint)) Draw_Allowance;   // First address = asset ... second address = user ... Draw_Allowance[0xDAI][0xJOE]
            mapping(uint => Loan) Loans;
        }

        struct Loan {
            address Borrower;
            address Asset_Requested;
            uint Notional_Requested;
            uint Notional_Supplied;
            uint Monthly_Payments;
            uint APR_Offered; // 10,000 precision ... i.e. 853 indicates 8.53% APR ... 853/10000
            uint Collateralization_Percentage_Required;
            uint Fee;

            uint Lenders_Count;
            Status_Request Loan_Status;
            Information Loan_Info;

            mapping(uint => Lender_Info) Lenders;
            mapping(address => bool) Active_Lender;
            mapping(address => uint) Active_Lender_Spot;
            mapping(address => bool) Deposit_Claimed;
        }

        struct Information {
            uint Principal_Owed;
            uint Next_Payment_Unix;
            uint Amount_Owed_Next_Payment;
            bool Payments_Started;
            uint Payments_Missed;
        }

        struct Lender_Info {
            address Lender;
            uint Amount_Lent;
        }

        uint private _guardCounter;

        enum Status_Request { Inactive, Active, Active_Halted, Active_Filled, Paid, Cancelled }

        // --
        // Constructor
        // --

        constructor() public {
            Permitted_Underlying_Assets[0x6B175474E89094C44Da98b954EedeAC495271d0F] = true;
            Permitted_Underlying_Assets[0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48] = true;
            Permitted_Underlying_Asset_Precisions[0x6B175474E89094C44Da98b954EedeAC495271d0F] = 1000000000000000000;
            Permitted_Underlying_Asset_Precisions[0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48] = 1000000;
        }

        // --
        // Modifiers
        // --

        modifier nonReentrant() {
            _guardCounter += 1;
            uint256 localCounter = _guardCounter;
            _;
            require(localCounter == _guardCounter);
        }

        modifier isAdmin() {
            require(msg.sender == Admin);
            _;
        }

        // --
        // Events
        // --

        // loanRequested
        event loanRequested(
            uint indexed _communityID,
            uint indexed _loanID,
            uint _amount,
            address indexed _borrower,
            address _asset,
            uint  _apr,
            uint _monthlyPayments,
            uint _firstPaymentUnix,
            uint _collateralPercentageRequirement,
            uint _fee
        );

        // loanFunded
        event loanFunded(
            uint indexed _communityID,
            uint indexed _loanID,
            uint _amount,
            address _asset,
            address indexed _lender,
            address _borrower
        );

        // paymentMade
        event paymentMade(
            uint indexed _communityID,
            uint indexed _loanID,
            uint _amount,
            address _asset,
            address indexed _borrower
        );

        // communityCreated
        event communityCreated(
            address indexed _leader,
            uint _communityID,
            string _name
        );

        // communityAdded
        event addedToCommunity(
            address indexed _addedPerson,
            uint indexed _communityID,
            string _name,
            bool _lenderTrueBorrowerFalse,
            bool _status
        );

        // --
        // Functions
        // --

        function createCommunity(string memory _name, uint _collateralPercentageRequirement) public {
            require(Communities_Created[msg.sender] < 5, "You've created too many communities.");
            require(_collateralPercentageRequirement >= 0 && _collateralPercentageRequirement <= 100, "Outside of range permitted for _collateralPercentageRequirement.");
            Communities[Community_Count] = Community(msg.sender, _name, 0, 0, _collateralPercentageRequirement);
            uint _tempCount = Community_Count;
            Community_Count++;
            Communities[_tempCount].Permitted_Lenders[msg.sender] = true;
            Communities[_tempCount].Permitted_Borrowers[msg.sender] = true;
            emit communityCreated(msg.sender, _tempCount, _name);
            emit addedToCommunity(msg.sender, _tempCount, _name, true, true);
            emit addedToCommunity(msg.sender, _tempCount, _name, false, true);
        }

        function changeCollateralRequirement(uint _communityID, uint _collateralPercentageRequirement) public {
            require(msg.sender == Communities[_communityID].Leader, "You are not the leader of this community.");
            require(_collateralPercentageRequirement >= 0 && _collateralPercentageRequirement <= 100, "Outside of range permitted for _collateralPercentageRequirement.");
            Communities[_communityID].Collateralization_Percentage_Required = _collateralPercentageRequirement;
        }

        function setStatus(uint _communityID, address _person, bool _lenderTrueBorrowerFalse, bool _status) public {
            require(msg.sender == Communities[_communityID].Leader, "You are not authorized to change this.");
            if (_lenderTrueBorrowerFalse) {
                Communities[_communityID].Permitted_Lenders[_person] = _status;
            }
            else {
                Communities[_communityID].Permitted_Borrowers[_person] = _status;
            }
            emit addedToCommunity(_person, _communityID, Communities[_communityID].Community_Name, _lenderTrueBorrowerFalse, _status);
        }

        function setFee(uint _fee) isAdmin public {
            require(_fee >= 0 && _fee <= 100);
            Fee = _fee;
        }

        function changeAsset(address _asset, bool _status, uint _precision) isAdmin public {
            Permitted_Underlying_Assets[_asset] = _status;
            Permitted_Underlying_Asset_Precisions[_asset] = _precision;
        }

        function createLoanRequest(uint _communityID, address _assetRequested, uint _notionalRequested, uint _monthlyPayments, uint _aprRequested, uint _assumedCollateralPercent) public nonReentrant {
            require(Communities[_communityID].Permitted_Borrowers[msg.sender] == true, "You are not a permitted borrower.");
            require(Permitted_Underlying_Assets[_assetRequested] == true, "Asset not permitted.");
            require(_monthlyPayments <= 12 && _monthlyPayments >= 3, "Monthly payments exceed 12 months or less than 3.");
            require(_assumedCollateralPercent == Communities[_communityID].Collateralization_Percentage_Required);
            require(_notionalRequested >= Permitted_Underlying_Asset_Precisions[_assetRequested] && _notionalRequested.div(Permitted_Underlying_Asset_Precisions[_assetRequested]) % 10 == 0, "Amount must be 10 increment.");
            Information memory y = Information(0, now + 5184000, 0, false, 0); // time-change-here [5184000 --> 7200 --> 600]
            Communities[_communityID].Loans[Communities[_communityID].Loans_Count] = Loan(msg.sender, _assetRequested, _notionalRequested, 0, _monthlyPayments, _aprRequested, Communities[_communityID].Collateralization_Percentage_Required, Fee, 0, Status_Request.Active, y);
            uint collateralPercentage = Communities[_communityID].Collateralization_Percentage_Required;
            emit loanRequested(_communityID, Communities[_communityID].Loans_Count, _notionalRequested, msg.sender, _assetRequested, _aprRequested, _monthlyPayments, now + 2592000, collateralPercentage, Fee); // time-change-here [2592000 --> 3600 --> 300]
            Communities[_communityID].Loans_Count++;
            // Borrower deposits collateral for his loan request.
            if (Communities[_communityID].Collateralization_Percentage_Required > 0) {
                require(ERC20(_assetRequested).transferFrom(msg.sender, address(this), _notionalRequested.mul(collateralPercentage).div(100)));
            }
        }

        function haltLoanRequest(uint _communityID, uint _loanID) public nonReentrant {
            require(msg.sender == Communities[_communityID].Loans[_loanID].Borrower, "You did not initiate this loan.");
            require(Communities[_communityID].Loans[_loanID].Loan_Status == Status_Request.Active, "This loan is not Active.");
            // Transfer back any additional liquidity deposited for loan not required.
            if (Communities[_communityID].Loans[_loanID].Notional_Supplied < Communities[_communityID].Loans[_loanID].Notional_Requested) {
                uint _amountTransferredIn = Communities[_communityID].Loans[_loanID].Notional_Requested.mul(Communities[_communityID].Loans[_loanID].Collateralization_Percentage_Required).div(100);
                uint _percentageToDeduct = Communities[_communityID].Loans[_loanID].Notional_Supplied.mul(100).div(Communities[_communityID].Loans[_loanID].Notional_Requested);
                uint _amountToDeduct = _amountTransferredIn.mul(_percentageToDeduct).div(100);
                uint _amountToReturn = _amountTransferredIn.sub(_amountToDeduct);
                if (_amountToDeduct == 0) {
                    Communities[_communityID].Loans[_loanID].Loan_Status = Status_Request.Cancelled;
                    Communities[_communityID].Loans[_loanID].Monthly_Payments = 0;
                    Communities[_communityID].Loans[_loanID].Loan_Info.Principal_Owed = 0;
                    Communities[_communityID].Loans[_loanID].Loan_Info.Amount_Owed_Next_Payment = 0;
                    Communities[_communityID].Loans[_loanID].Loan_Info.Next_Payment_Unix = 0;
                }
                else {
                    Communities[_communityID].Loans[_loanID].Loan_Status = Status_Request.Active_Halted;
                    Communities[_communityID].Loans[_loanID].Loan_Info.Payments_Started = true;
                }
                require(ERC20(Communities[_communityID].Loans[_loanID].Asset_Requested).transfer(msg.sender, _amountToReturn));
            }
        }

        function fundLoanRequest(uint _communityID, uint _loanID, uint _amount) public nonReentrant {
            require(Communities[_communityID].Permitted_Lenders[msg.sender] == true, "You are not a permitted lender.");
            require(Communities[_communityID].Loans[_loanID].Borrower != msg.sender, "You can't lend to yourself.");
            address _asset = Communities[_communityID].Loans[_loanID].Asset_Requested;
            require(_amount >= Permitted_Underlying_Asset_Precisions[_asset].mul(10) && _amount.div(Permitted_Underlying_Asset_Precisions[_asset]) % 10 == 0, "Amount must be 10 increment.");
            require(_amount <= Communities[_communityID].Loans[_loanID].Notional_Requested.sub(Communities[_communityID].Loans[_loanID].Notional_Supplied), "Amount must be equal or less than amount left.");
            require(Communities[_communityID].Loans[_loanID].Loan_Info.Payments_Started == false, "Payments have already started.");
            require(Communities[_communityID].Loans[_loanID].Loan_Info.Next_Payment_Unix >= now + 2592000, "It's too late to fund more.");  // time-change-here [2592000 --> 3600 --> 300]
            require(Communities[_communityID].Loans[_loanID].Loan_Status == Status_Request.Active, "It's not allowed to fund more.");

            // Update payment information and transfer funding.
            Communities[_communityID].Loans[_loanID].Loan_Info.Principal_Owed += _amount;
            Communities[_communityID].Loans[_loanID].Notional_Supplied += _amount;
            uint _currentlyOwedPrincipal = Communities[_communityID].Loans[_loanID].Loan_Info.Principal_Owed.div(Communities[_communityID].Loans[_loanID].Monthly_Payments);
            uint _currentlyOwedInterestPartOne = Communities[_communityID].Loans[_loanID].APR_Offered.mul(Communities[_communityID].Loans[_loanID].Loan_Info.Principal_Owed);
            uint _daysInterest = Communities[_communityID].Loans[_loanID].Loan_Info.Next_Payment_Unix.sub(now).div(86400); // time-change-here [86400 --> 120 --> 10]
            uint _currentlyOwedInterestPartTwo = _currentlyOwedInterestPartOne.div(10000).mul(_daysInterest).div(365);
            Communities[_communityID].Loans[_loanID].Loan_Info.Amount_Owed_Next_Payment = _currentlyOwedInterestPartTwo.add(_currentlyOwedPrincipal);
            uint _fee = Communities[_communityID].Loans[_loanID].Fee;
            require(ERC20(_asset).transferFrom(msg.sender, Communities[_communityID].Loans[_loanID].Borrower, _amount.mul(1000 - _fee).div(1000)), "Caller lacks funds, or contract lacks approval to transfer funding.");
            require(ERC20(_asset).transferFrom(msg.sender, Admin, _amount.mul(_fee).div(1000)), "Caller lacks funds, or contract lacks approval to transfer funding.");

            // Update lender information within loan for receiving future payments.
            if (Communities[_communityID].Loans[_loanID].Active_Lender[msg.sender] == true) {
                Communities[_communityID].Loans[_loanID].Lenders[Communities[_communityID].Loans[_loanID].Active_Lender_Spot[msg.sender]].Amount_Lent += _amount;
            }
            else {
                Communities[_communityID].Loans[_loanID].Active_Lender[msg.sender] = true;
                Lender_Info memory _tempLenderInfo = Lender_Info(msg.sender, _amount);
                Communities[_communityID].Loans[_loanID].Lenders[Communities[_communityID].Loans[_loanID].Lenders_Count] = _tempLenderInfo;
                Communities[_communityID].Loans[_loanID].Active_Lender_Spot[msg.sender] = Communities[_communityID].Loans[_loanID].Lenders_Count;
                Communities[_communityID].Loans[_loanID].Lenders_Count++;
            }
            if (Communities[_communityID].Loans[_loanID].Notional_Supplied == Communities[_communityID].Loans[_loanID].Notional_Requested) {
                Communities[_communityID].Loans[_loanID].Loan_Status = Status_Request.Active_Filled;
                Communities[_communityID].Loans[_loanID].Loan_Info.Payments_Started = true;

            }
            address _borrower = Communities[_communityID].Loans[_loanID].Borrower;
            emit loanFunded(_communityID, _loanID, _amount, _asset, msg.sender, _borrower);
        }

        function makeMonthlyPayment(uint _communityID, uint _loanID, address _borrower) public nonReentrant {
            require(Communities[_communityID].Loans[_loanID].Loan_Info.Next_Payment_Unix >= now, "You are past payments for this loan - recalculate.");
            require(Communities[_communityID].Loans[_loanID].Borrower == _borrower, "The provided address doesn't match the borrower.");
            address _asset = Communities[_communityID].Loans[_loanID].Asset_Requested;
            if (msg.sender != _borrower) {
                require(Communities[_communityID].Loans[_loanID].Loan_Info.Next_Payment_Unix - 86400 < now, "You are past payments for this loan - recalculate.");
                require(ERC20(_asset).transferFrom(_borrower, Admin, Permitted_Underlying_Asset_Precisions[_asset].div(2)));
            }
            require(Communities[_communityID].Loans[_loanID].Monthly_Payments > 0, "This loan has already been repaid.");

            // Transfer payment into contract
            uint _amountOwed = Communities[_communityID].Loans[_loanID].Loan_Info.Amount_Owed_Next_Payment;
            uint _fee = Communities[_communityID].Loans[_loanID].Fee;
            require(ERC20(_asset).transferFrom(_borrower, address(this), _amountOwed), "Caller lacks funds, or contract lacks approval to transfer funding.");

            // Distribute payment accordingly via increasing draw allowance.
            for (uint i=0; i < Communities[_communityID].Loans[_loanID].Lenders_Count; i++) {
                address _lender = Communities[_communityID].Loans[_loanID].Lenders[i].Lender;
                uint _individualAmountLent = Communities[_communityID].Loans[_loanID].Lenders[i].Amount_Lent;
                uint _totalAmountLent = Communities[_communityID].Loans[_loanID].Notional_Supplied;
                uint _individualPercentageExposure = _individualAmountLent.mul(100).div(_totalAmountLent);
                uint _individualAmountOwed = _individualPercentageExposure.mul(_amountOwed).div(100);

                Communities[_communityID].Draw_Allowance[_asset][_lender] += _individualAmountOwed.mul(1000 - _fee).div(1000);
                Communities[_communityID].Draw_Allowance[_asset][Admin] += _individualAmountOwed.mul(_fee).div(1000);
            }

            if (Communities[_communityID].Loans[_loanID].Loan_Info.Payments_Started == false) {
                Communities[_communityID].Loans[_loanID].Loan_Info.Payments_Started = true;
                Communities[_communityID].Loans[_loanID].Loan_Status = Status_Request.Active_Halted;
                // Transfer back any additional liquidity deposited for loan not required.
                if (Communities[_communityID].Loans[_loanID].Notional_Supplied < Communities[_communityID].Loans[_loanID].Notional_Requested) {
                    uint _amountTransferredIn = Communities[_communityID].Loans[_loanID].Notional_Requested.mul(Communities[_communityID].Loans[_loanID].Collateralization_Percentage_Required).div(100);
                    uint _percentageToSendBack = Communities[_communityID].Loans[_loanID].Notional_Supplied.mul(100).div(Communities[_communityID].Loans[_loanID].Notional_Requested);
                    uint _amountToSendBack = _amountTransferredIn.mul(_percentageToSendBack).div(100);
                    require(ERC20(Communities[_communityID].Loans[_loanID].Asset_Requested).transfer(_borrower, _amountToSendBack));
                }
            }

            // Decrement monthly payments.
            Communities[_communityID].Loans[_loanID].Monthly_Payments--;

            // Calculate next payment, or close loans if monthly payments remaining is 0.
            if (Communities[_communityID].Loans[_loanID].Monthly_Payments > 0) {
                // Lower principal paid above.
                uint _principalPaid = Communities[_communityID].Loans[_loanID].Loan_Info.Principal_Owed.div(Communities[_communityID].Loans[_loanID].Monthly_Payments.add(1));
                Communities[_communityID].Loans[_loanID].Loan_Info.Principal_Owed = Communities[_communityID].Loans[_loanID].Loan_Info.Principal_Owed.sub(_principalPaid);

                // Calculations for next payment ...
                uint _principalOwedPartial = Communities[_communityID].Loans[_loanID].Loan_Info.Principal_Owed.div(Communities[_communityID].Loans[_loanID].Monthly_Payments);
                uint _aprOffered = Communities[_communityID].Loans[_loanID].APR_Offered;
                uint _princpalOwedTotal = Communities[_communityID].Loans[_loanID].Loan_Info.Principal_Owed;
                uint _interestOwed = _aprOffered.mul(_princpalOwedTotal).div(10000).mul(30).div(365);

                Communities[_communityID].Loans[_loanID].Loan_Info.Amount_Owed_Next_Payment = _principalOwedPartial.add(_interestOwed);
                Communities[_communityID].Loans[_loanID].Loan_Info.Next_Payment_Unix += 2592000; // time-change-here [2592000 --> 3600 --> 300]
            }
            else if (Communities[_communityID].Loans[_loanID].Loan_Info.Payments_Missed < 3) {
                Communities[_communityID].Loans[_loanID].Loan_Status = Status_Request.Paid;
                Communities[_communityID].Loans[_loanID].Loan_Info.Principal_Owed = 0;
                Communities[_communityID].Loans[_loanID].Loan_Info.Amount_Owed_Next_Payment = 0;
                Communities[_communityID].Loans[_loanID].Loan_Info.Next_Payment_Unix = 0;
                // TODO: Return the borrower's initial deposit back (if any).
                uint _amountTransferredIn = Communities[_communityID].Loans[_loanID].Notional_Requested.mul(Communities[_communityID].Loans[_loanID].Collateralization_Percentage_Required).div(100);
                uint _percentageToReturn = Communities[_communityID].Loans[_loanID].Notional_Supplied.mul(100).div(Communities[_communityID].Loans[_loanID].Notional_Requested);
                uint _amountToReturn = _amountTransferredIn.mul(_percentageToReturn).div(100);
                if (_amountToReturn > 0) {
                   require(ERC20(Communities[_communityID].Loans[_loanID].Asset_Requested).transfer(_borrower, _amountToReturn));
                }
            }

            emit paymentMade(_communityID, _loanID, _amountOwed, Communities[_communityID].Loans[_loanID].Asset_Requested, Communities[_communityID].Loans[_loanID].Borrower);
        }

        function makeFullPayment(uint _communityID, uint _loanID) public nonReentrant {
            require(Communities[_communityID].Loans[_loanID].Borrower == msg.sender, "You don't owe payments for this loan.");
            require(Communities[_communityID].Loans[_loanID].Loan_Info.Next_Payment_Unix >= now, "You are past payments for this loan - recalculate.");

            // Transfer payment into contract
            address _asset = Communities[_communityID].Loans[_loanID].Asset_Requested;
            uint _fee = Communities[_communityID].Loans[_loanID].Fee;
            uint _principalOwed = Communities[_communityID].Loans[_loanID].Loan_Info.Principal_Owed;
            uint _aprOffered = Communities[_communityID].Loans[_loanID].APR_Offered;
            uint _currentlyOwedInterest = _aprOffered.mul(_principalOwed).div(10000).mul(30).div(365);
            require(ERC20(_asset).transferFrom(msg.sender, address(this), _principalOwed.add(_currentlyOwedInterest)), "Caller lacks funds, or contract lacks approval to transfer funding.");

            // Distribute payment accordingly via increasing draw allowance.
            for (uint i=0; i < Communities[_communityID].Loans[_loanID].Lenders_Count; i++) {
                address _lender = Communities[_communityID].Loans[_loanID].Lenders[i].Lender;
                uint _individualAmountLent = Communities[_communityID].Loans[_loanID].Lenders[i].Amount_Lent;
                uint _individualPercentageExposure = _individualAmountLent.mul(100).div(Communities[_communityID].Loans[_loanID].Notional_Supplied);
                uint _individualAmountOwed = _individualPercentageExposure.mul(_principalOwed.add(_currentlyOwedInterest)).div(100);
                Communities[_communityID].Draw_Allowance[_asset][_lender] += _individualAmountOwed.mul(1000 - _fee).div(1000);
                Communities[_communityID].Draw_Allowance[_asset][Admin] += _individualAmountOwed.mul(_fee).div(1000);
            }

            // Update loan struct variables.
            Communities[_communityID].Loans[_loanID].Loan_Status = Status_Request.Paid;
            Communities[_communityID].Loans[_loanID].Monthly_Payments = 0;
            Communities[_communityID].Loans[_loanID].Loan_Info.Principal_Owed = 0;
            Communities[_communityID].Loans[_loanID].Loan_Info.Amount_Owed_Next_Payment = 0;
            Communities[_communityID].Loans[_loanID].Loan_Info.Next_Payment_Unix = 0;

            // Transfer back deposit.
            if (Communities[_communityID].Loans[_loanID].Loan_Info.Payments_Missed < 3) {
                uint _amountTransferredIn = Communities[_communityID].Loans[_loanID].Notional_Requested.mul(Communities[_communityID].Loans[_loanID].Collateralization_Percentage_Required).div(100);
                uint _percentageToReturn = Communities[_communityID].Loans[_loanID].Notional_Supplied.mul(100).div(Communities[_communityID].Loans[_loanID].Notional_Requested);
                uint _amountToReturn = _amountTransferredIn.mul(_percentageToReturn).div(100);
                if (_amountToReturn > 0) {
                   require(ERC20(_asset).transfer(msg.sender, _amountToReturn));
                }
            }

            emit paymentMade(_communityID, _loanID, _principalOwed.add(_currentlyOwedInterest), _asset, msg.sender);
        }

        function claimLoanDeposit(uint _communityID, uint _loanID) public nonReentrant {
            require(Communities[_communityID].Loans[_loanID].Loan_Info.Payments_Missed >= 3, "Can't claim this deposit, not enough payments missed (3).");
            require(Communities[_communityID].Loans[_loanID].Active_Lender[msg.sender] == true, "You're not an active lender.");
            require(Communities[_communityID].Loans[_loanID].Deposit_Claimed[msg.sender] == false, "You have already claimed the deposit.");
            Communities[_communityID].Loans[_loanID].Deposit_Claimed[msg.sender] = true;
            uint _notionalSupplied = Communities[_communityID].Loans[_loanID].Notional_Supplied;
            uint _lendersSpot = Communities[_communityID].Loans[_loanID].Active_Lender_Spot[msg.sender];
            uint _amountSupplied = Communities[_communityID].Loans[_loanID].Lenders[_lendersSpot].Amount_Lent;
            uint _percentageToClaim = _amountSupplied.mul(100).div(_notionalSupplied);
            uint _amountTransferredIn = Communities[_communityID].Loans[_loanID].Notional_Supplied.mul(Communities[_communityID].Loans[_loanID].Collateralization_Percentage_Required).div(100);
            require(ERC20(Communities[_communityID].Loans[_loanID].Asset_Requested).transfer(msg.sender, _amountTransferredIn.mul(_percentageToClaim).div(100)));
        }

        function rollMonthlyPayment(uint _communityID, uint _loanID) public nonReentrant {
            require(Communities[_communityID].Loans[_loanID].Loan_Info.Next_Payment_Unix < now, "This payment date has not passed yet.");
            uint _currentlyOwed = Communities[_communityID].Loans[_loanID].Loan_Info.Amount_Owed_Next_Payment;
            uint _extraInterest = Communities[_communityID].Loans[_loanID].APR_Offered.mul(Communities[_communityID].Loans[_loanID].Loan_Info.Principal_Owed).div(10000).mul(30).div(365);
            Communities[_communityID].Loans[_loanID].Loan_Info.Amount_Owed_Next_Payment = _currentlyOwed.add(_extraInterest);
            Communities[_communityID].Loans[_loanID].Loan_Info.Principal_Owed += _extraInterest;
            Communities[_communityID].Loans[_loanID].Loan_Info.Next_Payment_Unix += 2592000; //time-change-here [2592000 --> 3600 --> 300]
            Communities[_communityID].Loans[_loanID].Loan_Info.Payments_Missed++;
        }

        function withdrawAllowance(uint _communityID, address _asset) public nonReentrant {
            require(ERC20(_asset).transfer(msg.sender, Communities[_communityID].Draw_Allowance[_asset][msg.sender]), "Transfer unsuccessful, critical error.");
            Communities[_communityID].Draw_Allowance[_asset][msg.sender] = 0;
        }

        function loanStatus(uint _communityID, uint _loanID) public view returns(Status_Request, bool, bool, bool) {
            return (
                Communities[_communityID].Loans[_loanID].Loan_Status,
                Communities[_communityID].Loans[_loanID].Deposit_Claimed[msg.sender],
                Communities[_communityID].Loans[_loanID].Active_Lender[msg.sender],
                Communities[_communityID].Permitted_Lenders[msg.sender]
            );
        }

        function loanInformation(uint _communityID, uint _loanID) public view returns(uint, uint,uint, uint, uint, uint) {
            uint _paymentsRemaining = Communities[_communityID].Loans[_loanID].Monthly_Payments;
            uint _supplied = Communities[_communityID].Loans[_loanID].Notional_Supplied;
            uint _principalOwed = Communities[_communityID].Loans[_loanID].Loan_Info.Principal_Owed;
            uint _nextPaymentUnix = Communities[_communityID].Loans[_loanID].Loan_Info.Next_Payment_Unix;
            uint _amountOwedNext = Communities[_communityID].Loans[_loanID].Loan_Info.Amount_Owed_Next_Payment;
            uint _paymentsMissed = Communities[_communityID].Loans[_loanID].Loan_Info.Payments_Missed;
            return (_paymentsRemaining, _supplied, _principalOwed, _nextPaymentUnix, _amountOwedNext, _paymentsMissed);
        }

        function allowanceView(uint _communityID, address _lender) public view returns(uint, uint) {
            uint _daiAllowance = Communities[_communityID].Draw_Allowance[0x6B175474E89094C44Da98b954EedeAC495271d0F][_lender];
            uint _usdcAllowance = Communities[_communityID].Draw_Allowance[0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48][_lender];
            return (_daiAllowance, _usdcAllowance);
        }

        function allowanceView(uint _communityID, address _lender, address _asset) public view returns(uint) {
            uint _allowance = Communities[_communityID].Draw_Allowance[_asset][_lender];
            return _allowance;
        }
    }

    contract ERC20 {
        function totalSupply() public view returns (uint);
        function balanceOf(address tokenOwner) public view returns (uint balance);
        function allowance(address tokenOwner, address spender) public view returns (uint remaining);
        function transfer(address to, uint tokens) public returns (bool success);
        function approve(address spender, uint tokens) public returns (bool success);
        function transferFrom(address from, address to, uint tokens) public returns (bool success);
    }