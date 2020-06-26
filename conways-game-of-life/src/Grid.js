import React, {useState, useCallback, useRef, useEffect} from 'react';
import produce from 'immer';
import styled from 'styled-components';
import './App.css';

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

function Grid() {
  const [numRows, setNumRows] = useState(25)
  const [numCols, setNumCols] = useState(25)
  const [cellSize, setCellSize] = useState(25)
  const [generationalDuration, setGenerationalDuration] = useState(500)
  const [color, setColor] = useState("deepskyblue")
  // const [generationNum, setGenerationNum] = useState(0)


  // ---------------- features -----------------------------
  const onCellSizeChange = evt => setCellSize(evt.target.value);

  // TODO: change how fast generations occur via user input
  // const onGenerationChange = evt => setGenerationalDuration(evt.target.value)
  
  // TODO: change total grid size via user input
  // const onGridSizeChange = evt => {
  //   setNumRows(evt.target.value)
  //   setNumCols(evt.target.value)
  //   // setRunning(false)
  // }
  // -------------------------------------------------------

  const generateEmptyGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0))
    }
    return rows
  }

  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  })
  const [running, setRunning] = useState(false);
  const runningRef = useRef();
  runningRef.current = running;

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



    setTimeout(runSimulation, generationalDuration)
  }, []) 


  return (
    <TGridWrapper>
      <TButtonRowOne>
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
            // setGenerationNum(0)
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
            // setGenerationNum(0)
            generationNum = 0
            setRunning(false)
          }}
          >
            Random
          </button>
        </div>

        {/* Generation Counter */}
        <div>Generation#: {generationNum} </div>

      </TButtonRowOne>
      <TButtonRowTwo>
        {/* cell size */}
        <label>
          Cell Size:
          <TFormInput 
            placeholder="25 px" 
            type="text" 
            name="cellSize"
            onChange={onCellSizeChange}
          />
        </label>
        {/* seconds per generation */}
        {/* <label>
          ms per generation:
          <TFormInput 
            placeholder="500 ms" 
            type="text" 
            name="generationalDuration" 
            onChange={onGenerationChange}  
          />
        </label> */}
        {/* Grid Size */}
        {/* <label>
          Grid Size:
          <input 
            placeholder="25"
            type="text"
            name="gridSize"
            onChange={onGridSizeChange}
          />
        </label> */}
        <button onClick={() => {
          setColor("green")
        }}
        >
          green cells
        </button>
        {/* Submit */}
        {/* <input type="submit" value="Submit" /> */}
      </TButtonRowTwo>

      {/* Interactive Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`,
        margin: '0 auto'
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
            style={{
              width: `${cellSize}px`, 
              height: `${cellSize}px`, 
              backgroundColor: grid[i][k] ? `${color}` : '#8c8787',
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

const TButtonRowOne = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: space-around;
`;

const TButtonRowTwo = styled.form`
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const TFormInput = styled.input`
  width: 50px;
`;

export default Grid;