import { Route, Routes } from "react-router-dom";
import Organiztion from "../Organization/Organization";
import OrganizationForm from "../Organization/Form/OrganizationForm";
import Users from "../Users/Users";
import UsersForm from "../Users/Form/UsersForm";

export default function Admin() {
  return (
    <Routes>
      <Route path="/users/add/" element={<UsersForm />} />
      <Route path="/users/edit/:id" element={<UsersForm />} />
      <Route path="/users/view/:id" element={<UsersForm />} />
      <Route path="/users/*" element={<Users />} />
      {/* Dashboard Just Before Last Route */}
    </Routes>
  );
}
