import { Link } from "react-router-dom";
import testimonialsData from "../data/testimonialsData";

function TestimonialsPage() {
  return (
    <main className="testimonials-page">

      <section className="page-hero" aria-labelledby="testimonials-heading">
        <div className="section-container">
          <h1 id="testimonials-heading">Member Success Stories</h1>
          <p>
            Real results from real people. Hear from the FitZone community about
            how their fitness journey has changed their lives.
          </p>
        </div>
      </section>

      <section className="testimonials-content-section" aria-labelledby="testimonials-list-heading">
        <div className="section-container">
          <h2 id="testimonials-list-heading" className="sr-only">Testimonials</h2>
          <div className="testimonials-grid">
            {testimonialsData.map((t) => (
              <blockquote className="testimonial-card" key={t.id}>
                <div className="testimonial-header">
                  <div className="testimonial-avatar" aria-hidden="true">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <strong className="testimonial-name">{t.name}</strong>
                    <span className="testimonial-goal">{t.goal}</span>
                  </div>
                </div>
                <div className="testimonial-stars" aria-label={`${t.rating} out of 5 stars`}>
                  {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                </div>
                <p className="testimonial-review">"{t.review}"</p>
                <footer className="testimonial-footer">
                  <span>{t.duration}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner" aria-labelledby="testimonials-cta-heading">
        <div className="section-container cta-banner-content">
          <h2 id="testimonials-cta-heading">Your Success Story Starts Here</h2>
          <p>Join FitZone today and become our next transformation story.</p>
          <div className="hero-cta-group">
            <Link to="/contact" className="btn btn-primary">Start Your Journey</Link>
            <Link to="/pricing" className="btn btn-secondary">View Plans</Link>
          </div>
        </div>
      </section>

    </main>
  );
}

export default TestimonialsPage;
