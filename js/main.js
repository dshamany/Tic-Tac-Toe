console.log('Running!');

/* ---- constants ---- */
const BOARD_SIZE = 3;
const ATTEMPTS_LIMIT = BOARD_SIZE * BOARD_SIZE;
let attempt_count = 0;

/* --- variables (app's state) ---- */
let turn, board, message, player;

/* ---- cached elements ---- */
let grid  = document.querySelector('.grid-container');
let reset = document.getElementById('btnReset');
let cells = document.querySelectorAll('.grid-container div');
let h3    = document.querySelector('h3');

/* ---- event listeners ---- */
reset.addEventListener('click', init);
grid.addEventListener('click', handleClick);

/* ---- functions ---- */
init();

function init() {
    // Randomly select Player
    turn = generateRandom();

    // Winner is neutral
    winner = 0;

    // Attempts made
    attempt_count = 0;

    // Reset Board
    clearCLIBoard();
    clearGUIBoard();

    // Remove Message
    message = '';

    render();
}

function generateRandom(){
    let random = Math.floor(Math.random() * 2);
    return random ? 1 : -1;
}

function switchTurn(){
    return turn < 0 ? 1 : -1;

}

function convertToChar(num){
    if (num < 0)
        return 'X';
    else if (num > 0)
        return 'O';
    else
        return '';
}

function clearGUIBoard(){
    cells.forEach((e)=>{
        e.innerHTML = '';
        e.className = 'cell';
        e.disabled = false;
    });
}

function clearCLIBoard(){
    board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
}

function handleClick(evt){
    // disable if there's a winner
    if (message != '') return;

    if (evt.target.className === 'cell'){

        let evtId  = evt.target.id;
        let column = evtId[1];
        let row    = evtId[3];
        cells.forEach((e) => {
            if (evtId === e.id){
                board[column][row] = turn;
                e.className = 'disabledCell';
            }
        });
        ++attempt_count;
        turn = switchTurn();
    }

    // Print the board
    render();
}

function render(){
    for (let row = 0; row < BOARD_SIZE; ++row){
        for (let column = 0; column < BOARD_SIZE; ++column){
            let cell = document.querySelector("#r" + row + "c" + column);
            cell.innerHTML = convertToChar(boardPosition(row, column));
        }
    }

    setPlayer();
    gameOver();
    setMessage(message);
}

// To simplify input
function boardPosition(row, column){
    return board[row][column];
}

function setPlayer(){
    player = 'PLAYER: ' + convertToChar(turn);
}

function setMessage(msg){
    h3.textContent = message === '' ? `${player}` : message;
}

function checkRowWinner(){
    for (let row = 0; row < BOARD_SIZE; ++row){
        let sum = 0;
        for (let column = 0; column < BOARD_SIZE; ++column){
            sum += boardPosition(row, column);
        }
        if (Math.abs(sum) === BOARD_SIZE){
            message = player + " Wins!";
            console.log(message);
            return;
        }
    }
}

function checkColumnWinner(){
    for (let column = 0; column < BOARD_SIZE; ++column){
        let sum = 0;
        for (let row = 0; row < BOARD_SIZE; ++row){
            sum += boardPosition(row, column);
        }
        if (Math.abs(sum) === BOARD_SIZE){
            message = player + " Wins!";
            console.log(message);
            return;
        }
    }
}

function checkDiagonalWinner(){
    let downSum = 0;
    let upSum   = 0;

    // Calculates down diagonal
    for (let column = 0, row = 0; column < BOARD_SIZE; ++column, ++row){
        downSum += boardPosition(row, column);
    }

    // Calculates up diagonal
    for (let column = BOARD_SIZE-1, row = 0; row < BOARD_SIZE; --column, ++row){
        upSum += boardPosition(row, column);
    }

    if (Math.abs(upSum) === BOARD_SIZE){
        message = player + " Wins!";
        console.log(message);
        return;
    } else if (Math.abs(downSum) === BOARD_SIZE){
        message = player + " Wins!";
        console.log(message);
        return;
    }
}

function checkTie(){
    if (attempt_count === ATTEMPTS_LIMIT && message === ''){
        message = 'It\'s a tie (not a cravat?)';
        console.log(message);
    }
}

function gameOver(){
    checkRowWinner();
    checkColumnWinner();
    checkDiagonalWinner();
    checkTie();
}