import { Route, Routes } from "react-router-dom";
import Organiztion from "../Organization/Organization";
import OrganizationForm from "../Organization/Form/OrganizationForm";

export default function Client() {
  return (
    <Routes>
      <Route path="/organization/add/" element={<OrganizationForm />} />
      <Route path="/organization/edit/:id" element={<OrganizationForm />} />
      <Route path="/organization/*" element={<Organiztion />} />
      {/* Dashboard Just Before Last Route */}
    </Routes>
  );
}
