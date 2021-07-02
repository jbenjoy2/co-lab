import React from "react";
import Logo from "./ColabLogo.png";
import "./LandingPage.css";
import UserDashboard from "./LandingPagePhotos/UserDashboard.png";
import ProjectMain from "./LandingPagePhotos/ProjectMain.png";
import rhyme from "./LandingPagePhotos/rhymes.png";
import quote from "./LandingPagePhotos/quote.png";
import collaborate from "./LandingPagePhotos/collaborate.png";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
function LandingPage() {
  return (
    <div style={{ overflowY: "scroll", height: "95vh" }}>
      <Helmet>
        <title>Colab - Home</title>
        <meta
          name="descrition"
          content="Welcome to Colab, a brainstorming suite for songwriters and creatives!"
        />
      </Helmet>
      <div className="text-center mt-5" style={{ overflowY: "scroll", height: "100%" }}>
        <h1 className="text-light" style={{ letterSpacing: "1rem" }}>
          WELCOME TO
        </h1>
        <img
          src={Logo}
          className="img-fluid"
          style={{ borderBottom: "3px dashed white" }}
          width="350"
        />
        <div className="container mt-4 text-light" style={{ fontSize: "1.5rem" }}>
          <p>
            Colab is a collaborative songwriting brainstorming suite! With everything you need to
            get your ideas flowing, it's the perfect way to begin the process of writing and
            arranging your next smash hit.
          </p>
          <p className="text-center">
            <Link to="/login">Log in</Link> or <Link to="/register">sign up</Link> to get started!
          </p>
        </div>
      </div>

      <hr className="main-divider" />
      <div className="pimg1">
        <div className="ptext">
          <span className="ptext-border">User Dashboard</span>
        </div>
      </div>
      <section className="section">
        <h2>User Dashboard</h2>
        <p>
          Your user dashboard is where you can access all of your works-in-progress. Here you will
          also find any pending requests for potential cowrites
        </p>
      </section>
      <div className="pimg2">
        <div className="ptext">
          <span className="ptext-border">Project</span>
        </div>
      </div>
      <section className="section section-light">
        <h2>Main Project Page</h2>
        <p>
          The main project page is a songwriting suite! It contains everything you may need to get
          the creative juices flowing, including a RhymeZone™-powered rhyme finder, an inspirational
          quote generator, and a way to invite fellow songwriters to collaborate with you on your
          artistic genius
        </p>
      </section>
      <div className="pimg3">
        <div className="ptext">
          <span className="ptext-border">Rhyme</span>
        </div>
      </div>
      <div className="pimg4">
        <div className="ptext">
          <span className="ptext-border">Inspire</span>
        </div>
      </div>
      <div className="pimg5">
        <div className="ptext">
          <span className="ptext-border">Collaborate</span>
        </div>
      </div>
      <div className="pimg6">
        <div className="ptext">
          <span className="ptext-border">Arrange</span>
        </div>
      </div>
      <section className="section section-light">
        <h2>Arrangement Lab</h2>
        <p>
          Use the Arrangement Lab to click and drag song sections into your preferred hypothetical
          arrangement. As the song develops and the arrangement changes, feel free to keep track of
          those changes by reordering the tiles as necessary!
        </p>
      </section>
      <div className="pimg7">
        <div className="ptext last">
          <span className="ptext-border bottom-span">
            What are you waiting for? <Link to="/register">Let's get started!</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
