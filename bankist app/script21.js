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

// 0. upadate ui

const updateUI = function (acc) {
  displayMovements(acc.movements);
  totalBalance(acc);
  sumarryTotal(acc.movements);
};

//1. dispalying the movements of the balance

// const displayMovements = function (movements) {
//   movements.forEach(function (mov, i) {
//     const type = mov > 0 ? 'deposit' : 'withdrawal';
//     const html = `<div class="movements__row">
//             <div class="movements__type movements__type--${type}"> ${
//       i + 1
//     } ${type}</div>
//             <div class="movements__value"> ${mov} </div>
//           </div>`;
//     containerMovements.insertAdjacentHTML('afterbegin', html);
//   });
// };

const displayMovements = function (movements, sort = false) {
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
            <div class="movements__type movements__type--${type}"> ${
      i + 1
    } ${type}</div>
            <div class="movements__value"> ${mov} </div>
          </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//2. showing summary of balance

const sumarryTotal = function (movements) {
  // const depositSummary= movements.filter(function(mov){
  //   return mov>0;
  const depositSummary = movements
    .filter(mov => mov > 0)
    .reduce((acc, sum) => acc + sum, 0);

  const withdrawlSummary = movements
    .filter(mov => mov < 0)
    .reduce((acc, sum) => acc + sum, 0);

  const interestSummary = movements
    .filter(mov => mov > 0)
    .map(mov => (mov * 1.1) / 100)
    .reduce((acc, sum) => acc + sum, 0);

  console.log(depositSummary);
  console.log(withdrawlSummary);
  console.log(interestSummary);
  labelSumIn.textContent = Number(depositSummary);
  labelSumOut.textContent = Number(Math.abs(withdrawlSummary));
  labelSumInterest.textContent = Number(Math.floor(interestSummary));
};

const totalBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, sum, i, arr) => acc + sum, 0);
  // console.log(sum);
  labelBalance.textContent = ` ${acc.balance} EURO`;
};

// const totalBalance = function (movements) {
//   const sum = movements.reduce((acc, sum, i, arr) => acc + sum, 0);
//   console.log(sum);
//   labelBalance.textContent = ` ${sum} EURO`;
// };

//3. displaying the user Name

const userName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(mov => mov[0])
      .join('');
  });
};
userName(accounts);
console.log(accounts);

//4.Login feature

let userAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('Login');
  userAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
  // console.log(userAccount);
  
  if (userAccount?.pin === Number(inputLoginPin.value)) {
    console.log('Again login');
    labelWelcome.textContent = `Welcome ${userAccount.owner}`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = ' ';

    
    // need toblue the login credentail label while inside the account
    //  inputLoginUsername.blur();
  }
  inputLoginPin.blur();
  
  updateUI(userAccount);
  
  
});

// 5. transfer Money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log("transfer");
  const amtTransfer = Number(inputTransferAmount.value);
  const receiverPerson = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  console.log(amtTransfer, receiverPerson);
  if (
    amtTransfer > 0 &&
    receiverPerson &&
    receiverPerson.userName !== userAccount.userName &&
    amtTransfer <= userAccount.balance
  ) {
    console.log('valid');
    userAccount.movements.push(-amtTransfer);
    receiverPerson.movements.push(+amtTransfer);
    updateUI(userAccount);
  }
});

// 6. request loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('clicked');
  const loanAmt = Number(inputLoanAmount.value);
  if (loanAmt > 0) {
    userAccount.movements.push(+loanAmt);
  }
});

//7. close account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('clicked');
  console.log(userAccount);
  if (
    inputCloseUsername.value === userAccount.userName &&
    Number(inputClosePin.value) === userAccount.pin
  ) {
    console.log(userAccount.userName, userAccount.pin);
    const index = accounts.findIndex(
      acc => acc.userName === userAccount.userName
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

// 8. Sorting

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('clicked');
  displayMovements(userAccount.movements, true);  
});

// const points = [40, 100, 1, 5, 25, 10];
// points.sort(function (a, b) {
//   return a - b;
// });
// })

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

////////////////////////////////////////////////

// 1. slice method and splice mathod
// const arr= ["a","b","c","d"];
// console.log(arr.slice());
// console.log(arr.splice());

// // console.log(arr.splice(0,2));
// const [...abc]=arr;
// console.log(abc);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// 1. for of
// // for (const mov of movements) {
// for (const [i,mov] of movements.entries()) {

//   if (mov > 0) {
//     console.log(` Movements: ${i+1} you have deposited ${mov}`);
//   } else {
//     console.log(` Movements: ${i+1} you withdrew ${Math.abs(mov)}`);
//   }
// }

