import { useState } from "react";
import galleryData from "../data/galleryData";

function GalleryPage() {
  const categories = ["All", ...new Set(galleryData.map((g) => g.category))];
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState(null);

  const filtered =
    activeCategory === "All"
      ? galleryData
      : galleryData.filter((g) => g.category === activeCategory);

  const openLightbox = (item) => setLightbox(item);
  const closeLightbox = () => setLightbox(null);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") closeLightbox();
  };

  return (
    <main className="gallery-page">

      <section className="page-hero" aria-labelledby="gallery-heading">
        <div className="section-container">
          <h1 id="gallery-heading">Gym Gallery</h1>
          <p>
            Take a visual tour of FitZone — our workout floors, equipment, group classes,
            and the community that makes it all worth it.
          </p>
        </div>
      </section>

      <section className="gallery-content-section" aria-labelledby="gallery-list-heading">
        <div className="section-container">

          <div className="filter-bar" role="group" aria-label="Filter gallery by category">
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

          <h2 id="gallery-list-heading" className="sr-only">Gallery Images</h2>

          <div className="gallery-grid">
            {filtered.map((item) => (
              <button
                key={item.id}
                className="gallery-item"
                onClick={() => openLightbox(item)}
                aria-label={`View larger: ${item.alt}`}
              >
                <img src={item.image} alt={item.alt} loading="lazy" />
                <div className="gallery-overlay">
                  <span>{item.category}</span>
                  <span className="gallery-zoom" aria-hidden="true">🔍</span>
                </div>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Close image viewer"
            >
              ✕
            </button>
            <img src={lightbox.image} alt={lightbox.alt} />
            <p className="lightbox-caption">{lightbox.alt} · {lightbox.category}</p>
          </div>
        </div>
      )}

    </main>
  );
}

export default GalleryPage;
