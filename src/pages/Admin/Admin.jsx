import { Route, Routes } from "react-router-dom";
import Users from "../Users/Users";
import UsersForm from "../Users/Form/UsersForm";
import Groups from "../Groups/Groups";
import Permissions from "../Permissions/Permissions";
import PermissionsForm from "../Permissions/PermissionsForm";
import PermissonsModify from "../Permissions/PermissonsModify";
import PermissionsData from "../Permissions/PermissionsData";

export default function Admin() {
  return (
    <div className="routerDiv">
      <Routes>
        <Route path="/users/add/" element={<UsersForm />} />
        <Route path="/users/:id" element={<UsersForm />} />
        <Route path="/users/edit/:id" element={<UsersForm />} />
        <Route path="/users/*" element={<Users />} />
        <Route path="/groups/*" element={<Groups />} />
        <Route path="/permissions/*" element={<Permissions />} />
        <Route path="/permissions/data/*" element={<PermissionsData />} />
        <Route path="/permissions/:id" element={<PermissionsForm />} />
        <Route path="/permissions/add/" element={<PermissionsForm />} />
        <Route path="/permissions/edit/:id" element={<PermissionsForm />} />
        <Route path="/permissions/modify/*" element={<PermissonsModify />} />
      </Routes>
    </div>
  );
}
