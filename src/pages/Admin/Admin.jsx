import { Route, Routes } from "react-router-dom";
import Organiztion from "../Organization/Organization";
import OrganizationForm from "../Organization/Form/OrganizationForm";
import Users from "../Users/Users";
import UsersForm from "../Users/Form/UsersForm";
import Groups from "../Groups/Groups";

export default function Admin() {
  return (
    <div className="routerDiv">
      <Routes>
        <Route path="/users/add/" element={<UsersForm />} />
        <Route path="/users/:id" element={<UsersForm />} />
        <Route path="/users/edit/:id" element={<UsersForm />} />
        <Route path="/users/view/:id" element={<UsersForm />} />
        <Route path="/users/*" element={<Users />} />
        <Route path="/groups/*" element={<Groups />} />
      </Routes>
    </div>
  );
}
