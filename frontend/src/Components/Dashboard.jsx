import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'view'
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: '',
    salary: ''
  });
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

  // Check authentication and fetch employees
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/admin/login');
    } else {
      setUser(JSON.parse(userData));
      fetchEmployees();
    }
  }, [navigate]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/employees', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/employees/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data);
      setCurrentPage(1); // Reset to first page on new search
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
      setLoading(false);
    }
  };

const resetSearch = () => {
  setSearchQuery('');
  fetchEmployees(); // This will refetch all employees
  setCurrentPage(1); // Reset to first page
};

  // Get current employees for pagination
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      if (currentEmployeeId) {
        // Update existing employee
        await axios.put(
          `http://localhost:5000/api/employees/${currentEmployeeId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Employee updated successfully');
      } else {
        // Create new employee
        await axios.post(
          'http://localhost:5000/api/employees',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Employee created successfully');
      }

      fetchEmployees();
      resetForm();
      setActiveTab('view'); // Switch to view after successful operation
      setCurrentPage(1); // Reset to first page after operation
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      position: '',
      department: '',
      salary: ''
    });
    setCurrentEmployeeId(null);
  };

  const handleEdit = (employee) => {
    setFormData({
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      position: employee.position,
      department: employee.department,
      salary: employee.salary
    });
    setCurrentEmployeeId(employee._id);
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Employee deleted successfully');
        fetchEmployees();
        
        // Adjust page if we deleted the last item on the current page
        if (currentEmployees.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [error, success]);

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-left">
          <h1>ProdigyInfoTech</h1>
        </div>
        <div className="nav-right">
          <span className="welcome-message">Welcome, {user.fullName}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-main">
        {/* Sidebar Navigation */}
        <div className="dashboard-sidebar">
          <div 
            className={`sidebar-item ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => {
              resetForm();
              setActiveTab('add');
            }}
          >
            Add New Employee
          </div>
          <div 
            className={`sidebar-item ${activeTab === 'view' ? 'active' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            View & Edit Employees
          </div>
        </div>

        {/* Main Content Area */}
        <div className="dashboard-content">
          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}

          {activeTab === 'add' ? (
            <div className="employee-form-container">
              <h2>{currentEmployeeId ? 'Edit Employee' : 'Add New Employee'}</h2>
              
              <form onSubmit={handleSubmit} className="employee-form">
                <div className="form-group">
                  <label>Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                    disabled={!!currentEmployeeId}
                  />
                </div>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Salary</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {currentEmployeeId ? 'Update Employee' : 'Add Employee'}
                  </button>
                  {currentEmployeeId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        resetForm();
                        setActiveTab('view');
                      }} 
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="employee-list-container">
              <div className="search-container">
               <input
                  type="text"
                  placeholder="Search by ID, name, or email"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value === '') {
                      resetSearch();
                    }
                  }}
                  className="search-input"
                />
                <button onClick={handleSearch} className="search-button">
                  Search
                </button>
                {searchQuery && (
                  <button onClick={resetSearch} className="reset-button">
                    Clear Search
                  </button>
                )}
              </div>
              <h2>Employee Records</h2>
              
              {loading ? (
                <div className="loading">Loading employees...</div>
              ) : employees.length === 0 ? (
                <div className="no-records">No employees found</div>
              ) : (
                <>
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Position</th>
                        <th>Department</th>
                        <th>Salary</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEmployees.map(employee => (
                        <tr key={employee._id}>
                          <td>{employee.employeeId}</td>
                          <td>{employee.firstName} {employee.lastName}</td>
                          <td>{employee.email}</td>
                          <td>{employee.position}</td>
                          <td>{employee.department}</td>
                          <td>₹{employee.salary.toLocaleString()}</td>
                          <td className="actions">
                            <button 
                              onClick={() => handleEdit(employee)}
                              className="btn-edit"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(employee._id)}
                              className="btn-delete"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  <div className="pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="page-button"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.ceil(employees.length / employeesPerPage) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === Math.ceil(employees.length / employeesPerPage)}
                      className="page-button"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
