import React, { useState } from "react";
import { NavLink, Link, useHistory } from "react-router-dom";
import Logo from "../Arrangement/colabSVG.svg";
import "./Navbar.css";
import { Navbar, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import ColabAPI from "../../api/colabApi";
function Navigation({ logout }) {
  const currentUser = useSelector(st => st.user.currentUser);

  function loggedInNav() {
    return (
      //   <ul className="navbar-nav ml-auto">
      //     <li className="nav-item mr-4">
      //       <NavLink className="nav-link" to={`/dashboard`}>
      //         Dashboard
      //       </NavLink>
      //     </li>
      //     <li className="nav-item mr-4">
      //       <NavLink className="nav-link" to="/profile">
      //         Profile
      //       </NavLink>
      //     </li>
      //     <li className="nav-item">
      //       <Link className="nav-link" to="/" onClick={() => console.log("loggedOut")}>
      //         Log out
      //       </Link>
      //     </li>
      //   </ul>
      <>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link>
              <NavLink className="nav-link" to={`/dashboard`}>
                Dashboard
              </NavLink>
            </Nav.Link>
            <Nav.Link>
              <NavLink className="nav-link" to="/profile">
                Profile
              </NavLink>
            </Nav.Link>

            <Nav.Link>
              <Link className="nav-link" to="/" onClick={logout}>
                Log out
              </Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </>
    );
  }
  function loggedOutNav() {
    return (
      <>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="mr-auto" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link eventKey="0">
              <NavLink className="nav-link" to="/login">
                Login
              </NavLink>
            </Nav.Link>
            <Nav.Link eventKey="1">
              <NavLink className="nav-link" to="/register">
                Sign Up
              </NavLink>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </>
    );
  }

  return (
    <Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand>
        <Link
          to={currentUser.username ? "/dashboard" : "/"}
          style={{ color: "white", textDecoration: "none" }}
        >
          <img
            src={Logo}
            width="30"
            height="30"
            className="d-inline-block align-top img"
            alt="React Bootstrap logo"
          />{" "}
          Co-Lab
        </Link>
      </Navbar.Brand>

      {currentUser.username ? loggedInNav() : loggedOutNav()}
    </Navbar>
  );
}

export default Navigation;
