import React from 'react';
import { Game } from '../Game/Game';
import './app.scss';

export default function App() {
  // max - 12x12
  return <Game size={{ width: 15, height: 15 }} />;
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
