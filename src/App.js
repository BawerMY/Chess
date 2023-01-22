import './App.css';
import { useState, useRef } from 'react';

function App() {

  var table = [
    [['rock-white', ''], ['knight-white', ''], ['bishop-white', ''], ['queen-white', ''], ['king-white', ''], ['bishop-white', ''], ['knight-white', ''], ['rock-white', '']],
    [['pawn-white', ''], ['pawn-white', ''], ['pawn-white', ''], ['pawn-white', ''], ['pawn-white', ''], ['pawn-white', ''], ['pawn-white', ''], ['pawn-white', '']],
    [['empty', ''], ['empty', ''], ['empty', ''], ['empty', ''], ['empty', ''], ['empty', ''], ['empty', ''], ['empty', '']],
    [['empty', ''], ['empty', ''], ['empty', ''], ['empty', ''], ['empty', ''], ['empty', ''], ['empty', ''], ['empty', '']],
    [['empty', ''], ['empty', ''], ['empty', ''], ['empty', ''], ['empty', ''], ['empty', ''], ['empty', ''], ['empty', '']],
    [['empty', ''], ['empty', ''], ['empty', ''], ['empty', ''], ['empty', ''], ['empty', ''], ['empty', ''], ['empty', '']],
    [['pawn-black', ''], ['pawn-black', ''], ['pawn-black', ''], ['pawn-black', ''], ['pawn-black', ''], ['pawn-black', ''], ['pawn-black', ''], ['pawn-black', '']],
    [['rock-black'], ['knight-black', ''], ['bishop-black', ''], ['queen-black', ''], ['king-black', ''], ['bishop-black', ''], ['knight-black', ''], ['rock-black', '']],
  ]
  const [tableJsx, setTableJsx] = useState(refresh(table))

  function refresh(t){
    var table = []
    var row = []
    var color = 'green-600'
    for(var i = 0; i <= 7; i++){
      for(var j = 0; j <= 7; j++){
        row.push(<Block key={j+1} color={color} piece={t[i][j][0]} mark={t[i][j][1]} pos={[i, j]} />)
        if(color === 'white') {color = 'green-600'}
        else color = 'white'
      }
      if(color === 'white') {color = 'green-600'}
      else color = 'white'
      table.push(<div key={i+1} className='flex'>{row.map((block) => block)}</div>)
      row = []
    }
    return <div className='flex flex-col-reverse'>{table.map((row) => row)}</div>
  }

  function resetMarks(){
    for(var i = 0; i <= 7; i++){
      for(var j = 0; j <= 7; j++){
        table[i][j] = [table[i][j][0], '']
      }
    }
    return
  }

  function mark(y, x, marker){
    table[y][x].pop()
    table[y][x].push(marker)
  }

function getKing(color) {
  for(var x = 0; x <= 7; x++){
    for(var y = 0; y <= 7; y++){
      if(table[y][x][0] === 'king-' + color) return [y, x]
    }
  }
  return  false
}



function test(table) {
  var checkActions = []
  var king
  king = getKing(playerTurn?'white':'black')
  var checks = []
  for(var x = 0; x <= 7; x++){
    for(var y = 0; y <= 7; y++){
      if(table[y][x][0] === 'empty') continue
      var piece = table[y][x][0]
      var check = [x, y]
      var movePossibleBlocks = []
      var possibleReds = []
      var possibleActions = []
      var returnActions = []
      const directionPlus = [[1, 0, [y, x]], [0, 1, [y, x]], [-1, 0, [y, x]], [0, -1, [y, x]], ]
      const directionX = [[1, 1, [y, x]], [-1, 1, [y, x]], [-1, -1, [y, x]], [1, -1, [y, x]], ]
      const kingActions = [[y+1,x, [y, x]], [y+1,x+1, [y, x]], [y,x+1, [y, x]], [y-1,x+1, [y, x]], [y-1,x, [y, x]], [y-1,x-1, [y, x]], [y,x-1, [y, x]], [y+1,x-1, [y, x]], ]
      const knightActions = [[y+2,x+1, [y, x]], [y+1,x+2, [y, x]], [y-1,x+2, [y, x]], [y-2,x+1, [y, x]], [y-2,x-1, [y, x]], [y-1,x-2, [y, x]], [y+1,x-2, [y, x]], [y+2,x-1, [y, x]], ]
      const loopActions = (actions) => {
          returnActions = []
          for(var i = 0; i < actions.length; i++){//                                   block u sadece 1 kere kullanmak iciin atiyosun gerekmeyebilir
              check = [y, x]
              while(true){
                  check = [check[0]+actions[i][0], check[1]+actions[i][1]]
                  if(!(0 <= check[0] && check[0] < 8) || !(0 <= check[1] && check[1] < 8)) break
                  if(table[check[0]][check[1]][0] === 'empty') returnActions.push([check[0], check[1], [y, x]])
                  else break
              }
              if(!(0 <= check[0] && check[0] < 8) || !(0 <= check[1] && check[1] < 8)) continue
              if(movePossibleBlocks.includes(table[check[0]][check[1]][0])) returnActions.push([check[0], check[1], [y, x]])
          }
          return returnActions
      }
      const pawnActions = (startPosition, step) => {
        movePossibleBlocks = []
        possibleActions = [[y+step, x, [y, x]]]
        if(y === startPosition && table[y+step][x][0] === 'empty' && table[y+step+step][x][0] === 'empty') possibleActions.push([y+step+step, x, [y, x]])
        possibleReds = [[y+step, x+step, [y, x]], [y+step, x-step, [y, x]]]
        return possibleReds
      }
      if(!playerTurn){
          movePossibleBlocks = ['queen-black', 'king-black', 'rock-black', 'bishop-black', 'knight-black', 'pawn-black']
          switch (piece) {
              case 'king-white': checkActions = checkActions.concat(kingActions)
              break
              case 'queen-white': checkActions = checkActions.concat(loopActions(directionPlus.concat(directionX)))
                  break
              case 'rock-white': checkActions = checkActions.concat(loopActions(directionPlus))
                  break  
              case 'knight-white': checkActions = checkActions.concat(knightActions)
                  break
              case 'bishop-white': checkActions = checkActions.concat(loopActions(directionX))
                  break
              case 'pawn-white': checkActions = checkActions.concat(pawnActions(1,1))
                  break
              default: continue
              }
      }
    }
  }

  for(x in checkActions) {
    if(king[0] === checkActions[x][0] && king[1] === checkActions[x][1]){
      checks.push(checkActions[x][2])
    }
  }
  checkA = (checks.length !== 0)
  setCheckX(checkA)
  return checkA

}





var movingBlock = []
var checkA = false
const [checkX, setCheckX] = useState(false)
const [winner, setWinner] = useState(false)

  function setMarks(y, x, piece){
    movingBlock = [y, x, piece]
    var check = [y, x]
    var movePossibleBlocks = []
    var possibleActions = []
    var possibleReds = []
    var returnActions = []
    var block
    const directionPlus = [[1, 0, [y, x]], [0, 1, [y, x]], [-1, 0, [y, x]], [0, -1, [y, x]], ]
    const directionX = [[1, 1, [y, x]], [-1, 1, [y, x]], [-1, -1, [y, x]], [1, -1, [y, x]], ]
    const kingActions = [[y+1,x, [y, x]], [y+1,x+1, [y, x]], [y,x+1, [y, x]], [y-1,x+1, [y, x]], [y-1,x, [y, x]], [y-1,x-1, [y, x]], [y,x-1, [y, x]], [y+1,x-1, [y, x]], ]
    const knightActions = [[y+2,x+1, [y, x]], [y+1,x+2, [y, x]], [y-1,x+2, [y, x]], [y-2,x+1, [y, x]], [y-2,x-1, [y, x]], [y-1,x-2, [y, x]], [y+1,x-2, [y, x]], [y+2,x-1, [y, x]], ]

    // const directionPlus = [[1, 0], [0, 1], [-1, 0], [0, -1], ]
    // const directionX = [[1, 1], [-1, 1], [-1, -1], [1, -1], ]
    // const kingActions = [[y+1,x], [y+1,x+1], [y,x+1], [y-1,x+1], [y-1,x], [y-1,x-1], [y,x-1], [y+1,x-1], ]
    // const knightActions = [[y+2,x+1], [y+1,x+2], [y-1,x+2], [y-2,x+1], [y-2,x-1], [y-1,x-2], [y+1,x-2], [y+2,x-1], ]
    const loopActions = (actions) => {
        returnActions = []
        for(var i = 0; i < actions.length; i++){//                                   block u sadece 1 kere kullanmak iciin atiyosun gerekmeyebilir
            check = [y, x]
            while(true){
                check = [check[0]+actions[i][0], check[1]+actions[i][1]]
                if(!(0 <= check[0] && check[0] < 8) || !(0 <= check[1] && check[1] < 8)) break
                if(table[check[0]][check[1]][0] === 'empty') returnActions.push([check[0], check[1], [y, x]])
                else break
            }
            if(!(0 <= check[0] && check[0] < 8) || !(0 <= check[1] && check[1] < 8)) continue
            if(movePossibleBlocks.includes(table[check[0]][check[1]][0])) returnActions.push([check[0], check[1], [y, x]])
        }
        return returnActions
    }
    const pawnActions = (startPosition, step) => {
      movePossibleBlocks = []
      possibleActions = [[y+step, x, [y, x]]]
      if(y === startPosition && table[y+step][x][0] === 'empty' && table[y+step+step][x][0] === 'empty') possibleActions.push([y+step+step, x, [y, x]])
      possibleReds = [[y+step, x+step], [y+step, x-step], [y, x]]
      return possibleReds
    }
    if(playerTurn){
        movePossibleBlocks = ['queen-black', 'king-black', 'rock-black', 'bishop-black', 'knight-black', 'pawn-black']
        switch (piece) {
            case 'king-white': possibleActions = kingActions
                break
            case 'queen-white': possibleActions = loopActions(directionPlus.concat(directionX))
                break
            case 'rock-white': possibleActions = loopActions(directionPlus)
                break  
            case 'knight-white': possibleActions = knightActions
                break
            case 'bishop-white': possibleActions = loopActions(directionX)
                break
            case 'pawn-white': pawnActions(1,1)
                break
            }
    }
    else{
        movePossibleBlocks = ['queen-white', 'king-white', 'rock-white', 'bishop-white', 'knight-white', 'pawn-white']
        switch (piece) {
            case 'king-black': possibleActions = kingActions
                break
            case 'queen-black': possibleActions = loopActions(directionPlus.concat(directionX))
                break
            case 'rock-black': possibleActions = loopActions(directionPlus)
                break
            case 'knight-black': possibleActions = knightActions
                break
            case 'bishop-black': possibleActions = loopActions(directionX)
                break
            case 'pawn-black': pawnActions(6,-1)
                break
            }
    }


    // // test for not check
    // var tableClone
    // for(let a in possibleActions) {
    //   tableClone = table
    //   tableClone[possibleActions[a][2][0]][possibleActions[a][2][1]][0] = 'empty'
    //   tableClone[possibleActions[a][0]][possibleActions[a][1]][0] = piece
    //   // if(test(tableClone)) possibleActions.splice(possibleActions.indexOf([possibleActions[a][1], possibleActions[a][1]]), 1)
    // }



//kendi kendini check yapamama
//finish game
//rock change king








    //


    for(let i = 0; i < possibleActions.length; i++){
        if( 0 <= possibleActions[i][0] && possibleActions[i][0] < 8 && 0 <= possibleActions[i][1] && possibleActions[i][1] < 8){
            block = table[possibleActions[i][0]][possibleActions[i][1]][0]
            if(block === 'empty') mark(possibleActions[i][0], possibleActions[i][1], 'ball')
            if(movePossibleBlocks.includes(block)) mark(possibleActions[i][0], possibleActions[i][1], 'red-ball')
        }
    }
    
    for(let i = 0; i < possibleReds.length; i++){
        if(playerTurn) movePossibleBlocks = ['queen-black', 'king-black', 'rock-black', 'bishop-black', 'knight-black', 'pawn-black']
        else movePossibleBlocks = ['queen-white', 'king-white', 'rock-white', 'bishop-white', 'knight-white', 'pawn-white']
        if(0 <= possibleReds[i][1] && possibleReds[i][1] < 8){
        block = table[possibleReds[i][0]][possibleReds[i][1]][0]
        if(movePossibleBlocks.includes(block)) mark(possibleReds[i][0], possibleReds[i][1], 'red-ball')
        }
    }
    possibleReds = []
  }



  var playerTurn = true
  const [playerTurnX, setPlayerTurnX] = useState(true)
  const [focus, setFocus] = useState(false)

  function blockClick(pos, piece){
    var [y, x] = [pos[0], pos[1]]
    if(movingBlock.length === 0) {setMarks(y, x, piece); setFocus(true)}
    else if([movingBlock[0], movingBlock[1]].join(' ') === [y, x].join(' ')){
      if(focus) resetMarks()
      setFocus(x =>!x)//olmuyo--------------------------------------------------------------------------------------
    }
    else if(['ball', 'red-ball'].includes(table[y][x][1])){
      table[movingBlock[0]][movingBlock[1]][0] = 'empty'
      table[y][x] = [movingBlock[2], '']
      movingBlock = []
      resetMarks()
      playerTurn = !playerTurn
      setPlayerTurnX(playerTurn)
      test(table)
    }
    else {resetMarks(); setMarks(y, x, piece)}
    setTableJsx(refresh(table))
    if(!getKing(playerTurn ? 'white' : 'black')) setWinner(!playerTurn?'white':'black')
    else setWinner(false)
  }


  const height = useRef(window.innerHeight).current
  const width = useRef(window.innerWidth).current
  const horizontal = width > height
  //bunlari degistirdiginde tepkili yap

  if(width<=height) var size = width/8
  else var size = height/8
  console.log(size*8)


  function Block(props){
    return (
    <div className={'w-[' +size+ 'px] h-[' +size+ 'px] bg-' + props.color} pos={props.pos}  onClick={() => {blockClick(props.pos, props.piece)}} >
      {props.mark === 'ball' ? <img className={'absolute z-30 w-[' +size+ 'px] h-[' +size+ 'px]'} src='imgs/ball.svg' alt='ball-marker' /> : <></> }
      {props.mark === 'red-ball' ? <img className={'z-30 absolute w-[' +size+ 'px] h-[' +size+ 'px]'} src='imgs/red-ball.svg' alt='ball-marker' /> : <></> }
      <img src={"/imgs/" + props.piece + (props.piece !== 'empty' ? ".svg" : ".png")} className={'z-10 absolute w-[' +size+ 'px] h-[' +size+ 'px]'} alt="block" />
    </div>
    )
  }
  return (
    <div className={'flex ' + (!horizontal && ' flex-col')}>
      <div className={horizontal ? 'w-[calc((100vw-100vh)/2)] min-w-[50px]':'h-[calc((100vh-100vw)/2)] min-h-[25px]'}>
        {winner==='white' && <>white won<br /></>}{winner==='black' && <>black won<br /></>}
        {winner===false &&
          <>
            {playerTurnX ? <>turn of white<br /></> : <>turn of black<br /></>}
            {checkX && <>check<br /></>}
          </>
        }
        
        
      </div>
      <div id='table'>
        {tableJsx}
      </div>
      <div className={horizontal && ''}></div>
    </div>
  );
}

export default App;


// degdiginde kalkmis olsun brakildiginda hangi blockun ustundeyse oraya gecsin
