import React from 'react';
import Grid from './Grid';
import Instructions from './Instructions';
import styled from 'styled-components';

import './App.css';

function App() {
  return (
    <Twrapper>
      <Grid/>
      <Instructions/>
      {/* add gif examples below */}
    </Twrapper>
  );
}

const Twrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;

`;

export default App;