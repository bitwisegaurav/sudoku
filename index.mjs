import sudokuGrid from "./sudoku.mjs";
const sudoku = document.getElementById('sudoku');
const tds = document.querySelectorAll('td');
const trs = sudoku.getElementsByTagName('tr');
const btns = document.querySelectorAll('button');
const remain = document.querySelectorAll('.remain');
const reset = document.getElementById('reset');
const validatebtn = document.getElementById('validate');
const nextbtn = document.getElementById('next');
const timer = document.getElementById('timer');
let validate = false;
let selectedValue = 0, time = 0, flag = false, won = false;
let defaultPuzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];
let solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];
let puzzle = [];
let count = [9,9,9,9,9,9,9,9,9];

getSudoku();

// function to replace random elements with 0 from sudokuGrid
function getSudoku(){
    let min = 30;
    let max = 50;
    let noOfUnfilledCells = Math.floor(Math.random() * max) + min;
    let count = 0;
    if(sudokuGrid && sudokuGrid.length > 0){
        solution = sudokuGrid;
        while(count < noOfUnfilledCells){
            let randomRow = Math.floor(Math.random() * 9);
            let randomCol = Math.floor(Math.random() * 9);
            if(sudokuGrid[randomRow][randomCol] !== 0){
                sudokuGrid[randomRow][randomCol] = 0;
                count++;
            }
        }
        puzzle = sudokuGrid;
    }

    getData();
}

function checkCorrectness(row, col, value){
    if(!puzzle[row][col])
            puzzle[row][col] = 0;
    if(checkBox(row, col, value) && checkRow(row, col, value) && checkCol(row, col, value)){
        return true;
    }
    return false;
}

function checkBox(row, col, value) {
    let startRow = row - (row % 3);
    let endRow = startRow + 2;
    let startCol = col - (col % 3);
    let endCol = startCol + 2;
    
    for (let i = startRow; i <= endRow; i++) {
        for (let j = startCol; j <= endCol; j++) {
            const element = puzzle[i][j];
            if (element === value && (i !== row || j !== col)) {
                return false;
            }
        }
    }
    return true;
}

function checkRow(row, col, value) {
    for (let i = 0; i < 9; i++) {
        const element = puzzle[row][i];
        if (element === value && i !== col) {
            return false;
        }
    }
    return true;
}

function checkCol(row, col, value) {
    for (let i = 0; i < 9; i++) {
        const element = puzzle[i][col];
        if (element === value && i !== row) {
            return false;
        }
    }
    return true;
}

function getData() {
    if(puzzle.length === 0)
        puzzle = defaultPuzzle;

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            tds[i * 9 + j].setAttribute('value', i * 9 + j);
            if (puzzle[i][j] != 0){
                tds[i * 9 + j].innerHTML = puzzle[i][j];
                tds[i * 9 + j].classList.add('fixed');
                count[puzzle[i][j] - 1]--;
            }
            else{
                tds[i * 9 + j].innerHTML = '';
                tds[i * 9 + j].classList.remove('fixed');
            }
        }
    }
    for (let i = 0; i < 9; i++) {
        if(count[i] == 0)
            remain[i].innerHTML = '';
        else
            remain[i].innerHTML = count[i];
    }
}

