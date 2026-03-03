import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const API_BASE_URL = "http://localhost:3000/api";

// Stat card icons as SVGs matching the screenshot style
const StatCard = ({ title, value, color, icon }) => {
  const colorMap = {
    green: {
      bar: "#22c55e",
      bg: "#f0fdf4",
      iconColor: "#22c55e",
    },
    red: {
      bar: "#ef4444",
      bg: "#fef2f2",
      iconColor: "#ef4444",
    },
    yellow: {
      bar: "#eab308",
      bg: "#fefce8",
      iconColor: "#eab308",
    },
  };

  const theme = colorMap[color] || colorMap.green;

  return (
    <div
      style={{
        flex: "1 1 220px",
        minWidth: "160px",
        height: "156px",
        borderRadius: "10px",
        border: "0.4px solid #e2e8f0",
        backgroundColor: "#ffffff",
        padding: "20px 18px 0 18px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        boxSizing: "border-box",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top row: title + icon */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            color: "#6b7280",
            fontWeight: 400,
            lineHeight: "1.4",
          }}
        >
          {title}
        </span>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: theme.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.iconColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icon}
          </svg>
        </div>
      </div>

      {/* Value — directly below title */}
      <div
        style={{
          fontSize: "36px",
          fontWeight: "700",
          color: "#111827",
          lineHeight: "1",
          marginTop: "16px",
        }}
      >
        {value}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          height: "4px",
          backgroundColor: theme.bar,
          borderRadius: "0 0 10px 10px",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
    </div>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    mobile: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Stats (replace with real API data as needed)
  const stats = [
    {
      title: "Total Clients",
      value: 200,
      color: "green",
      icon: (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <polyline points="9 9 12 6 15 9" />
          <line x1="12" y1="6" x2="12" y2="18" />
        </>
      ),
    },
    {
      title: "Total Properties",
      value: 10,
      color: "green",
      icon: (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <polyline points="7 15 10 12 13 15 17 11" />
        </>
      ),
    },
    {
      title: "Total Inspections",
      value: 2,
      color: "red",
      icon: (
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </>
      ),
    },
    {
      title: "Pending Inspections",
      value: 2,
      color: "yellow",
      icon: (
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="12" y1="14" x2="12" y2="18" />
          <line x1="10" y1="16" x2="14" y2="16" />
        </>
      ),
    },
    {
      title: "Closed Inspections",
      value: 10,
      color: "yellow",
      icon: (
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <polyline points="9 16 11 18 15 14" />
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/agents`, {
        withCredentials: true,
      });
      setAgents(res.data.data || []);
    } catch (err) {
      setError("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => logout();

  const filteredAgents = agents.filter((agent) =>
    `${agent.name} ${agent.email} ${agent.mobile}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const handleOpenModal = (agent = null) => {
    if (agent) {
      setIsEditMode(true);
      setFormData(agent);
    } else {
      setIsEditMode(false);
      setFormData({ id: null, name: "", email: "", mobile: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/agents/${formData.id}`, formData, {
          withCredentials: true,
        });
      } else {
        await axios.post(`${API_BASE_URL}/agents`, formData, {
          withCredentials: true,
        });
      }
      fetchAgents();
      handleCloseModal();
    } catch (err) {
      setError("Failed to save agent");
    }
  };

  const handleDeleteClick = (id) => setDeleteConfirm(id);

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/agents/${deleteConfirm}`, {
        withCredentials: true,
      });
      setDeleteConfirm(null);
      fetchAgents();
    } catch (err) {
      setError("Failed to delete agent");
    }
  };

  return (
    <div className="dashboard-page">
      {/* Error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* ── Stats Cards Row ── */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "32px",
          width: "100%",
        }}
      >
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            title={stat.title}
            value={stat.value}
            color={stat.color}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* ── Quick Actions ── */}

      <div className="quick-actions-sections mb-4">
        <h5 className="quick-actions-title">Quick Actions</h5>
        <div className="quick-actions">
          <div className="action-card">
            <i className="bi bi-plus-circle action-icon"></i>
            <div>Create Inspection</div>
          </div>
          <div className="action-card">
            <i className="bi bi-plus-circle action-icon"></i>
            <div>Add Property</div>
          </div>
          <div className="action-card" onClick={() => handleOpenModal()}>
            <i className="bi bi-plus-circle action-icon"></i>
            <div>Add Agent</div>
          </div>
          <div className="action-card">
            <i className="bi bi-plus-circle action-icon"></i>
            <div>Add Inspector</div>
          </div>
        </div>
      </div>

      {/* ── Agents Table ── */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgents.length === 0 ? (
              <tr>
                <td colSpan="4">No agents found</td>
              </tr>
            ) : (
              filteredAgents.map((agent) => (
                <tr key={agent.id}>
                  <td>{agent.name}</td>
                  <td>{agent.email}</td>
                  <td>{agent.mobile}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleOpenModal(agent)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteClick(agent.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* ── Add/Edit Agent Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditMode ? "Edit Agent" : "Add New Agent"}</h3>
              <button className="close-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mobile Number (10 digits) *</label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Enter mobile number"
                    pattern="[0-9]{10}"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {isEditMode ? "Save Changes" : "Add Agent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-body">
              <h5 className="modal-title">Delete Agent</h5>
              <p className="modal-text">
                Are you sure you want to delete this agent? This action cannot
                be undone.
              </p>
              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button className="btn-delete" onClick={handleConfirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
