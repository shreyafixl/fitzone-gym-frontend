import { useState } from "react";
import { Link } from "react-router-dom";
import classesData from "../data/classesData";

function ClassesPage() {
  const categories = ["All", ...new Set(classesData.map((c) => c.category))];
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? classesData
      : classesData.filter((c) => c.category === activeCategory);

  const difficultyColor = {
    Beginner: "#22c55e",
    Intermediate: "#f97316",
    Advanced: "#ef4444"
  };

  return (
    <main className="classes-page">

      <section className="page-hero" aria-labelledby="classes-page-heading">
        <div className="section-container">
          <h1 id="classes-page-heading">Fitness Classes</h1>
          <p>
            From beginner-friendly yoga to advanced CrossFit — explore all our programs
            and find the perfect class for your goals.
          </p>
        </div>
      </section>

      <section className="classes-content-section" aria-labelledby="classes-list-heading">
        <div className="section-container">

          {/* Filter Buttons */}
          <div className="filter-bar" role="group" aria-label="Filter classes by category">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? "filter-btn--active" : ""}`}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="results-count" aria-live="polite">
            Showing {filtered.length} class{filtered.length !== 1 ? "es" : ""}
            {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
          </p>

          <h2 id="classes-list-heading" className="sr-only">Class List</h2>

          <div className="class-grid">
            {filtered.map((cls) => (
              <article className="class-card" key={cls.id}>
                <div className="class-card-img-wrap">
                  <img src={cls.image} alt={cls.name} loading="lazy" />
                  <span
                    className="difficulty-badge"
                    style={{ backgroundColor: difficultyColor[cls.difficulty] }}
                  >
                    {cls.difficulty}
                  </span>
                </div>
                <div className="class-card-body">
                  <span className="class-category">{cls.category}</span>
                  <h3>{cls.name}</h3>
                  <p>{cls.description}</p>
                  <div className="class-meta">
                    <span>⏱ {cls.duration}</span>
                    <span>👤 {cls.trainer}</span>
                  </div>
                  <div className="class-benefits">
                    {cls.benefits.map((b, i) => (
                      <span className="benefit-tag" key={i}>{b}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="no-results">No classes found in this category.</p>
          )}

        </div>
      </section>

      <section className="cta-banner" aria-labelledby="classes-cta-heading">
        <div className="section-container cta-banner-content">
          <h2 id="classes-cta-heading">Ready to Join a Class?</h2>
          <p>Contact us to book your first session or ask about class schedules.</p>
          <Link to="/contact" className="btn btn-primary">Book a Class</Link>
        </div>
      </section>

    </main>
  );
}

export default ClassesPage;
