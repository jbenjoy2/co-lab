import React, { useState } from "react";

function RhymeForm({ search }) {
  const [term, setTerm] = useState("");

  const handleChange = e => {
    setTerm(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    search(term);
  };

  return (
    <div className="w-50 ml-3 mt-4">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="searchTerm" className="text-warning">
            Find Rhymes (Powered by RhymeZone™)
          </label>
          <input
            id="searchTerm"
            onChange={handleChange}
            value={term}
            placeholder="find rhymes..."
            name="searchTerm"
            className="form-control"
          />
        </div>
        <button className="btn btn-sm btn-block btn-success">Go</button>
      </form>
    </div>
  );
}

export default RhymeForm;
