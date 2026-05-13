import Pricing from "../components/Pricing";
import { Link } from "react-router-dom";

function PricingPage() {
  const comparisonFeatures = [
    { feature: "Gym Access", monthly: "6AM–10PM", quarterly: "6AM–10PM", halfYearly: "6AM–10PM", annual: "24/7" },
    { feature: "Group Classes", monthly: "2/week", quarterly: "Unlimited", halfYearly: "Unlimited", annual: "Unlimited" },
    { feature: "Personal Training", monthly: "—", quarterly: "1/month", halfYearly: "2/month", annual: "Unlimited" },
    { feature: "Nutrition Consultation", monthly: "—", quarterly: "✓", halfYearly: "✓", annual: "✓" },
    { feature: "Steam Room", monthly: "—", quarterly: "—", halfYearly: "✓", annual: "✓" },
    { feature: "Dedicated Locker", monthly: "—", quarterly: "—", halfYearly: "✓", annual: "✓" },
    { feature: "Custom Meal Plan", monthly: "—", quarterly: "—", halfYearly: "—", annual: "✓" },
    { feature: "Guest Pass", monthly: "—", quarterly: "1/month", halfYearly: "2/month", annual: "4/month" }
  ];

  return (
    <main className="pricing-page">

      <section className="page-hero" aria-labelledby="pricing-heading">
        <div className="section-container">
          <h1 id="pricing-heading">Membership Plans</h1>
          <p>
            Transparent pricing with no hidden fees. Choose the plan that fits your
            goals and budget — upgrade or change anytime.
          </p>
        </div>
      </section>

      <Pricing />

      {/* Comparison Table */}
      <section className="comparison-section" aria-labelledby="comparison-heading">
        <div className="section-container">
          <h2 id="comparison-heading" className="section-title">Plan Comparison</h2>
          <div className="table-wrapper">
            <table className="comparison-table" aria-label="Membership plan feature comparison">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Monthly</th>
                  <th scope="col">Quarterly</th>
                  <th scope="col">Half-Yearly</th>
                  <th scope="col">Annual</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr key={i}>
                    <td>{row.feature}</td>
                    <td>{row.monthly}</td>
                    <td>{row.quarterly}</td>
                    <td>{row.halfYearly}</td>
                    <td>{row.annual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="cta-banner" aria-labelledby="pricing-cta-heading">
        <div className="section-container cta-banner-content">
          <h2 id="pricing-cta-heading">Not Sure Which Plan is Right for You?</h2>
          <p>Talk to our team — we'll help you find the perfect fit for your goals and budget.</p>
          <Link to="/contact" className="btn btn-primary">Talk to Us</Link>
        </div>
      </section>

    </main>
  );
}

export default PricingPage;
