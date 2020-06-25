import React, {useState, useCallback, useRef} from 'react';
import produce from 'immer';
import styled from 'styled-components';
import './App.css';

const numRows = 25;
const numCols = 25;
let generationNum = 0;

const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1]
]

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }

  return rows
}

function Grid() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  })


  const [running, setRunning] = useState(false);

  const runningRef = useRef();
  runningRef.current = running

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    generationNum += 1

    //-- Rules of the simulation --//
    // 1) Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    // 2) Any live cell with two or three live neighbours lives on to the next generation.
    // 3) Any live cell with more than three live neighbours dies, as if by overpopulation.
    // 4) Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

    setGrid((g) => {
      return produce(g, gridCopy => { // iterated through current grid `g`

        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {

            let neighbors = 0;

            neighbors = 0; // initalize neighbors

            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              // check the boundries of the whole gird.
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK]
              }
            })

            // takes care of rule numbers 1 and 3. checking it's neighbors and killing the cell.
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0
            } else if (g[i][k] === 0 && neighbors === 3) { // this takes care of rule number 4. 
              gridCopy[i][k] = 1;
            }

            // rule #2, no check needs to happen for this login. it stays alive.
            
          }
        }
      });
    });

    

    setTimeout(runSimulation, 500)
  }, []) 

  return (
    <TGridWrapper>
      <TButtonRow>
      {/* Buttons */}
        <div>
          <button 
            onClick={() => {
              setRunning(!running);
              if (!running) {
                runningRef.current = true;
                runSimulation();
              }
            }}
          >
            {running ? 'Stop' : 'Start'}
          </button>

          <button onClick={() => {
            setGrid(generateEmptyGrid());
            generationNum = 0
            setRunning(false)
          }}
          >
            Clear
          </button>

          <button onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(Array.from(Array(numCols), () => Math.random() > 0.5 ? 1 : 0))
            }
            setGrid(rows)
            generationNum = 0
            setRunning(false)
          }}
          >
            Random
          </button>
        </div>

        {/* Generation Counter */}
        <div>Generation#: {generationNum} </div>

      </TButtonRow>

      {/* Interactive Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}>
        {grid.map((rows, i) => 
          rows.map((col, k) => 
            <div 
            key={`${i}-${k}`}
            onClick={() => {
              const newGrid = produce(grid, gridCopy => {
                gridCopy[i][k] = grid[i][k] ? 0 : 1;
              })
              setGrid(newGrid)
            }}
              style={{width: 20, height: 20, 
              backgroundColor: grid[i][k] ? 'deepskyblue' : '#8c8787',
              border: 'solid 1px black'
            }} 
          />)
        )}
      </div>
    </TGridWrapper>
  );
  
}

const TGridWrapper = styled.div`
  display: flex;
  flex-direction:column;
  `;

const TButtonRow = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: space-around;
`;



export default Grid;

// background-color: #537895;
// background-image: linear-gradient(315deg, #537895 0%, #09203f 74%);
 