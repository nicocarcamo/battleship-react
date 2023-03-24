import { useEffect, useState } from 'react';
import BoardContainer from './BoardContainer';
import Footer from './Footer';
import './styles.css';


function App() {

  //state hooks
  const [playerBoxes, setPlayerBoxes] = useState([]);
  const [enemyBoxes, setEnemyBoxes] = useState([])
  const [playerPoints, setPlayerPoints] = useState(null);
  const [enemyPoints, setEnemyPoints] = useState(null);
  const [message, setMessage] = useState(null);

  function gameBoard(cols, setBoxes, setPoints) {
    const newArray = Array.from({ length: cols }, () => Array.from({ length: cols }, () => 0));
    let points = 0;
    
    for (let i = 0; i < 5; i++) {
    const length = Math.floor(Math.random() * 3) + 3;
    let [x, y, dx, dy] = [Math.floor(Math.random() * cols), Math.floor(Math.random() * cols), ...(Math.random() < 0.5 ? [1, 0] : [0, 1])];
    
    for (let j = 0; j < length; j++) {
      if (x < 0 || x >= cols || y < 0 || y >= cols || newArray[x][y] !== 0) {
        break;
      }
      newArray[x][y] = 1;
      points++;
      x += dx;
      y += dy;
    }
    }
    
    setPoints(points);
    setBoxes(newArray);
    }


  //Change box value
  function changeBoxValue(boxes, setBoxes, value, i, j) {
    let newArray = [...boxes];
    newArray[i].splice(j, 1, value);
    setBoxes(newArray);
  }

  //Cpu logic
  function cpu(cols) {
    let newArray = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < cols; j++) {
        if (playerBoxes[i][j] < 2) {
          newArray.push([i, j])
        }
      }
    }
    const randomIndex = Math.floor(Math.random() * newArray.length);
    const [i, j] = newArray[randomIndex];
    if (playerBoxes[i][j] === 1) {
      changeBoxValue(playerBoxes, setPlayerBoxes, 2, i, j);
      setPlayerPoints(playerPoints - 1);
    } else {
      changeBoxValue(playerBoxes, setPlayerBoxes, 3, i, j);
    }
  }

  //Check winner
  function checkWinner() {
    if (playerPoints === 0) {
      setMessage("CPU Wins!");
    } else if (enemyPoints === 0) {
      setMessage("You Win!");
    }
  }

  //Player click handler
  function handleClick(type, i, j) {
    if (type === "CPU") {
      if (enemyBoxes[i][j] === 1) {
        changeBoxValue(enemyBoxes, setEnemyBoxes, 2, i, j);
        setEnemyPoints(enemyPoints - 1);
      } else if (enemyBoxes[i][j] === 0) {
        changeBoxValue(enemyBoxes, setEnemyBoxes, 3, i, j);
      }
      cpu(10); // Call the cpu() function after each player move
    }
  }

  useEffect(() => {
    gameBoard(10, setPlayerBoxes, setPlayerPoints);
    gameBoard(10, setEnemyBoxes, setEnemyPoints);
  }, []);

  useEffect(() => {
    checkWinner();
  });

  useEffect(() => {

  }, [playerBoxes])

  return (
    <div className="container">
      <h1>Battleship</h1>
      {message && (
        <div className="winner">
          <h1>{message}</h1>
        </div>
      )}
      <div className="board">
        {['You', 'CPU'].map(type => (
          <BoardContainer
            key={type}
            boxes={type === 'You' ? playerBoxes : enemyBoxes}
            type={type}
            handleClick={handleClick}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default App;
