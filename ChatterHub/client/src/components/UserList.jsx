// /src/components/UserList.jsx
import React from "react";

const UserList = () => {
  // Dummy list for now
  const users = ["Alice", "Bob", "Charlie", "David"];

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Users</h2>
      <ul>
        {users.map((user, idx) => (
          <li
            key={idx}
            className="py-2 px-3 rounded hover:bg-blue-100 cursor-pointer"
          >
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
