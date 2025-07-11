import React, { useEffect, useState } from "react";
import api from "../../libs/apiCall";

const PositionAndVerticalsPage = () => {
  // State for positions
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState("");
  const [positionMsg, setPositionMsg] = useState("");
  const [positionLoading, setPositionLoading] = useState(false);

  // State for verticals
  const [verticals, setVerticals] = useState([]);
  const [newVertical, setNewVertical] = useState("");
  const [verticalMsg, setVerticalMsg] = useState("");
  const [verticalLoading, setVerticalLoading] = useState(false);

  // Fetch positions and verticals
  useEffect(() => {
    fetchPositions();
    fetchVerticals();
  }, []);

  const fetchPositions = async () => {
    setPositionLoading(true);
    try {
      const res = await api.get("/auth/position/getall");
      setPositions(res.data.data);
    } catch {
      setPositionMsg("Failed to fetch positions.");
    }
    setPositionLoading(false);
  };

  const fetchVerticals = async () => {
    setVerticalLoading(true);
    try {
      const res = await api.get("/auth/vertical/getall");
      setVerticals(res.data.data);
    } catch {
      setVerticalMsg("Failed to fetch verticals.");
    }
    setVerticalLoading(false);
  };

  // Add position
  const handleAddPosition = async (e) => {
    e.preventDefault();
    setPositionMsg("");
    if (!newPosition.trim()) return setPositionMsg("Enter a position name.");
    try {
      await api.post("/auth/position/add", { name: newPosition });
      setPositionMsg("Position added!");
      setNewPosition("");
      fetchPositions();
    } catch (err) {
      setPositionMsg(
        err.response?.data?.message || "Failed to add position."
      );
    }
  };

  // Delete position
  const handleDeletePosition = async (id) => {
    if (!window.confirm("Delete this position?")) return;
    setPositionMsg("");
    try {
      await api.delete(`/auth/position/${id}`);
      setPositionMsg("Position deleted.");
      fetchPositions();
    } catch {
      setPositionMsg("Failed to delete position.");
    }
  };

  // Add vertical
  const handleAddVertical = async (e) => {
    e.preventDefault();
    setVerticalMsg("");
    if (!newVertical.trim()) return setVerticalMsg("Enter a vertical name.");
    try {
      await api.post("/auth/vertical/add", { name: newVertical });
      setVerticalMsg("Vertical added!");
      setNewVertical("");
      fetchVerticals();
    } catch (err) {
      setVerticalMsg(
        err.response?.data?.message || "Failed to add vertical."
      );
    }
  };

  // Delete vertical
  const handleDeleteVertical = async (id) => {
    if (!window.confirm("Delete this vertical?")) return;
    setVerticalMsg("");
    try {
      await api.delete(`/auth/vertical/${id}`);
      setVerticalMsg("Vertical deleted.");
      fetchVerticals();
    } catch {
      setVerticalMsg("Failed to delete vertical.");
    }
  };



  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-2xl font-bold text-[#543c85] mb-6">Manage Positions & Verticals</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Positions Section */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Positions</h3>
          <form onSubmit={handleAddPosition} className="flex gap-2 mb-3">
            <input
              type="text"
              value={newPosition}
              onChange={(e) => setNewPosition(e.target.value)}
              placeholder="Add new position"
              className="border rounded px-2 py-1 flex-1"
            />
            <button
              type="submit"
              className="bg-[#543c85] text-white px-3 py-1 rounded hover:bg-[#6750a4] transition"
              disabled={positionLoading}
            >
              Add
            </button>
          </form>
          {positionMsg && <div className="mb-2 text-sm text-[#543c85]">{positionMsg}</div>}
          <ul className="divide-y">
            {positions.map((pos) => (
              <li key={pos.id} className="flex justify-between items-center py-2">
                <span>{pos.name}</span>
                <button
                  onClick={() => handleDeletePosition(pos.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                  disabled={positionLoading}
                >
                  Delete
                </button>
              </li>
            ))}
            {positions.length === 0 && (
              <li className="text-gray-400 py-2">No positions found.</li>
            )}
          </ul>
        </div>

        {/* Verticals Section */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Verticals</h3>
          <form onSubmit={handleAddVertical} className="flex gap-2 mb-3">
            <input
              type="text"
              value={newVertical}
              onChange={(e) => setNewVertical(e.target.value)}
              placeholder="Add new vertical"
              className="border rounded px-2 py-1 flex-1"
            />
            <button
              type="submit"
              className="bg-[#543c85] text-white px-3 py-1 rounded hover:bg-[#6750a4] transition"
              disabled={verticalLoading}
            >
              Add
            </button>
          </form>
          {verticalMsg && <div className="mb-2 text-sm text-[#543c85]">{verticalMsg}</div>}
          <ul className="divide-y">
            {verticals.map((vert) => (
              <li key={vert.id} className="flex justify-between items-center py-2">
                <span>{vert.name}</span>
                <button
                  onClick={() => handleDeleteVertical(vert.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                  disabled={verticalLoading}
                >
                  Delete
                </button>
              </li>
            ))}
            {verticals.length === 0 && (
              <li className="text-gray-400 py-2">No verticals found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PositionAndVerticalsPage;
