import {Routes, Route} from "react-router-dom";
import {Lobby, Room} from "pages";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
