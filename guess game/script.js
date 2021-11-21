'use strict';

let score0 = document.querySelector('#score--0');
let score1 = document.querySelector('#score--1');
let dice = document.querySelector('.dice');
let btn_roll = document.querySelector('.btn--roll');
let btn_hold = document.querySelector('.btn--hold');

let randomNo;
let player1 = true;
let player2 = false;
let current = 0;
score0.textContent = 0;
score1.textContent = 0;
dice.classList.add('hidden');
document.querySelector('.player--0').classList.add('player--active');

if ( score0.textContent>10
  
  
  ) {

  document.querySelector('.player--0').classList.add('player--winner');
}else if (score1.textContent> 10) {
  document.querySelector('.player--1').classList.add('player--winner');
}


  btn_hold.addEventListener('click', function holdMainScore() {
    if (player1) {
      score0.textContent = Number(score0.textContent) + current;

      document.querySelector('#current--1').textContent = 0;
      document.querySelector('#current--0').textContent = 0;
      document.querySelector('.player--0').classList.toggle('player--active');
      document.querySelector('.player--1').classList.toggle('player--active');
    } else if (player2) {
      score1.textContent = Number(score1.textContent) + current;

      document.querySelector('#current--1').textContent = 0;
      document.querySelector('#current--0').textContent = 0;
      document.querySelector('.player--0').classList.toggle('player--active');
      document.querySelector('.player--1').classList.toggle('player--active');
    }
    current = 0;
    changeActivePlayer(randomNo);
  });

document.querySelector('.btn--roll').addEventListener('click', function () {
  randomNo = Math.floor(Math.random() * 6 + 1);
  scoreCard();

  if (randomNo === 1) {
    changeActivePlayer(randomNo);
    document.querySelector('#current--1').textContent = 0;
    document.querySelector('#current--0').textContent = 0;
    document.querySelector('.player--0').classList.toggle('player--active');
    document.querySelector('.player--1').classList.toggle('player--active');
  }
  document
    .querySelector('img')
    .setAttribute('src', 'dice-' + randomNo + '.png');
  //   console.log(randomNo);
  dice.classList.remove('hidden');
});

function changeActivePlayer() {
  if (player1) {
    player1 = false;
    player2 = true;
  } else {
    player1 = true;
    player2 = false;
  }
  current = 0;
}

function scoreCard() {
  current = current + randomNo;
  if (player1 && randomNo !== 1) {
    document.querySelector('#current--0').textContent = current;
  } else if (player2 && randomNo !== 1) {
    document.querySelector('#current--1').textContent = current;
  }
}
