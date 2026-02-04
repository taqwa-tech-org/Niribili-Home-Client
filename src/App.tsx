import { Outlet } from "react-router-dom";
import "./App.css";

const App = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Outlet />
    </div>
  );
};

export default App;
