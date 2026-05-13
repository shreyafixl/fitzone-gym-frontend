import { Link } from "react-router-dom";

function AboutPage() {
  const stats = [
    { value: "10+", label: "Years of Excellence" },
    { value: "5,000+", label: "Active Members" },
    { value: "50+", label: "Certified Trainers" },
    { value: "25,000", label: "Sq. Ft. Facility" },
    { value: "100+", label: "Weekly Classes" },
    { value: "98%", label: "Member Satisfaction" }
  ];

  const values = [
    { icon: "🏆", title: "Excellence in Training", desc: "We hold ourselves to the highest standards in coaching, equipment, and member experience." },
    { icon: "❤️", title: "Member-Centered Support", desc: "Every decision we make starts with one question: how does this help our members succeed?" },
    { icon: "🤝", title: "Integrity & Trust", desc: "We are transparent, honest, and committed to delivering on every promise we make." },
    { icon: "🌱", title: "Community Growth", desc: "We believe fitness is better together — we build a culture of encouragement and accountability." },
    { icon: "💡", title: "Innovation in Fitness", desc: "We continuously evolve our programs, equipment, and facilities to stay ahead of the curve." }
  ];

  return (
    <main className="about-page">

      {/* Page Hero */}
      <section className="page-hero" aria-labelledby="about-heading">
        <div className="section-container">
          <h1 id="about-heading">About FitZone Gym</h1>
          <p>
            For over a decade, FitZone has been the fitness home for thousands of members —
            from first-time gym-goers to competitive athletes. We are more than a gym.
            We are a community built on results, respect, and relentless improvement.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="about-story-section" aria-labelledby="story-heading">
        <div className="section-container about-story-grid">
          <div className="about-story-text">
            <h2 id="story-heading" className="section-title">Our Story</h2>
            <p>
              Founded in 2015 by fitness coach Arjun Rao, FitZone began as a single training
              studio with a simple belief: everyone deserves access to world-class fitness guidance,
              regardless of their starting point.
            </p>
            <p>
              What started as a 2,000 sq. ft. studio has grown into a 25,000 sq. ft. premium
              fitness center with 50+ certified trainers, 200+ pieces of equipment, and a
              thriving community of over 5,000 active members.
            </p>
            <p>
              Today, FitZone is recognized as the city's most trusted fitness destination —
              not just for our facilities, but for the genuine care we put into every member's journey.
            </p>
          </div>
          <div className="about-story-image">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
              alt="FitZone gym interior showing modern equipment"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section" aria-labelledby="stats-heading">
        <div className="section-container">
          <h2 id="stats-heading" className="section-title">Our Achievements</h2>
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div className="stat-card" key={i}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section" aria-labelledby="mission-heading">
        <div className="section-container mission-vision-grid">
          <div className="mission-card">
            <span aria-hidden="true">🎯</span>
            <h2 id="mission-heading">Our Mission</h2>
            <p>
              To inspire healthier lifestyles by delivering accessible, high-quality fitness
              experiences backed by expert guidance, premium facilities, and a supportive community.
            </p>
          </div>
          <div className="mission-card">
            <span aria-hidden="true">🔭</span>
            <h2>Our Vision</h2>
            <p>
              To become the most trusted fitness destination in the region by continuously
              evolving in training excellence, member support, and wellness innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section" aria-labelledby="values-heading">
        <div className="section-container">
          <h2 id="values-heading" className="section-title">Our Core Values</h2>
          <div className="values-grid">
            {values.map((v, i) => (
              <div className="value-card" key={i}>
                <span className="value-icon" aria-hidden="true">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner" aria-labelledby="about-cta-heading">
        <div className="section-container cta-banner-content">
          <h2 id="about-cta-heading">Become Part of the FitZone Family</h2>
          <p>Start your journey today with a free trial session — no commitment required.</p>
          <div className="hero-cta-group">
            <Link to="/contact" className="btn btn-primary">Book Free Trial</Link>
            <Link to="/trainers" className="btn btn-secondary">Meet Our Trainers</Link>
          </div>
        </div>
      </section>

    </main>
  );
}

export default AboutPage;
