import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./Dashboard.css";
import StatCard from "../components/StatCard";
import { stats } from "../data/stats";
import { SearchContext } from "../context/SearchContext";

const API_BASE_URL = "http://localhost:3000/api";

const Dashboard = () => {
  const { searchTerm } = useContext(SearchContext);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    mobile: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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

  const filteredAgents = agents.filter((agent) =>
    `${agent.name} ${agent.email} ${agent.mobile}`
      .toLowerCase()
      .includes(searchTerm && searchTerm.toLowerCase()),
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
        className="stats-row"
        style={{
          display: "flex",
          gap: "16px",
          //   flexWrap: "nowrap",
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
      <div className="quick-actions mb-4">
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

      {/* ── Agents Table ── */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table agents-table">
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
                  <td data-label="Name">{agent.name}</td>
                  <td data-label="Email">{agent.email}</td>
                  <td data-label="Mobile">{agent.mobile}</td>
                  <td data-label="Actions">
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-outline-primary"
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
                    </div>
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
          <div className="modal-box">
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
