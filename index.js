const board = document.getElementsByClassName("board")[0]
const flag = document.getElementById('flag')

const time = document.getElementsByClassName('time')

const mineslocation = []
let total_mines 
let gameOver = false
let flag_enabled = false
let tilesClicked = 0

let hour = 0,min = 0, sec = 0

function timer() {

    const times = setInterval(()=>{

        if(gameOver) clearInterval(times)

        sec++
        if(min < 60) {
            if(sec >= 60) {
                min++
                sec = 0
            }

            time[1].innerText = min
            time[2].innerText = sec
        }
        if(min >= 60) {
            hour++
            time[0].innerText = hour
            min = 0
        }
    },1000)

}


function totalBombs(bombs) {
    total_mines = bombs
    const welcome = document.getElementsByClassName('welcome-modal')[0]
    welcome.style.display = 'none'
    document.getElementById('bomb-total').innerText = total_mines
    timer()
    startGame()
}


const colors = ['','blue','green','purple','orange','pink']


function setClick (e) {
    if (e.target.classList.contains('clicked') || gameOver) return

    if(!flag_enabled) {
        if(e.target.innerText === '🏴') return
    }

    if(flag_enabled) {
        if(e.target.innerText === '🏴') {
            e.target.innerText = ''
            return
        }
        e.target.innerText = '🏴'

        return
    }

    if(mineslocation.includes(e.target.id)) {
        const lose = document.getElementsByClassName('lose')[0]
        lose.style.display = 'block'
        const gameover = document.getElementsByClassName('gameover')[0]
        gameover.style.display = 'block'
        console.log(gameover)
        revealBomb()
        gameOver = true

        return
    }

    let id = e.target.id.split('-')
    checkMine(parseInt(id[0]),parseInt(id[1]))

}



flag.onclick = (e)=> {

    if(e.target.className === 'flag-false') {
        document.getElementById('flag').className = 'flag-true'
        flag_enabled = true

        return
    }
    document.getElementById('flag').className = 'flag-false'
    flag_enabled = false
}



function checkMine (row,col) {


    if(row < 0 || row >= 10 || col < 0 || col >= 10)    return

    if(document.getElementById(`${row}-${col}`).className === 'clicked')    return
    document.getElementById(`${row}-${col}`).className = 'clicked'
    tilesClicked+=1


    let mines = 0

    checkTile(row,col)


     //top 3
     mines += checkTile(row-1, col-1);      //top left
     mines += checkTile(row-1, col);        //top 
     mines += checkTile(row-1, col+1);      //top right
 
     //left and right
     mines += checkTile(row, col-1);        //left
     mines += checkTile(row, col+1);        //right
 
     //bottom 3
     mines += checkTile(row+1, col-1);      //bottom left
     mines += checkTile(row+1, col);        //bottom 
     mines += checkTile(row+1, col+1);      //bottom right


     if(mines > 0) {
        const tile = document.getElementById(`${row}-${col}`)
        tile.innerText = mines
        tile.style.color = colors[mines]
     }  else {

        checkMine(row-1, col-1);      //top left
        checkMine(row-1, col);        //top 
        checkMine(row-1, col+1);      //top right
    
        //left and right
        checkMine(row, col-1);        //left
        checkMine(row, col+1);        //right
    
        //bottom 3
        checkMine(row+1, col-1);      //bottom left
        checkMine(row+1, col);        //bottom 
        checkMine(row+1, col+1);      //bottom right

     }


     if(tilesClicked === ((10*10)-total_mines)) {
         gameOver = true
         document.getElementsByClassName('win')[0].stye.display = 'block'
         document.getElementsByClassName('gameover')[0].style.display = 'block'

         return
     }


}


function checkTile(row,col) {
    if(row < 0 || row >= 10 || col < 0 || col >= 10)    return 0
    if(mineslocation.includes(`${row}-${col}`)) return 1

    return 0
}

function revealBomb() {
    mineslocation.forEach(bomb=> {
        document.getElementById(bomb).innerText = '💣'
    })
}

function setBomb () {

    let mines = total_mines
    while(mines > 0) {

        let a = Math.floor(Math.random() * 10)
        let b = Math.floor(Math.random() * 10)
        let id = `${a}-${b}`
        if(!mineslocation.includes(id)) {
            mineslocation.push(id)
            mines -= 1
        } 

    }

}

function startGame () {


    for(let i =0; i<10; i++) {
        let row = []
        for(let j =0; j<10; j++) {
            const div = document.createElement('div')
            const id = `${i}-${j}`
            row.push(id)
            div.setAttribute('id',id)
            div.onclick = setClick
            board.appendChild(div)
        }
    }
    setBomb()


}










