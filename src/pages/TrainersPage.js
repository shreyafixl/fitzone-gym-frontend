import { useState, useMemo, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import trainersData from "../data/trainersData";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useDebounce } from "../hooks/useDebounce";

// Memoized TrainerCard component
const TrainerCard = memo(function TrainerCard({ trainer }) {
  const [ref, isVisible] = useScrollAnimation({ once: true, threshold: 0.2 });

  return (
    <article 
      ref={ref}
      className={`trainer-card ${isVisible ? 'fade-in-up' : ''}`} 
      key={trainer.id}
    >
      <div className="trainer-card-img-wrap">
        <img 
          src={trainer.image} 
          alt={`${trainer.name}, ${trainer.specialization} trainer`} 
          loading="lazy" 
        />
      </div>
      <div className="trainer-card-body">
        <h3>{trainer.name}</h3>
        <span className="trainer-specialization">{trainer.specialization}</span>
        <div className="trainer-meta">
          <span>🏅 {trainer.experience} Experience</span>
          <span>📜 {trainer.certification}</span>
        </div>
        <p className="trainer-bio">{trainer.bio}</p>
        <a
          href={trainer.social}
          className="btn btn-outline trainer-social-btn"
          aria-label={`View ${trainer.name}'s social profile`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Profile
        </a>
      </div>
    </article>
  );
});

function TrainersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Get unique specializations
  const specializations = useMemo(() => 
    ['All', ...new Set(trainersData.map(t => t.specialization))],
    []
  );

  // Filter trainers
  const filteredTrainers = useMemo(() => {
    let filtered = trainersData;

    if (debouncedSearch) {
      filtered = filtered.filter(trainer =>
        trainer.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        trainer.specialization.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        trainer.bio.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (selectedSpecialization !== 'All') {
      filtered = filtered.filter(trainer => 
        trainer.specialization === selectedSpecialization
      );
    }

    return filtered;
  }, [debouncedSearch, selectedSpecialization]);

  const handleReset = useCallback(() => {
    setSearchQuery('');
    setSelectedSpecialization('All');
  }, []);

  return (
    <main className="trainers-page">
      <section className="page-hero" aria-labelledby="trainers-heading">
        <div className="section-container">
          <h1 id="trainers-heading">Meet Our Expert Trainers</h1>
          <p>
            Our certified coaches bring years of experience, passion, and proven results.
            They are here to guide, motivate, and push you to your best.
          </p>
        </div>
      </section>

      <section className="trainers-content-section" aria-labelledby="trainers-list-heading">
        <div className="section-container">
          <h2 id="trainers-list-heading" className="sr-only">Trainer Profiles</h2>
          
          {/* Filters */}
          <div className="classes-filters">
            <input
              type="text"
              placeholder="Search trainers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-search"
              aria-label="Search trainers"
            />
            
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="filter-select"
              aria-label="Filter by specialization"
            >
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            <button
              onClick={handleReset}
              className="btn btn-outline"
            >
              Reset Filters
            </button>
          </div>

          <div className="trainers-grid">
            {filteredTrainers.length > 0 ? (
              filteredTrainers.map((trainer) => (
                <TrainerCard key={trainer.id} trainer={trainer} />
              ))
            ) : (
              <p className="no-results">No trainers found matching your criteria.</p>
            )}
          </div>
        </div>
      </section>

      <section className="cta-banner" aria-labelledby="trainers-cta-heading">
        <div className="section-container cta-banner-content">
          <h2 id="trainers-cta-heading">Train with the Best</h2>
          <p>Book a personal training session and start your transformation today.</p>
          <Link to="/contact" className="btn btn-primary">Book a Session</Link>
        </div>
      </section>
    </main>
  );
}

export default TrainersPage;
