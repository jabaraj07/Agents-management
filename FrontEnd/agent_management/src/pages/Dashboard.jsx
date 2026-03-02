import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const API_BASE_URL = "http://localhost:3000/api";

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

  // Fetch agents
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

  // Logout
  const handleLogout = () => {
    logout();
  };

  // Search filter
  const filteredAgents = agents.filter((agent) =>
    `${agent.name} ${agent.email} ${agent.mobile}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Open modal
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

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit
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

  // Delete
  const handleDeleteClick = (id) => {
    setDeleteConfirm(id);
  };

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
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient
                id="headerLogoGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
            </defs>
            <path
              d="M 30 40 L 50 40 L 50 80 L 30 80 Q 20 70 20 60 Q 20 50 30 40"
              fill="url(#headerLogoGradient)"
            />
            <path
              d="M 60 30 L 80 30 Q 100 35 100 60 Q 100 85 80 90 L 60 90 L 60 30"
              fill="url(#headerLogoGradient)"
              opacity="0.7"
            />
          </svg>
          <h1 className="brand-name">Alphagnito</h1>
        </div>

        <div className="header-right">
          <span>Welcome, {user?.email}</span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Controls */}
      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Search agents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />

        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          Add New Agent
        </button>
      </div>

      {/* Table */}
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

      {/* Modal */}
      {/* {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5>{isEditMode ? "Edit Agent" : "Add Agent"}</h5>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                required
              />
              <button type="submit" className="btn btn-primary">
                {isEditMode ? "Update" : "Create"}
              </button>
              <button type="button" onClick={handleCloseModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )} */}

      {showModal && (
  <div className="modal-overlay" onClick={handleCloseModal}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>

      {/* Header */}
      <div className="modal-header">
        <h3>Add New Agent</h3>
        <button className="close-btn" onClick={handleCloseModal}>×</button>
      </div>

      {/* Body */}
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

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={handleCloseModal}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Add Agent
          </button>
        </div>
      </form>

    </div>
  </div>
)}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to delete this agent?</p>
            <button onClick={() => setDeleteConfirm(null)}>Cancel</button>
            <button onClick={handleConfirmDelete}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;