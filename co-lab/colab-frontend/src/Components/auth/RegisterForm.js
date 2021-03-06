import React, { useState } from "react";

import { Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";

function RegisterForm({ register }) {
  /** Signup form.
   *
   * Shows form and manages update to state on changes.
   * On submission:
   * - calls signup function prop
   * - redirects to /companies route
   *
   * Routes -> SignupForm -> Alert
   * Routed as /signup
   */
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: ""
  });
  const [formErrors, setFormErrors] = useState([]);

  /** Handle form submit:
   *
   * Calls login func prop and, if successful, redirect to /companies.
   */
  async function handleSubmit(evt) {
    evt.preventDefault();
    const result = await register(formData);
    console.log(result);
    if (result.success) {
      history.push("/dashboard");
    } else {
      setFormErrors([result.errors.data.error.message]);
    }
  }

  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  return (
    <div
      className="SignupForm"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "78vh"
      }}
    >
      <Helmet>
        <title>Colab - Sign Up</title>
        <meta
          name="descrition"
          content="Welcome to Colab, a brainstorming suite for songwriters and creatives! Sign up to join!"
        />
      </Helmet>
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2 className="mb-3 text-light">Sign Up</h2>
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
                />
              </div>

              <div className="form-group">
                <label>First name</label>
                <input
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Last name</label>
                <input
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <span>
                Already have an account? <Link to="/login">Log In</Link>
              </span>
              {formErrors.length ? (
                <div className="alert alert-danger" role="alert">
                  {formErrors.map(error => (
                    <p className="mb-0 small" key={error}>
                      {error}
                    </p>
                  ))}
                </div>
              ) : null}
              <button
                type="submit"
                className="btn btn-accept float-right mt-2"
                onSubmit={handleSubmit}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
