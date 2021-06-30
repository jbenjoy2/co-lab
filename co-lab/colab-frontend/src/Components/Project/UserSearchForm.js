import React, { useState } from "react";

function UserSearchForm({ search, searchTerm }) {
  const [term, setTerm] = useState("");

  const handleChange = e => {
    setTerm(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    search(term);
    setTerm("");
  };

  return (
    <div className="w-50 ml-3 mt-4">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            id="searchTerm"
            onChange={handleChange}
            value={term}
            placeholder="Enter a username..."
            name="searchTerm"
            className="form-control"
          />
        </div>
        <button className="btn btn-sm btn-block btn-success">Go</button>
      </form>
    </div>
  );
}

export default UserSearchForm;
