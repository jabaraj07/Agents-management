import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./Dashboard.css"; // reuse same styles for table and modals

const Agents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const API_BASE_URL = "http://localhost:3000/api";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchAgents();
  }, [user, navigate]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE_URL}/agents`, {
        withCredentials: true,
      });
      setAgents(response.data.data || []);
    } catch (err) {
      setError("Failed to load agents. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (agent = null) => {
    if (agent) {
      setIsEditMode(true);
      setEditingId(agent.id);
      setFormData({
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
      });
    } else {
      setIsEditMode(false);
      setEditingId(null);
      setFormData({ name: "", email: "", mobile: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: "", email: "", mobile: "" });
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/agents/${editingId}`, formData, {
          withCredentials: true,
        });
      } else {
        await axios.post(`${API_BASE_URL}/agents`, formData, {
          withCredentials: true,
        });
      }
      handleCloseModal();
      fetchAgents();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save agent. Please try again.",
      );
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm(id);
  };

  const handleConfirmDelete = async () => {
    try {
      setError("");
      await axios.delete(`${API_BASE_URL}/agents/${deleteConfirm}`, {
        withCredentials: true,
      });
      setDeleteConfirm(null);
      fetchAgents();
    } catch (err) {
      setError("Failed to delete agent. Please try again.");
    }
  };

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.mobile.includes(searchTerm),
  );

  return (
    <div className="agents-page">
      <div className="agents-controls d-flex align-items-center mb-4">
        <div className="search-box">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search agents"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="bi bi-search search-icon"></i>
        </div>
        <button
          className="btn btn-primary add-agent-btn"
          onClick={() => handleOpenModal()}
        >
          <i className="bi bi-plus-circle"></i> Add Agents
        </button>
      </div>

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive agents-table-wrapper">
          <table className="table agents-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map((agent) => (
                <tr key={agent.id}>
                  <td data-label="Name" className="agent-name">
                    {agent.name}
                  </td>
                  <td data-label="Email" className="agent-email">
                    {agent.email}
                  </td>
                  <td data-label="Mobile" className="agent-mobile">
                    {agent.mobile}
                  </td>
                  <td data-label="Actions" className="actions-cell">
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-outline-primary action-btn edit-btn"
                        onClick={() => handleOpenModal(agent)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger action-btn delete-btn"
                        onClick={() => handleDeleteClick(agent.id)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="modal-header">
              <h3>Add New Agent</h3>
              <button className="close-btn" onClick={handleCloseModal}>
                ×
              </button>
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
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseModal}
                >
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

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-box confirm-modal">
            <div className="confirm-icon">
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <h5 className="confirm-title">Delete Agent?</h5>
            <p className="confirm-message">
              Are you sure you want to delete this agent? This action cannot be
              undone.
            </p>

            <div className="confirm-buttons">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                <i className="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;
