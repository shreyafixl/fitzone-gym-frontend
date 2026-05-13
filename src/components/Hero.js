import { Link } from "react-router-dom";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { memo } from "react";

// Memoize stat component
const HeroStat = memo(function HeroStat({ value, label, delay }) {
  return (
    <div className="hero-stat" style={{ animationDelay: `${delay}ms` }}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
});

function Hero() {
  const [ref, isVisible] = useScrollAnimation({ once: true });

  return (
    <section className="hero" aria-label="Hero section" ref={ref}>
      <div className={`hero-content ${isVisible ? 'hero-visible' : ''}`}>
        <span className="hero-badge">🏆 #1 Rated Gym in the City</span>
        <h1 className="hero-title">
          Transform Your Body,<br />
          <span className="hero-accent">Build Your Strength</span>
        </h1>
        <p className="hero-subtitle">
          Join a modern gym with certified trainers, premium equipment, and flexible
          fitness programs designed to help you reach your goals — faster.
        </p>

        <div className="hero-cta-group">
          <Link to="/classes" className="btn btn-primary">
            Explore Classes
          </Link>
          <Link to="/pricing" className="btn btn-secondary">
            View Membership Plans
          </Link>
        </div>

        <div className="hero-stats">
          <HeroStat value="5,000+" label="Active Members" delay={100} />
          <HeroStat value="50+" label="Expert Trainers" delay={200} />
          <HeroStat value="100+" label="Weekly Classes" delay={300} />
          <HeroStat value="10+" label="Years of Excellence" delay={400} />
        </div>
      </div>
    </section>
  );
}

export default Hero;
