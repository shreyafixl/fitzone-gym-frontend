import { useState, useMemo, useCallback, useReducer, memo } from "react";
import { Link } from "react-router-dom";
import classesData from "../data/classesData";
import Modal from "./Modal";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useDebounce } from "../hooks/useDebounce";
import { filterReducer, filterInitialState } from "../reducers/filterReducer";

// Memoized ClassCard component
const ClassCard = memo(function ClassCard({ cls, onViewDetails }) {
  const [ref, isVisible] = useScrollAnimation({ once: true, threshold: 0.2 });
  
  const difficultyColor = {
    Beginner: "#22c55e",
    Intermediate: "#f97316",
    Advanced: "#ef4444"
  };

  return (
    <article 
      ref={ref}
      className={`class-card ${isVisible ? 'fade-in-up' : ''}`} 
      key={cls.id}
    >
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
        <button 
          className="btn btn-outline"
          onClick={() => onViewDetails(cls)}
        >
          View Details
        </button>
      </div>
    </article>
  );
});

function Classes({ preview = false }) {
  const [state, dispatch] = useReducer(filterReducer, filterInitialState);
  const [selectedClass, setSelectedClass] = useState(null);
  const debouncedSearch = useDebounce(state.searchQuery, 300);

  // Get unique categories and difficulties
  const categories = useMemo(() => 
    ['All', ...new Set(classesData.map(c => c.category))],
    []
  );

  const difficulties = useMemo(() => 
    ['All', ...new Set(classesData.map(c => c.difficulty))],
    []
  );

  // Filter and sort classes with useMemo for performance
  const filteredClasses = useMemo(() => {
    let filtered = classesData;

    // Apply search filter
    if (debouncedSearch) {
      filtered = filtered.filter(cls =>
        cls.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        cls.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        cls.trainer.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Apply category filter
    if (state.selectedCategory !== 'All') {
      filtered = filtered.filter(cls => cls.category === state.selectedCategory);
    }

    // Apply difficulty filter
    if (state.selectedDifficulty !== 'All') {
      filtered = filtered.filter(cls => cls.difficulty === state.selectedDifficulty);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (state.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (state.sortBy === 'duration') {
        return parseInt(a.duration) - parseInt(b.duration);
      }
      return 0;
    });

    return preview ? filtered.slice(0, 3) : filtered;
  }, [debouncedSearch, state.selectedCategory, state.selectedDifficulty, state.sortBy, preview]);

  const handleViewDetails = useCallback((cls) => {
    setSelectedClass(cls);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedClass(null);
  }, []);

  return (
    <>
      <section className="classes-section" aria-labelledby="classes-heading">
        <div className="section-container">
          <div className="section-header">
            <h2 id="classes-heading" className="section-title">
              {preview ? "Popular Classes" : "All Classes"}
            </h2>
            <p className="section-subtitle">
              From high-intensity cardio to mindful yoga — we have a class for every goal and fitness level.
            </p>
          </div>

          {!preview && (
            <div className="classes-filters">
              <input
                type="text"
                placeholder="Search classes..."
                value={state.searchQuery}
                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                className="filter-search"
                aria-label="Search classes"
              />
              
              <select
                value={state.selectedCategory}
                onChange={(e) => dispatch({ type: 'SET_CATEGORY', payload: e.target.value })}
                className="filter-select"
                aria-label="Filter by category"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={state.selectedDifficulty}
                onChange={(e) => dispatch({ type: 'SET_DIFFICULTY', payload: e.target.value })}
                className="filter-select"
                aria-label="Filter by difficulty"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>

              <select
                value={state.sortBy}
                onChange={(e) => dispatch({ type: 'SET_SORT', payload: e.target.value })}
                className="filter-select"
                aria-label="Sort classes"
              >
                <option value="name">Sort by Name</option>
                <option value="duration">Sort by Duration</option>
              </select>

              <button
                onClick={() => dispatch({ type: 'RESET_FILTERS' })}
                className="btn btn-outline"
              >
                Reset Filters
              </button>
            </div>
          )}

          <div className="class-grid">
            {filteredClasses.length > 0 ? (
              filteredClasses.map((cls) => (
                <ClassCard 
                  key={cls.id} 
                  cls={cls} 
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <p className="no-results">No classes found matching your criteria.</p>
            )}
          </div>

          {preview && (
            <div className="section-cta">
              <Link to="/classes" className="btn btn-primary">View All Classes</Link>
            </div>
          )}
        </div>
      </section>

      <Modal
        isOpen={!!selectedClass}
        onClose={handleCloseModal}
        title={selectedClass?.name || ''}
      >
        {selectedClass && (
          <div className="class-modal-content">
            <img 
              src={selectedClass.image} 
              alt={selectedClass.name} 
              className="modal-image"
            />
            <div className="modal-details">
              <span className="class-category">{selectedClass.category}</span>
              <span 
                className="difficulty-badge"
                style={{ 
                  backgroundColor: {
                    Beginner: "#22c55e",
                    Intermediate: "#f97316",
                    Advanced: "#ef4444"
                  }[selectedClass.difficulty]
                }}
              >
                {selectedClass.difficulty}
              </span>
              <p className="modal-description">{selectedClass.description}</p>
              <div className="modal-meta">
                <div>
                  <strong>Duration:</strong> {selectedClass.duration}
                </div>
                <div>
                  <strong>Trainer:</strong> {selectedClass.trainer}
                </div>
              </div>
              <div className="modal-benefits">
                <strong>Benefits:</strong>
                <div className="class-benefits">
                  {selectedClass.benefits.map((b, i) => (
                    <span className="benefit-tag" key={i}>{b}</span>
                  ))}
                </div>
              </div>
              <Link to="/contact" className="btn btn-primary">
                Book This Class
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default Classes;
