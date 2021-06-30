import React, { useState } from "react";

import Alert from "react-bootstrap/Alert";

function ProfileEditForm({ user, updateUser }) {
  const [current, setCurrent] = useState(user);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: current.firstName,
    lastName: current.lastName,
    email: current.email,
    username: current.username
  });

  const [formErrors, setFormErrors] = useState([]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const profileData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email
    };

    const username = formData.username;

    try {
      await updateUser(username, profileData);
      setSuccess(true);
    } catch (error) {
      setFormErrors(error);
      return;
    }
  };

  return (
    <div className="col-md-6 col-lg-4 offset-md-3 offset-lg-4 mt-5">
      <h3 className="text-light">Edit Profile</h3>
      <div className="card">
        <div className="card-body">
          <form>
            <div className="form-group">
              <label>Username:</label>
              <p className="form-control-plaintext" style={{ color: "#3597b1" }}>
                {formData.username}
              </p>
            </div>
            <div className="form-group">
              <label>First Name</label>
              <input
                name="firstName"
                className="form-control"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
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
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {formErrors.length ? <Alert type="danger" messages={formErrors} /> : null}

            <button className="btn btn-primary btn-block mt-4" onClick={handleSubmit}>
              Save Changes
            </button>
          </form>
          {success && (
            <Alert
              variant="success"
              onClose={() => setSuccess(false)}
              dismissible
              className="mt-2 mb-0"
            >
              Updated!
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileEditForm;
