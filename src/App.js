import {Routes, Route} from "react-router-dom";
import {Lobby} from "pages";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Lobby />} />
      </Routes>
    </div>
  );
}

export default App;
