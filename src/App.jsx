import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "./views/layout/RootLayout";
import Board from "./views/pages/board";
import TaskDetails from "./views/pages/task-detail";
import NotFound from "./views/pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Board />} />
          <Route path="tasks/:id" element={<TaskDetails />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
