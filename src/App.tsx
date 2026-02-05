import { Outlet } from "react-router-dom";
import "./App.css";

const App = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Outlet />
    </div>
  );
};

export default App;
