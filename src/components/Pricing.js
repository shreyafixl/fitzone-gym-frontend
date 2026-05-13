import { Link } from "react-router-dom";
import pricingData from "../data/pricingData";

function Pricing({ preview = false }) {
  const displayPlans = preview ? pricingData.slice(0, 3) : pricingData;

  return (
    <section className="pricing-section" aria-labelledby="pricing-heading">
      <div className="section-container">
        <div className="section-header">
          <h2 id="pricing-heading" className="section-title">Membership Plans</h2>
          <p className="section-subtitle">
            Flexible plans for every budget and commitment level. No hidden fees, no surprises.
          </p>
        </div>

        <div className="pricing-grid">
          {displayPlans.map((plan) => (
            <div
              className={`pricing-card ${plan.popular ? "pricing-card--popular" : ""}`}
              key={plan.id}
            >
              {plan.popular && (
                <div className="popular-badge">⭐ Most Popular</div>
              )}
              <div className="pricing-header">
                <h3>{plan.plan}</h3>
                <div className="pricing-price">
                  <span className="price-amount">{plan.price}</span>
                  <span className="price-period">{plan.period}</span>
                </div>
                <p className="pricing-ideal">Ideal for: {plan.idealFor}</p>
              </div>
              <ul className="pricing-features" aria-label={`${plan.plan} features`}>
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <span aria-hidden="true">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className={`btn ${plan.popular ? "btn-primary" : "btn-outline"}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {preview && (
          <div className="section-cta">
            <Link to="/pricing" className="btn btn-primary">See All Plans</Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Pricing;
