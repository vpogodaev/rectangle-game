import React from 'react';
import { createContext } from 'react';
import GameStore from '../../strores/GameStore';
import { Game } from '../Game/Game';
import './app.scss';

export const StoreContext = createContext<GameStore>(
  new GameStore({ width: 12, height: 12 })
);

export default function App() {
  // max - 12x12
  return (
    <StoreContext.Provider value={new GameStore({ width: 15, height: 15 })}>
      <Game size={{ width: 15, height: 15 }} />;
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