// console.log('-----coment-------------------');

// // 2. for of

// movements.forEach(function (mov,i) {
//   if (mov > 0) {
//     console.log(` Movements: ${i + 1} you have deposited ${mov}`);
//   } else {
//     console.log(` Movements: ${i + 1} you withdrew ${Math.abs(mov)}`);
//   }
// });

// Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners
// about their dog's age, and stored the data into an array (one array for each). For
// now, they are just interested in knowing whether a dog is an adult or a puppy.
// A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years
// old.
// Your tasks:
// Create a function 'checkDogs', which accepts 2 arrays of dog's ages
// ('dogsJulia' and 'dogsKate'), and does the following things:
// 1. Julia found out that the owners of the first and the last two dogs actually have
// cats, not dogs! So create a shallow copy of Julia's array, and remove the cat
// ages from that copied array (because it's a bad practice to mutate function
// parameters)
// 2. Create an array with both Julia's (corrected) and Kate's data
// 3. For each remaining dog, log to the console whether it's an adult ("Dog number 1
// is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy
// �
// ")
// 4. Run the function for both test datasets
// Test data:
// § Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// § Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

// const dogsJulia = [3, 5, 2, 12, 7];
// const correctedDogJulia=dogsJulia.slice(1,3);
// console.log("dogsjulia,"  + dogsJulia);
// console.log("corrected dog" + correctedDogJulia);

// const dogsKate = [4, 1, 15, 8, 3];

// const checkDogs= function(julia,kate){
//   const dogs= correctedDogJulia.concat(dogsKate);
//   console.log("dogs" + dogs);
//   dogs.forEach(function(mov,i){
//  if(mov>=3){
//    console.log(`"Dog number ${i+1} is an adult, and is ${mov} years old"`);

//  }else{
//    console.log(`"Dog number ${i + 1} is still a puppy`);

//  }

//   })

// }
// checkDogs(correctedDogJulia,dogsKate);
// // checkDogs(correctedDogJulia, dogsKate);

// Let's go back to Julia and Kate's study about dogs. This time, they want to convert
// dog ages to human ages and calculate the average age of the dogs in their study.
// Your tasks:
// Create a function 'calcAverageHumanAge', which accepts an arrays of dog's
// ages ('ages'), and does the following things in order:
// 1. Calculate the dog age in human years using the following formula: if the dog is
// <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old,
// humanAge = 16 + dogAge * 4
// 2. Exclude all dogs that are less than 18 human years old (which is the same as
// keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs (you should already know
// from other challenges how we calculate averages �)
// 4. Run the function for both test datasets
// Test data:
// // § Data 1: [5, 2, 4, 1, 15, 8, 3]
// // § Data 2: [16, 6, 10, 5, 6, 1, 4]
// const Data1 = [5, 2, 4, 1, 15, 8, 3];
// const Data2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge= function(dogAge){
//   const humanAge= dogAge.map(function(mov){
//     return mov<=2? 2*mov: 16+mov*4;
//   })
//   const filterHumnanAge= humanAge.filter(function(mov){
//     return mov>18;
//   })
//   const reduceAge= filterHumnanAge.reduce(function(acc,sum,i,arr){
//     return acc+sum/(arr.length);
//   },0)
//   console.log(Data1);
//   console.log(humanAge);
//   console.log(filterHumnanAge);
//   console.log(reduceAge);

// };

// calcAverageHumanAge(Data1);
// calcAverageHumanAge(Data2);

// // const calcAverageHumanAge = dogAge => {
//   const HumanAge = dogAge
//     .map(mov => (mov <= 2 ? 2 * mov : 16 + mov * 4))
//     .filter(mov => mov > 18)
//     .reduce((acc, sum, i, arr) => (acc + sum / arr.length),0);
//     console.log(HumanAge)
// };

// calcAverageHumanAge(Data1);
//  calcAverageHumanAge(Data2);

//  const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//  const mapMovements= movements.map(function(mov){
//   return mov*1.1;
// //  })

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const mapMovements = movements.map((mov,i) =>{

//       return ` Movements: ${i + 1} you have ${
//         mov > 0 ? 'depsosited' : 'withdrawal'
//       }  ${Math.abs(mov)}`;

// })

// console.log(mapMovements);

// //  if (mov > 0) {
//  //     console.log(` Movements: ${i + 1} you have deposited ${mov}`);
//   } else {
//     console.log(` Movements: ${i + 1} you withdrew ${Math.abs(mov)}`);