Array.from(tds).forEach((td) => {
    td.addEventListener('click', () => {
        validate = false;
        tds.forEach((td) => {
            td.classList.remove('wrong');
        });
        let value = td.innerText;
        value = parseInt(value);
        // console.log(selectedValue, value);
        // console.log(btns);
        // console.log(typeof(selectedValue), typeof(value));
        if(td.innerText == '' && selectedValue != 0 && count[selectedValue - 1] > 0) {
            let index = td.getAttribute('value');
            td.innerText = selectedValue;
            if(count[selectedValue - 1] > 0) {
                count[selectedValue - 1]--;
                if(count[selectedValue - 1] == 0) {
                    remain[selectedValue - 1].innerHTML = '';
                    
                }
                else
                    remain[selectedValue - 1].innerHTML = count[selectedValue - 1];
            }
            td.classList.add('blue');
            index = parseInt(index);
            let row = Math.floor(index / 9);
            let col = index % 9;
            puzzle[row][col] = selectedValue;
            if(flag === false && won === false) {
                flag = true;
                startTimer();
            }
        }
        else if(td.innerText != '' && td.classList.contains('fixed')){
            if(flag === false && won === false) {
                flag = true;
                startTimer();
            }
            if(value != selectedValue) {
                selectedValue = td.innerText;
                selectedValue = parseInt(selectedValue);
                findNumbers();
                clickBtn();
            }
            else {
                selectedValue = 0;
                // console.log(selectedValue);
                findNumbers();
                clickBtn();
            }
        }
        else if(td.innerText != '' && td.classList.contains('fixed') == false){
            if(flag === false && won === false) {
                flag = true;
                startTimer();
            }
            if(value != selectedValue && selectedValue != 0 && count[selectedValue - 1] > 0) {
                let index = td.getAttribute('value');
                index = parseInt(index);
                let row = Math.floor(index / 9);
                let col = index % 9;
                count[puzzle[row][col] - 1]++;
                remain[puzzle[row][col] - 1].innerHTML = count[puzzle[row][col] - 1];
                puzzle[row][col] = selectedValue;
                td.innerText = selectedValue;
                if(count[selectedValue - 1] > 0) {
                    count[selectedValue - 1]--;
                    if(count[selectedValue - 1] == 0) {
                        remain[selectedValue - 1].innerHTML = '';
                    }
                    else
                        remain[selectedValue - 1].innerHTML = count[selectedValue - 1];
                }
                td.classList.add('blue');
            }
            else if(value != selectedValue && selectedValue == 0) {
                selectedValue = td.innerText;
                selectedValue = parseInt(selectedValue);
                findNumbers();
                clickBtn();
            }

            else {
                selectedValue = 0;
                // remove the element from the puzzle if it is already selected
                if(td.classList.contains('blue')){
                    let index = td.getAttribute('value');
                    index = parseInt(index);
                    let row = Math.floor(index / 9);
                    let col = index % 9;
                    count[puzzle[row][col] - 1]++;
                    remain[puzzle[row][col] - 1].innerHTML = count[puzzle[row][col] - 1];
                    puzzle[row][col] = 0;
                    td.innerText = '';
                }
                // console.log(selectedValue);
                findNumbers();
                clickBtn();
            }
        }
        if(checkPuzzle()){
            flag = false;
            won = true;
            timer.innerHTML = 'You Won! in ' + timer.innerHTML;
        }
    });
});

Array.from(btns).forEach((btn) => {
    btn.addEventListener('click', () => {
        validate = false;
        tds.forEach((td) => {
            td.classList.remove('wrong');
        });
        if(flag == false) {
            flag = true;
            startTimer();
        }
        let value = btn.getAttribute('value');
        value = parseInt(value);
        // console.log(selectedValue, value);
        if(value != selectedValue) {
            selectedValue = value;
            let clickedElements = document.getElementsByClassName('clicked');
            for (let i = 0; i < clickedElements.length; i++) {
                clickedElements[i].classList.remove('clicked');
            }
            btn.classList.add('clicked');
            findNumbers();
        }
        else if(selectedValue != 0 && value == selectedValue) {
            selectedValue = 0;
            let clickedElements = document.getElementsByClassName('clicked');
            for (let i = 0; i < clickedElements.length; i++) {
                clickedElements[i].classList.remove('clicked');
            }
            findNumbers();
        }

    });
});

function clickBtn(){
    // clicked the selectedvalue button
    btns.forEach((btn) => {
        let value = btn.getAttribute('value');
        value = parseInt(value);
        if(value == selectedValue && selectedValue != 0) {
            btn.classList.add('clicked');
        }
        else {
            btn.classList.remove('clicked');
        }
    });
}

function findNumbers() {
    tds.forEach((td) => {
        if(td.innerText == selectedValue && selectedValue != 0) {
            td.classList.add('blue');
        }
        else{
            td.classList.remove('blue');
        }
    });
}

// a function to start the timer
function startTimer() {
    time++;
    let min = Math.floor(time / 60);
    let sec = time % 60;
    if(min < 10) {
        min = '0' + min;
    }
    if(sec < 10) {
        sec = '0' + sec;
    }
    if(flag && !won) {
        if(min > 0)
            timer.innerHTML = `${min}m ${sec}s`;
        else
            timer.innerHTML = `${sec}s`;
        setTimeout(startTimer, 1000);
    }
}

