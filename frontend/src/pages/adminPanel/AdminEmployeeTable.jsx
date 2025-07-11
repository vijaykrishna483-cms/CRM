import React, { useEffect, useState } from 'react';
import api from '../../libs/apiCall';

const AdminEmployeeTable = () => {
  const [users, setUsers] = useState([]);
  const [verticals, setVerticals] = useState([]);
  const [positions, setPositions] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");

  // Fetch users, verticals, and positions from the backend
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userRes, vertRes, posRes] = await Promise.all([
          api.get('/auth/users'),
          api.get('/auth/vertical/getall'),
          api.get('/auth/position/getall'),
        ]);
        setUsers(userRes.data.data);
        setDisplayedUsers(userRes.data.data);
        setVerticals(vertRes.data.data);
        setPositions(posRes.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Filter users by search
  useEffect(() => {
    if (!search) {
      setDisplayedUsers(users);
    } else {
      setDisplayedUsers(
        users.filter(
          user =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, users]);

  // Helper functions to get names
  const getVerticalName = (id) => {
    const v = verticals.find(v => v.id === id);
    return v ? v.name : id;
  };

  const getPositionName = (id) => {
    const p = positions.find(p => p.id === id);
    return p ? p.name : id;
  };

  // Delete user handler
  const handleDelete = async (email) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}?`)) return;
    setDeleteMsg("");
    try {
      await api.delete('/auth/delete', { data: { email } });
      setUsers(users.filter(user => user.email !== email));
      setDeleteMsg(`User ${email} deleted successfully.`);
    } catch (err) {
      setDeleteMsg("Failed to delete user.");
    }
  };

  if (loading) return <div className="text-center py-6">Loading users...</div>;
  if (error) return <div className="text-center py-6 text-red-600">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-[#543c85]">Employee Directory</h2>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-64 focus:outline-[#543c85]"
        />
        {deleteMsg && (
          <div className="text-green-700 font-medium">{deleteMsg}</div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-[#e7f6f2]">
            <tr>
              <th className="py-2 px-3 text-left">#</th>
              <th className="py-2 px-3 text-left">Name</th>
              <th className="py-2 px-3 text-left">Email</th>
              <th className="py-2 px-3 text-left">Vertical</th>
              <th className="py-2 px-3 text-left">Position</th>
              <th className="py-2 px-3 text-left">Employee ID</th>
              <th className="py-2 px-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No employees found.
                </td>
              </tr>
            ) : (
              displayedUsers.map((user, idx) => (
                <tr key={user.id} className="border-b hover:bg-[#f5f3ff]">
                  <td className="py-2 px-3">{idx + 1}</td>
                  <td className="py-2 px-3">{user.name}</td>
                  <td className="py-2 px-3">{user.email}</td>
                  <td className="py-2 px-3">{getVerticalName(user.vertical_id)}</td>
                  <td className="py-2 px-3">{getPositionName(user.position_id)}</td>
                  <td className="py-2 px-3">{user.employee_id}</td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => handleDelete(user.email)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEmployeeTable;
