import { Link } from "react-router-dom";
import facilitiesData from "../data/facilitiesData";

function FacilitiesPage() {
  return (
    <main className="facilities-page">

      <section className="page-hero" aria-labelledby="facilities-heading">
        <div className="section-container">
          <h1 id="facilities-heading">Premium Facilities</h1>
          <p>
            Beyond the workout floor — explore the world-class amenities that make
            FitZone a complete fitness experience.
          </p>
        </div>
      </section>

      <section className="facilities-content-section" aria-labelledby="facilities-list-heading">
        <div className="section-container">
          <h2 id="facilities-list-heading" className="sr-only">Facilities List</h2>
          <div className="facilities-grid">
            {facilitiesData.map((facility) => (
              <article className="facility-card" key={facility.id}>
                <div className="facility-card-img-wrap">
                  <img src={facility.image} alt={facility.title} loading="lazy" />
                </div>
                <div className="facility-card-body">
                  <span className="facility-icon-large" aria-hidden="true">{facility.icon}</span>
                  <h3>{facility.title}</h3>
                  <p>{facility.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner" aria-labelledby="facilities-cta-heading">
        <div className="section-container cta-banner-content">
          <h2 id="facilities-cta-heading">Experience It for Yourself</h2>
          <p>Visit FitZone and see why our members never want to leave.</p>
          <div className="hero-cta-group">
            <Link to="/contact" className="btn btn-primary">Book a Visit</Link>
            <Link to="/pricing" className="btn btn-secondary">View Membership Plans</Link>
          </div>
        </div>
      </section>

    </main>
  );
}

export default FacilitiesPage;
