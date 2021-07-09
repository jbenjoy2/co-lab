import React from "react";
import "./LoadingSpinner.css";

function LoadingSpinner(props) {
  /*
   * Loading spinner component used throughout app to display during any loading state
   */
  return (
    <div className="wrapper text-center">
      <div className="lds-facebook wrapper container col-md-6 offset-md-3 col-lg-5 offset-lg-4">
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}

export default LoadingSpinner;
