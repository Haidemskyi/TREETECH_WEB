"use client";

import { submitApplication } from "@/app/actions/candidates";
import { useState } from "react";
import "./landing.css";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await submitApplication(formData);
      setIsSuccess(true);
      // If submitted from modal, we might want to keep modal open to show success, 
      // or close it and show success on main page? 
      // The user requested "on form not a pop up message", usually implies in-place replacement.
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Close modal handler
  const closeModal = () => {
    setModalOpen(false);
    // Reset success state after a delay so next time they open it, it's a fresh form
    // Or invalidating it immediately.
    if (isSuccess) {
      setTimeout(() => setIsSuccess(false), 300);
    }
  }

  const SuccessMessage = () => (
    <div className="success-message" style={{ textAlign: 'center', padding: '40px 20px', color: 'white', animation: 'fadeIn 0.5s ease' }}>
      <div style={{
        width: '80px',
        height: '80px',
        background: 'var(--primary)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        boxShadow: '0 0 20px rgba(28, 237, 200, 0.4)'
      }}>
        <i className="fas fa-check" style={{ fontSize: '2.5rem', color: '#170D4C', fontStyle: 'normal' }}>✓</i>
      </div>
      <h3 style={{ fontSize: '1.8rem', marginBottom: '10px', color: 'var(--primary)', fontWeight: 800 }}>THANK YOU!</h3>
      <p style={{ fontSize: '1.1rem', color: '#ccc', lineHeight: '1.6' }}>
        Your application has been received.<br />We will be in touch shortly.
      </p>
      <button
        className="btn btn-primary"
        style={{ marginTop: '30px' }}
        onClick={() => { setIsSuccess(false); setModalOpen(false); }}
      >
        Done
      </button>
    </div>
  );

  return (
    <>
      <header>
        <div className="container header-container">
          <div className="logo">
            <span className="logo-icon">
              {/* <img src="/icon 1.png" alt="TreeTech Icon" width="50" height="50" /> */}
              <img src="/icon 1.png" alt="" width="50" height="50" />
            </span>
            <span className="logo-text">
              TREE<span className="highlight">TECH</span>
            </span>
          </div>
          <div className="header-right">
            <div className="social-icons">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="header-cta">
              <button
                className="btn btn-white open-modal-btn"
                onClick={() => setModalOpen(true)}
              >
                Apply Now
              </button>
              <a href="tel:6153141420" className="btn btn-primary">
                (615) 314-1420
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Form overlay */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="placeholder-text">FOTO 1</div>
        </div>
        <div className="container hero-content">
          <div className="hero-text-block">
            <p className="pre-title">GROW WITH US</p>
            <h1 className="main-title">FIELD INSTALLATION SPECIALISTS</h1>
            <ul className="hero-list">
              <li>Competitive Weekly Pay</li>
              <li>24/7 Supervisor Support</li>
              <li>Real Career Advancement</li>
              <li>Company Vehicle Provided</li>
            </ul>
            <div className="hero-buttons">
              <a href="#about-section" className="btn btn-white-outline">
                <i className="fas fa-info-circle"></i> Learn More
              </a>
              <button
                className="btn btn-primary"
                onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <i className="fas fa-check"></i> Join Us
              </button>
            </div>
          </div>

          <div className="hero-form-block" id="apply">
            {isSuccess && !modalOpen ? (
              <SuccessMessage />
            ) : (
              <>
                <div className="form-header">
                  <h3>LET'S GET STARTED!</h3>
                </div>
                <form action={handleSubmit} className="hero-form">
                  <div className="form-row">
                    <input
                      type="text"
                      name="name"
                      placeholder="First Name Last Name"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <input type="email" name="email" placeholder="Email Address" required />
                  </div>
                  <div className="form-row">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      required
                      style={{ flex: 1 }}
                    />
                    <select name="location" style={{ flex: 1 }} defaultValue="">
                      <option value="" disabled>
                        Location (state)
                      </option>
                      <option value="Nashville">Nashville, TN</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <textarea
                      name="experience"
                      placeholder="Experience"
                      rows={2}
                    ></textarea>
                  </div>

                  <div className="checkbox-container">
                    <input type="checkbox" id="future-ops" name="subscribe" />
                    <div className="checkbox-label-block">
                      <label htmlFor="future-ops">EMAIL ME FUTURE OPPORTUNITIES</label>
                      <p className="small-text">
                        Yes, I agree to receive job alerts...
                      </p>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about-section">
        <div className="container about-grid">
          <div className="about-image">
            <div className="placeholder-box">FOTO 2</div>
          </div>
          <div className="about-text">
            <span className="section-label">Who We Are</span>
            <h2>BUILDING THE FUTURE OF CONNECTIVITY</h2>
            <p>
              TREETECH is a leading fulfillment partner for major
              telecommunications providers. We specialize in residential and
              commercial installations, ensuring that every connection is fast,
              meaningful, and reliable.
            </p>
            <p>
              Our team of dedicated professionals is driven by a commitment to
              quality and safety. We don't just clear tickets; we build lasting
              infrastructure.
            </p>
            <div style={{ marginTop: "30px" }}>
              <button
                className="btn-link open-modal-btn"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                onClick={() => setModalOpen(true)}
              >
                Join Our Team <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="value-col">
          <div className="value-bg">
            <div className="placeholder-text-small">FOTO 3</div>
          </div>
          <div className="value-overlay">
            <h3>SAFETY</h3>
          </div>
        </div>
        <div className="value-col active">
          <div className="value-bg">
            <div className="placeholder-text-small">FOTO 4</div>
          </div>
          <div className="value-overlay">
            <h3>QUALITY</h3>
          </div>
        </div>
        <div className="value-col">
          <div className="value-bg">
            <div className="placeholder-text-small">FOTO 5</div>
          </div>
          <div className="value-overlay">
            <h3>SIMPLICITY</h3>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container services-layout">
          <div className="services-info">
            <h2 className="section-heading">
              Our <span className="highlight-bg">Services</span>
            </h2>
            <p className="services-desc">
              TREETECH is a national provider of fulfillment and project
              management services. We deliver top-tier installation solutions
              with a focus on quality, safety, and customer satisfaction.
            </p>
            <div className="service-feature-img">FOTO 6 (Technician)</div>
          </div>

          <div className="services-grid">
            <div className="service-item">
              <span className="service-icon">🛠</span>
              <h4>Cable TV</h4>
              <p
                className="small-text text-center"
                style={{ color: "#777" }}
              >
                Advanced video system configurations.
              </p>
            </div>
            <div className="service-item">
              <span className="service-icon">🚀</span>
              <h4>Internet</h4>
              <p
                className="small-text text-center"
                style={{ color: "#777" }}
              >
                High-speed fiber & coax installations.
              </p>
            </div>
            <div className="service-item">
              <span className="service-icon">📞</span>
              <h4>VOIP</h4>
              <p
                className="small-text text-center"
                style={{ color: "#777" }}
              >
                Clear digital voice solutions.
              </p>
            </div>
            <div className="service-item">
              <span className="service-icon">🔒</span>
              <h4>Security</h4>
              <p
                className="small-text text-center"
                style={{ color: "#777" }}
              >
                Smart home & automation integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Columns */}
      <section className="info-columns-section">
        <div className="container info-grid">
          <div className="info-col">
            <h3 className="info-header">Experienced?</h3>
            <ul className="check-list-small">
              <li>Highest rates on the market!</li>
              <li>Weekly payments!</li>
              <li>Reliable support from our supervisors!</li>
            </ul>
          </div>
          <div className="info-col">
            <h3 className="info-header">Don't have any experience?</h3>
            <ul className="check-list-small">
              <li>We'll pay $500 for your training time!</li>
              <li>Company's vehicle free for 2 weeks!</li>
              <li>Complete uniform provided!</li>
            </ul>
          </div>
          <div className="info-col">
            <h3 className="info-header">Referral program</h3>
            <ul className="check-list-small">
              <li>$400 for a beginner technician</li>
              <li>$400 for an experienced technician</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container text-center">
          <h2 className="cta-title">Come In And Let’s Get Talking!</h2>
          <p className="cta-subtitle">
            We are excited to take you on as a part of our team and will do all
            that is in our power to meet, if not exceed, your expectations.
          </p>
          <button
            className="btn btn-dark-outline"
            onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
          >
            🤝 Welcome On Board
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="contact-footer">
        <div className="container footer-grid">
          <div className="footer-left">
            <div className="footer-brand">
              <span className="logo-icon">📡</span> TREETECH
            </div>
            <p className="footer-desc">
              TreeTech Communications LLC is a national provider of fulfillment,
              construction and project management services to the cable and
              telecommunications industries.
            </p>
            <div className="contact-rows">
              <div className="c-row">
                <span className="c-icon-small">📍</span> Nashville, TN
              </div>
              <div className="c-row">
                <span className="c-icon-small">📞</span> +1 (615) 314-1420
              </div>
              <div className="c-row">
                <span className="c-icon-small">✉</span> hr.treetech@terokar.com
              </div>
            </div>
            <div className="social-row">
              <span></span> <span></span> <span></span>
            </div>
          </div>

          <div className="footer-right">
            <h2 className="footer-heading">Contact Us</h2>
            <form action={handleSubmit} className="footer-form">
              <div className="footer-input-group">
                <span className="input-icon">👤</span>
                <input type="text" name="name" placeholder="Name" required />
              </div>
              <div className="footer-input-group">
                <span className="input-icon">@</span>
                <input type="email" name="email" placeholder="Email" required />
              </div>
              <div className="footer-input-group">
                <span className="input-icon">✎</span>
                <textarea name="message" placeholder="Text" rows={4}></textarea>
              </div>
              <button type="submit" className="btn btn-white-pill" disabled={isSubmitting}>
                SEND ➤
              </button>
            </form>
          </div>
        </div>
        <div className="copyright-row">
          <div className="container">
            <p>&copy; 2026 TreeTech. All rights reserved.</p>
            <div className="policy-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Services</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {modalOpen && (
        <div id="applyModal" className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <span className="close-modal" onClick={closeModal}>
              &times;
            </span>
            <div
              className="hero-form-block"
              style={{
                margin: 0,
                boxShadow: "none",
                width: "100%",
                maxWidth: "450px",
              }}
            >
              {isSuccess && modalOpen ? (
                <SuccessMessage />
              ) : (
                <>
                  <div className="form-header">
                    <h3>LET'S GET STARTED!</h3>
                  </div>
                  <form action={handleSubmit} className="hero-form">
                    <div className="form-row">
                      <input
                        type="text"
                        name="name"
                        placeholder="First Name Last Name"
                        required
                      />
                    </div>
                    <div className="form-row">
                      <input type="email" name="email" placeholder="Email Address" required />
                    </div>
                    <div className="form-row">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        required
                        style={{ flex: 1 }}
                      />
                      <select name="location" style={{ flex: 1 }} defaultValue="">
                        <option value="" disabled>
                          Location (state)
                        </option>
                        <option value="Nashville">Nashville, TN</option>
                      </select>
                    </div>
                    <div className="form-row">
                      <textarea
                        name="experience"
                        placeholder="Experience"
                        rows={2}
                      ></textarea>
                    </div>

                    <div className="checkbox-container">
                      <input type="checkbox" id="future-ops-modal" name="subscribe" />
                      <div className="checkbox-label-block">
                        <label htmlFor="future-ops-modal">
                          EMAIL ME FUTURE OPPORTUNITIES
                        </label>
                        <p className="small-text">Yes, I agree to receive job alerts...</p>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-submit" disabled={isSubmitting}>
                      {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
