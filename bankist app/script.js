'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector(' html');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//1. movements of withdrawl and deposit

const displayMovements = function (movements, sort=false) {
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  containerMovements.textContent = '';
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = ` <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>`;
    // console.log(mov, i);

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// 2. display summary

const summary = function (movements) {
  const positiveMove = movements
    .filter(mov => mov > 0)
    .reduce((acc, sum) => acc + sum, 0);

  const negativeMove = movements
    .filter(mov => mov < 0)
    .reduce((acc, sum) => acc + sum, 0);

  const interestMove = movements
    .filter(mov => mov > 0)
    .map(mov => mov * 0.1)
    .reduce((acc, sum) => acc + sum, 0);

  const sumOfMovements = movements.reduce((acc, sum) => acc + sum, 0);

  labelBalance.textContent = Number(sumOfMovements);
  labelSumInterest.textContent = Number(interestMove);
  labelSumOut.textContent = Number(negativeMove);
  labelSumIn.textContent = Number(positiveMove);
};

//3. customer user id in all small and first 2letter of word.
const userCredential = function (accs) {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(mov => mov[0])
      .join('');
  });
};
userCredential(accounts);

let currentAccount;

//4 user Login btnLogin inputLoginUsername inputLoginPin
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  //   console.log('clicked');
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  //   console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    displayMovements(currentAccount.movements);
    summary(currentAccount.movements);
  }
});

// 5. send money

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('clicked');

  const transferTo = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  const amtTransfer = Number(inputTransferAmount.value);

  if (
    transferTo.userName !== currentAccount.userName &&
    amtTransfer > 0
    //need to complete of total balancxe variable ***********************
  ) {
    console.log('plz send');
    currentAccount.movements.push(-amtTransfer);
    transferTo.movements.push(+amtTransfer);
    displayMovements(currentAccount.movements);
    summary(currentAccount.movements);
  }
});

// 6. request Loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('clicked');
  const loanAmt = Number(inputLoanAmount.value);

  // need to do it again******************************************
  if (loanAmt > 0) {
    currentAccount.movements.push(+loanAmt);
    displayMovements(currentAccount.movements);
    summary(currentAccount.movements);
  }
});

// 7.trasnfer Money

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('clicked');

  if (
    currentAccount.userName === inputLoginUsername.value &&
    currentAccount.pin === Number(inputLoginPin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    // console.log("deleting");
    accounts.splice(index, 1);
  }

  containerApp.style.opacity = 0;
});

// 7. sorting

// const displaySorting = function (movements, sort = false) {
//   const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
// };


let sorted =false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('clicked');
  displayMovements(currentAccount.movements, !sorted);
  sorted=!sorted;
});