// function to check if the puzzle is solved or not
function checkPuzzle() {
    let correct = true;
    // check if count array include any number greater than 0
    for (let i = 0; i < 9; i++) {
        if(count[i] > 0) {
            correct = false;
            break;
        }
    } 
    if(correct) {
        // check that all elements are correct or not
        for (let i = 0; i < 9; i++) {
            const element = puzzle[i];
            for (let j = 0; j < 9; j++) {
                if(!checkCorrectness(i, j, element[j])) {
                    correct = false;
                    break;
                }
            }
            if(correct == false) {
                break;
            }
        }
    }
    else {
        return false;
    }
    return correct;
}

function countNumbers(){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(puzzle[i][j] != 0){
                count[puzzle[i][j] - 1]--;
            }
        }
    }
}

// reset the data
function resetData(){
    tds.forEach((td) => {
        if(td.classList.contains('fixed') == false){
            let index = td.getAttribute('value');
            index = parseInt(index);
            let row = Math.floor(index / 9);
            let col = index % 9;
            puzzle[row][col] = 0;
            td.innerText = '';
        }
    });
}

function resetRemain(){
    for(let i = 0; i < 9; i++){
        remain[i].innerHTML = count[i];
    }
}

reset.addEventListener('click', () => {
    validate = false, selectedValue = 0, time = 0, flag = false, won = false;
    count = [9,9,9,9,9,9,9,9,9];
    timer.innerHTML = '0s';
    puzzle = sudokuGrid;
    solution = sudokuGrid;
    // getData();
    resetData();
    countNumbers();
    resetRemain();
    clickBtn();
    console.log(puzzle)
    tds.forEach((td) => {
        td.classList.remove('wrong');
        td.classList.remove('blue');
    });
    // focus get on the window without starting the timer
    window.focus();
});

nextbtn.addEventListener('click', () => {
    location.reload();
});

// check which tds having wrong values
validatebtn.addEventListener('click', () => {
    if(!validate) {
        tds.forEach((td) => {
            if(td.classList.contains('fixed') == false){
                let index = td.getAttribute('value');
                index = parseInt(index);
                let row = Math.floor(index / 9);
                let col = index % 9;
                let value = parseInt(td.innerText);
                // if(value)
                //     td.innerText = solution[row][col];
                if(value && value != solution[row][col]) {
                    td.classList.add('wrong');
                }
                else {
                    td.classList.remove('wrong');
                }
            }
        });
    }
    else {
        tds.forEach((td) => {
            td.classList.remove('wrong');
        });
    }
    validate = !validate;
});

// function to generate a sudoku puzzle
// function sudokuGenerator(){
//     // no of filled cells in the puzzle between 10 to 60
//     let noOfUnfilledCells = Math.floor(Math.random() * 40) + 30;
//     for(let i = 0; i < 9; i++){
//         let row = [];
//         for(let j = 0; j < 9; j++){
//             row.push(0);
//         }
//         puzzle.push(row);
//     }
    
//     // put randomly digits in the puzzle at random positions
//     for(let i = 0; i < noOfUnfilledCells; i++){
//         let randomRow = Math.floor(Math.random() * 9);
//         let randomCol = Math.floor(Math.random() * 9);

//         while(puzzle[randomRow][randomCol] !== 0){
//             randomRow = Math.floor(Math.random() * 9);
//             randomCol = Math.floor(Math.random() * 9);
//         }

//         let randomDigit = Math.floor(Math.random() * 9) + 1;
        
//         for(let j = 1; j < 9; j++){
//             if(checkCorrectness(randomRow, randomCol, j)){
//                 randomDigit = j;
//                 break;
//             }
//         }
        
//         // while(!checkCorrectness(randomRow, randomCol, randomDigit)){
//         //     randomDigit = Math.floor(Math.random() * 9) + 1;
//         // }
//         puzzle[randomRow][randomCol] = randomDigit;
//     }    
//     getData();

//     puzzle.forEach(row => console.log(row.join(' ')));
// }

// sudokuGenerator();