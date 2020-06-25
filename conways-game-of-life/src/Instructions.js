import React from 'react';
import styled from 'styled-components';
import './App.css';

function Instructions() {
  return (
    <TInstructionsWrapper>
      <h1>Conways Game of Life!</h1>
      <h3>About this Algorithm</h3>
      <p>The universe of the Game of Life is an infinite two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead. Every cell interacts with its eight neighbours, which are the cells that are directly horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:</p>
      <h3>Conway's Rules:</h3>
      <ol>
        <p>1. Any live cell with fewer than two live neighbours dies (referred to as underpopulation or exposure).</p>
        <p>2. Any live cell with more than three live neighbours dies (referred to as overpopulation or overcrowding).</p>
        <p>3. Any live cell with two or three live neighbours lives, unchanged, to the next generation.</p>
        <p>4. Any dead cell with exactly three live neighbours will come to life.</p>
      </ol>
    </TInstructionsWrapper>
  );

}

const TInstructionsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction:column;
  width: 40%;
`;

export default Instructions;

