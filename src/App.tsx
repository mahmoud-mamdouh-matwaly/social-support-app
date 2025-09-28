import { Route, Routes } from "react-router-dom";
import "./App.css";
import { PathConstants } from "./constants/paths";
import { Layout } from "./layout";
import { Application, Home } from "./pages";

function App() {
  return (
    <Routes>
      <Route path={PathConstants.HOME} element={<Layout />}>
        <Route index element={<Home />} />
        <Route path={PathConstants.APPLY} element={<Application />} />
      </Route>
    </Routes>
  );
}

export default App;
