import React from "react";
import "./Footer.css";
import Logo from "../../assets/evlove logo.png";
 
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaArrowRight,
  FaBriefcase,
  FaUsers,
  FaGraduationCap,
} from "react-icons/fa";
 
export default function Footer() {
  return (
    <footer className="jp-footer">
      <div className="jp-footer-container">
        <div className="jp-footer-col jp-footer-brand">
          <div className="jp-footer-logo-wrap">
            <img src={Logo} alt="Evolve Logo" className="jp-footer-logo-img" />
          </div>
 
          <p className="jp-footer-desc">
            Job Portal connects talented freshers and experienced professionals
            with leading companies. Find your dream job or hire the best talent
            with ease, speed, and confidence.
          </p>
 
          <div className="jp-footer-stats">
            <div className="jp-footer-stat-card">
              <FaBriefcase />
              <span>10K+ Jobs</span>
            </div>
 
            <div className="jp-footer-stat-card">
              <FaUsers />
              <span>5K+ Companies</span>
            </div>
 
            <div className="jp-footer-stat-card">
              <FaGraduationCap />
              <span>20K+ Candidates</span>
            </div>
          </div>
 
          <div className="jp-contact-info">
            <p>
              <FaMapMarkerAlt /> Hyderabad, India
            </p>
            <p>
              <FaEnvelope /> hirenex5@gmail.com
            </p>
            <p>
              <FaPhoneAlt /> +91 6301408578
            </p>
          </div>
 
          <div className="jp-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
            {/* <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedinIn />
            </a> */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
          </div>
        </div>
 
        <div className="jp-footer-col">
          <h3>For Job Seekers</h3>
          <ul>
            <li><a href="/jobs"><FaArrowRight /> Browse Jobs</a></li>
            <li><a href="/CompanyPage"><FaArrowRight /> Top Companies</a></li>
            <li><a href="/jobs"><FaArrowRight /> Fresher Jobs</a></li>
            <li><a href="/InternshipPage"><FaArrowRight /> Internships</a></li>
            {/* <li><a href="/courses"><FaArrowRight /> Placement Courses</a></li> */}
          </ul>
        </div>
 
        <div className="jp-footer-col">
          <h3>For Companies</h3>
          <ul>
            <li><a href="/postjob"><FaArrowRight /> Post a Job</a></li>
            <li><a href="/pricing-page"><FaArrowRight /> Pricing</a></li>
            <li><a href="/recruitment-solutions"><FaArrowRight /> Recruitment Solutions</a></li>
            <li><a href="/contact-sales"><FaArrowRight /> Contact Sales</a></li>
          </ul>
        </div>
 
        <div className="jp-footer-col">
          <h3>Support & Info</h3>
          <ul>
            <li><a href="/help-support"><FaArrowRight /> Help & Support</a></li>
            <li><a href="/privacy-policy"><FaArrowRight /> Privacy Policy</a></li>
            <li><a href="/terms-conditions"><FaArrowRight /> Terms & Conditions</a></li>
            <li><a href="/contactus"><FaArrowRight /> Contact Us</a></li>
            <li><a href="/blogs"><FaArrowRight /> Blog</a></li>
          </ul>
        </div>
      </div>
 
      <div className="jp-footer-bottom">
        <p>© 2026 EVOLVE Job Portal. All rights reserved.</p>
        <p className="jp-footer-bottom-text">
          Made for freshers and professionals
        </p>
      </div>
    </footer>
  );
}
 