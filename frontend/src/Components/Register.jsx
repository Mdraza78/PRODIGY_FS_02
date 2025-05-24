import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:5000/api/register", form);
      setSuccess("Registration successful! Please login.");
      setTimeout(() => navigate("/admin/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [error, success]);

  return (
    <div className="auth-container">
      {error && (
        <div className="popup error">
          <span>{error}</span>
          <button className="close-btn" onClick={() => setError("")}>×</button>
        </div>
      )}
      {success && (
        <div className="popup success">
          <span>{success}</span>
          <button className="close-btn" onClick={() => setSuccess("")}>×</button>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
        <p>
          Already have an account?{" "}
          <b><u><span className="auth-link" onClick={() => navigate("/admin/login")}>
            Login here
          </span></u></b>
        </p>
      </form>
    </div>
  );
};

export default Register;
