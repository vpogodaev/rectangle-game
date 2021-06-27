import React from 'react';
import { createContext } from 'react';
import { IBox } from '../../models/common/interfaces';
import GameStore from '../../strores/GameStore';
import { Game } from '../Game/Game';
import './app.scss';

export const StoreContext = createContext<GameStore>(
  new GameStore({ width: 12, height: 12 })
);

export default function App() {
  // max - 12x12
  const size: IBox = { width: 15, height: 15 }

  return (
    <StoreContext.Provider value={new GameStore(size)}>
      {/* <Game size={size} />; */}
      <Game />;
    </StoreContext.Provider>
  );
}
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//       </header>

//     </div>
//   );
// }

// export default App;
