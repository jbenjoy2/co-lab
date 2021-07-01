import React from "react";
import Logo from "./SwoleMateLogo.png";

function LandingPage() {
  return (
    <div className="text-center mt-3">
      <h1 className="text-light" style={{ letterSpacing: "1rem" }}>
        WELCOME TO
      </h1>
      <img
        src={Logo}
        className="img-fluid"
        style={{ borderBottom: "3px dashed white" }}
        width="350"
      />
    </div>
  );
}

export default LandingPage;
