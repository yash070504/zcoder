import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiBookmark, FiShare2, FiMessageCircle } from "react-icons/fi"; // Import icons from react-icons
import { FaFacebook } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
//import "./Intro.css";
import { FaInstagram } from "react-icons/fa6";
import "../styles/Intro.css";
function Intro() {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/login");
  };
  return (
    <div className="container">
      {/* Navigation Bar */}

      {/* Hero Section */}
      <section className="hero">
        <div></div>
        <div className="hero-content">
          <h2>Welcome to ZCoder</h2>
          <p>Empower Your Coding Experience</p>
          <button className="get-started-btn" onClick={() => onClick()}>
            Get Started
          </button>
        </div>
        <div className="hero-image">
          <div style={{ height: "50%" }}>
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
              alt="Developer at work"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="feature  intro-feature">
          <FiUser size={64} />
          <h3>Create Profiles</h3>
          <p>Build your coding identity and showcase your skills.</p>
          {/* <button className="feature-btn" onClick={() => onClick()}>
            Create Your Profile
          </button> */}
        </div>
        <div className="feature intro-feature">
          <FiBookmark size={64} />
          <h3>Bookmark Problems</h3>
          <p>Save coding problems and solutions for future reference.</p>
          {/* <button className="feature-btn" onClick={() => onClick()}>
            Start Bookmarking
          </button> */}
        </div>
        <div className="feature intro-feature">
          <FiShare2 size={64} />
          <h3>Share Solutions</h3>
          <p>Contribute by sharing your coding solutions with others.</p>
          {/* <button className="feature-btn" onClick={() => onClick()}>
            Share Your Solutions
          </button> */}
        </div>
        <div className="feature intro-feature">
          <FiMessageCircle size={64} />
          <h3>Collaborate and Comment</h3>
          <p>Engage in discussions and provide feedback on solutions.</p>
          {/* <button className="feature-btn" onClick={() => onClick()}>
            Join the Discussion
          </button> */}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#contact">Contact Us</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
        <div className="social-links">
          {/* Replace with actual social media icons */}
          <a href="#facebook">
            <FaFacebook />
          </a>
          <a href="#twitter">
            <FaTwitter />
          </a>
          <a href="#instagram">
            <FaInstagram />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Intro;
