import { useState } from "react";
import { Link } from "react-router-dom";
import equipmentData from "../data/equipmentData";

function EquipmentPage() {
  const categories = ["All", ...new Set(equipmentData.map((e) => e.category))];
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? equipmentData
      : equipmentData.filter((e) => e.category === activeCategory);

  return (
    <main className="equipment-page">

      <section className="page-hero" aria-labelledby="equipment-heading">
        <div className="section-container">
          <h1 id="equipment-heading">Our Equipment</h1>
          <p>
            Explore 200+ premium machines and tools across cardio, strength, functional training,
            and recovery — everything you need to reach your goals.
          </p>
        </div>
      </section>

      <section className="equipment-content-section" aria-labelledby="equipment-list-heading">
        <div className="section-container">

          <div className="filter-bar" role="group" aria-label="Filter equipment by category">
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
            Showing {filtered.length} item{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
          </p>

          <h2 id="equipment-list-heading" className="sr-only">Equipment List</h2>

          <div className="equipment-grid">
            {filtered.map((item) => (
              <article className="equipment-card" key={item.id}>
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="equipment-card-body">
                  <span className="equipment-category-tag">{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p className="equipment-target">
                    <strong>Targets:</strong> {item.targetArea}
                  </p>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      <section className="cta-banner" aria-labelledby="equipment-cta-heading">
        <div className="section-container cta-banner-content">
          <h2 id="equipment-cta-heading">Want to Try Our Equipment?</h2>
          <p>Book a free trial session and experience our facilities firsthand.</p>
          <Link to="/contact" className="btn btn-primary">Book Free Trial</Link>
        </div>
      </section>

    </main>
  );
}

export default EquipmentPage;
