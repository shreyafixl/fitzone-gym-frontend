import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import Benefits from "../components/Benefits";
import Classes from "../components/Classes";
import Pricing from "../components/Pricing";
import facilitiesData from "../data/facilitiesData";
import testimonialsData from "../data/testimonialsData";
import galleryData from "../data/galleryData";

function Home() {
  const previewFacilities = facilitiesData.slice(0, 4);
  const previewTestimonials = testimonialsData.slice(0, 3);
  const previewGallery = galleryData.slice(0, 6);

  return (
    <main>
      <Hero />
      <Benefits />

      {/* Classes Preview */}
      <Classes preview={true} />

      {/* Facilities Preview */}
      <section className="facilities-preview-section" aria-labelledby="facilities-preview-heading">
        <div className="section-container">
          <div className="section-header">
            <h2 id="facilities-preview-heading" className="section-title">World-Class Facilities</h2>
            <p className="section-subtitle">
              Everything you need for a complete fitness experience — all under one roof.
            </p>
          </div>
          <div className="facilities-preview-grid">
            {previewFacilities.map((facility) => (
              <div className="facility-preview-card" key={facility.id}>
                <span className="facility-icon" aria-hidden="true">{facility.icon}</span>
                <h3>{facility.title}</h3>
                <p>{facility.description}</p>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/facilities" className="btn btn-primary">Explore All Facilities</Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <Pricing preview={true} />

      {/* Testimonials Preview */}
      <section className="testimonials-preview-section" aria-labelledby="testimonials-preview-heading">
        <div className="section-container">
          <div className="section-header">
            <h2 id="testimonials-preview-heading" className="section-title">What Our Members Say</h2>
            <p className="section-subtitle">
              Real stories from real people who transformed their lives at FitZone.
            </p>
          </div>
          <div className="testimonials-preview-grid">
            {previewTestimonials.map((t) => (
              <blockquote className="testimonial-preview-card" key={t.id}>
                <div className="testimonial-stars" aria-label={`${t.rating} out of 5 stars`}>
                  {"★".repeat(t.rating)}
                </div>
                <p>"{t.review}"</p>
                <footer>
                  <strong>{t.name}</strong>
                  <span>{t.goal} · {t.duration}</span>
                </footer>
              </blockquote>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/testimonials" className="btn btn-outline">Read More Stories</Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="gallery-preview-section" aria-labelledby="gallery-preview-heading">
        <div className="section-container">
          <div className="section-header">
            <h2 id="gallery-preview-heading" className="section-title">Inside FitZone</h2>
            <p className="section-subtitle">Take a look at our state-of-the-art gym and facilities.</p>
          </div>
          <div className="gallery-preview-grid">
            {previewGallery.map((item) => (
              <div className="gallery-preview-item" key={item.id}>
                <img src={item.image} alt={item.alt} loading="lazy" />
                <div className="gallery-overlay">
                  <span>{item.category}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/gallery" className="btn btn-primary">View Full Gallery</Link>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="cta-banner" aria-labelledby="cta-banner-heading">
        <div className="section-container cta-banner-content">
          <h2 id="cta-banner-heading">Ready to Start Your Fitness Journey?</h2>
          <p>Join thousands of members who have already transformed their lives at FitZone.</p>
          <div className="hero-cta-group">
            <Link to="/contact" className="btn btn-primary">Get a Free Trial</Link>
            <Link to="/pricing" className="btn btn-secondary">View Plans</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
