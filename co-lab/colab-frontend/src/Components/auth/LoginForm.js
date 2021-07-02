import React, { useState } from "react";
import { useHistory, Redirect, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
function LoginForm({ login }) {
  const currentUser = useSelector(st => st.user.currentUser);

  const INITIAL_DATA = {
    username: "",
    password: ""
  };
  const history = useHistory();

  const [formData, setFormData] = useState(INITIAL_DATA);
  const [formErrors, setFormErrors] = useState([]);

  if (currentUser.username) {
    return <Redirect to="/dashboard" />;
  }
  const handleSubmit = async e => {
    e.preventDefault();
    const result = await login(formData);
    if (result.success) {
      history.push("/dashboard");
    } else {
      setFormErrors(result.errors);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  };
  return (
    <div
      className="LoginForm"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "95vh"
      }}
    >
      <Helmet>
        <title>Colab - Log In</title>
        <meta
          name="descrition"
          content="Welcome to Colab, a brainstorming suite for songwriters and creatives! Please log in"
        />
      </Helmet>
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h3 className="mb-3 text-light">Log In</h3>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button className="btn btn-cancel btn-block text-light" onSubmit={handleSubmit}>
                Login
              </button>
            </form>
            <p className="mt-2">
              Don't have an account? <Link to="/register">Click here to sign up!</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
