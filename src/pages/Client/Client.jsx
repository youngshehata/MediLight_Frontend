import { Route, Routes } from "react-router-dom";
import Organiztion from "../Organization/Organization";

export default function Client() {
  return (
    <Routes>
      <Route path="/organization" element={<Organiztion />} />
      <Route path="/organization/:id" element={<Organiztion />} />
      {/* Dashboard Just Before Last Route */}
    </Routes>
  );
}
