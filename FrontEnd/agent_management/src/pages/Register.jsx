import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthPages.css";
import SolcaeLogo from "../assets/solace-logo.svg";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      await register(fullName, email, mobile, password, confirmPassword);
      // Registration successful, redirect to login
      setTimeout(() => {
        navigate("/login", { state: { registered: true } });
      }, 1000);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-section">
        <div className="auth-form-wrapper">
          <h2 className="auth-title">Join Alphagnito</h2>
          <p className="auth-subtitle">Create your account to get started</p>

          {errorMsg && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              {errorMsg}
              <button
                type="button"
                className="btn-close"
                onClick={() => setErrorMsg("")}
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="auth-field">
              <input
                type="text"
                className="auth-input"
                placeholder=" "
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <label>Full Name</label>
            </div>

            {/* Email */}
            <div className="auth-field">
              <input
                type="email"
                className="auth-input"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Email Address</label>
            </div>

            {/* Mobile */}
            <div className="auth-field">
              <input
                type="tel"
                className="auth-input"
                placeholder=" "
                pattern="[0-9]{10}"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
              <label>Mobile Number (10 digits)</label>
            </div>

            {/* Password */}
            <div className="auth-field password-field">
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>Password</label>

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </button>
            </div>

            {/* Confirm Password */}
            <div className="auth-field password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="auth-input"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label>Confirm Password</label>

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i
                  className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary auth-btn w-100"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="auth-footer mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="auth-link fw-bold">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-brand-section">
        <div className="auth-brand-content">
          <img src={SolcaeLogo} alt="Solcae logo" className="auth-logo" />
        </div>
      </div>
    </div>
  );
};

export default Register;
