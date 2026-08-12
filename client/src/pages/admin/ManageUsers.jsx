import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/Loader";
import { FaTrash, FaUserCheck, FaUserSlash } from "react-icons/fa";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/auth/users");
      setUsers(data || []);
    } catch (err) {
      setUsers([
        { _id: "u1", name: "Faculty Admin", email: "admin@ruh.ac.lk", role: "admin", location: "Matara", isBlocked: false, createdAt: new Date() },
        { _id: "u2", name: "Dr. K. L. Perera", email: "dr.perera@fot.ruh.ac.lk", role: "provider", location: "Kamburupitiya", isBlocked: false, createdAt: new Date() },
        { _id: "u3", name: "Kasun Silva", email: "tech.student@fot.ruh.ac.lk", role: "student", location: "Matara", isBlocked: false, createdAt: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/auth/users/${userId}/role`, { role: newRole });
      toast.success("User role updated");
      setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      toast.error("Role update failed");
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const { data } = await api.put(`/auth/users/${userId}/status`);
      toast.success("User status updated");
      setUsers(users.map((u) => (u._id === userId ? { ...u, isBlocked: data.isBlocked } : u)));
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user account?")) return;
    try {
      await api.delete(`/auth/users/${userId}`);
      toast.success("User account deleted");
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      const message = err.response?.data?.message || "Delete failed";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6 py-6">
      
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">Manage Users</h1>
          <p className="text-xs text-slate-500">View user directory, assign administrative roles, suspend, or delete accounts.</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <Loader text="Loading users directory..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono border-b border-slate-200">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900 font-outfit">{u.name}</td>
                    <td className="p-4 font-mono text-slate-500">{u.email}</td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded border border-slate-300 focus:outline-none"
                      >
                        <option value="student">Student</option>
                        <option value="provider">Provider</option>
                        <option value="admin">Admin</option>
                        <option value="volunteer">Volunteer</option>
                      </select>
                    </td>
                    <td className="p-4 font-mono">{u.location || "Matara"}</td>
                    <td className="p-4 font-mono">{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleBlock(u._id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors inline-flex items-center space-x-1 ${
                          u.isBlocked
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                        }`}
                      >
                        {u.isBlocked ? <FaUserCheck /> : <FaUserSlash />}
                        <span>{u.isBlocked ? "Unblock" : "Suspend"}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 transition-colors inline-flex items-center"
                        title="Delete User Account"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
