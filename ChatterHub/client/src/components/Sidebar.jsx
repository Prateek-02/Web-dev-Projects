// /src/components/Sidebar.jsx
import React from "react";
import UserList from "./UserList";

const Sidebar = () => {
  return (
    <div className="w-full sm:w-1/3 md:w-1/4 border-r border-gray-300 h-full overflow-y-auto">
      <UserList />
    </div>
  );
};

export default Sidebar;
