import React, { useState, useEffect } from 'react';
import { FaDumbbell, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaPause, FaPlay, FaChartBar, FaSearch } from 'react-icons/fa';
import trainerWorkoutAPI from '../services/trainerWorkoutAPI';
import '../styles/trainer-workouts.css';

function TrainerWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    memberId: '',
    workoutTitle: '',
    workoutCategory: 'strength',
    exercises: [{ exerciseName: '', sets: 3, reps: '10-12', weight: 'bodyweight', restTime: 60 }],
    duration: 60,
    difficultyLevel: 'intermediate',
    targetMuscleGroups: [],
    goals: [],
    frequency: '3 times per week',
    notes: '',
  });

  useEffect(() => {
    fetchWorkouts();
    fetchStats();
  }, [filterStatus, filterCategory]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page: 1, limit: 100 };
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterCategory !== 'all') params.category = filterCategory;
      
      const data = await trainerWorkoutAPI.getAllWorkouts(params);
      setWorkouts(data.workouts || []);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError(err.message || 'Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await trainerWorkoutAPI.getWorkoutStats();
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleCreateWorkout = async (e) => {
    e.preventDefault();
    try {
      const newWorkout = await trainerWorkoutAPI.createWorkout(formData);
      const workoutData = newWorkout.workout || newWorkout;
      setWorkouts([workoutData, ...workouts]);
      setShowModal(false);
      resetForm();
      showToast('Workout created successfully!');
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to create workout', 'error');
    }
  };

  const handleUpdateWorkout = async (e) => {
    e.preventDefault();
    try {
      const updated = await trainerWorkoutAPI.updateWorkout(editingWorkout._id || editingWorkout.id, formData);
      const workoutData = updated.workout || updated;
      setWorkouts(workouts.map(w => (w._id || w.id) === (editingWorkout._id || editingWorkout.id) ? workoutData : w));
      setShowModal(false);
      setEditingWorkout(null);
      resetForm();
      showToast('Workout updated successfully!');
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to update workout', 'error');
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;
    try {
      await trainerWorkoutAPI.deleteWorkout(workoutId);
      setWorkouts(workouts.filter(w => (w._id || w.id) !== workoutId));
      showToast('Workout deleted successfully!');
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to delete workout', 'error');
    }
  };

  const handlePauseWorkout = async (workoutId) => {
    try {
      const updated = await trainerWorkoutAPI.pauseWorkout(workoutId);
      const workoutData = updated.workout || updated;
      setWorkouts(workouts.map(w => (w._id || w.id) === workoutId ? workoutData : w));
      showToast('Workout paused!');
    } catch (err) {
      showToast(err.message || 'Failed to pause workout', 'error');
    }
  };

  const handleResumeWorkout = async (workoutId) => {
    try {
      const updated = await trainerWorkoutAPI.resumeWorkout(workoutId);
      const workoutData = updated.workout || updated;
      setWorkouts(workouts.map(w => (w._id || w.id) === workoutId ? workoutData : w));
      showToast('Workout resumed!');
    } catch (err) {
      showToast(err.message || 'Failed to resume workout', 'error');
    }
  };

  const handleCompleteWorkout = async (workoutId) => {
    try {
      const updated = await trainerWorkoutAPI.completeWorkout(workoutId);
      const workoutData = updated.workout || updated;
      setWorkouts(workouts.map(w => (w._id || w.id) === workoutId ? workoutData : w));
      showToast('Workout completed!');
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to complete workout', 'error');
    }
  };

  const handleEditClick = (workout) => {
    setEditingWorkout(workout);
    setFormData({
      memberId: workout.memberId?._id || workout.memberId || '',
      workoutTitle: workout.workoutTitle,
      workoutCategory: workout.workoutCategory,
      exercises: workout.exercises || [],
      duration: workout.duration,
      difficultyLevel: workout.difficultyLevel,
      targetMuscleGroups: workout.targetMuscleGroups || [],
      goals: workout.goals || [],
      frequency: workout.frequency,
      notes: workout.notes || '',
    });
    setShowModal(true);
  };

  const handleAddExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { exerciseName: '', sets: 3, reps: '10-12', weight: 'bodyweight', restTime: 60 }],
    });
  };

  const handleRemoveExercise = (index) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index),
    });
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...formData.exercises];
    newExercises[index][field] = value;
    setFormData({ ...formData, exercises: newExercises });
  };

  const resetForm = () => {
    setFormData({
      memberId: '',
      workoutTitle: '',
      workoutCategory: 'strength',
      exercises: [{ exerciseName: '', sets: 3, reps: '10-12', weight: 'bodyweight', restTime: 60 }],
      duration: 60,
      difficultyLevel: 'intermediate',
      targetMuscleGroups: [],
      goals: [],
      frequency: '3 times per week',
      notes: '',
    });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': '#22c55e',
      'completed': '#3b82f6',
      'paused': '#f59e0b',
      'cancelled': '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  const filteredWorkouts = workouts.filter(w =>
    (w.workoutTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     w.memberId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="trainer-workouts loading">⏳ Loading workouts...</div>;
  }

  return (
    <div className="trainer-workouts">
      <div className="workouts-header">
        <h2><FaDumbbell /> Workout Management</h2>
        <button className="btn btn-primary" onClick={() => { setEditingWorkout(null); resetForm(); setShowModal(true); }}>
          <FaPlus /> Create Workout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Workouts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#22c55e' }}>{stats.byStatus?.active || 0}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#3b82f6' }}>{stats.byStatus?.completed || 0}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.averageProgress}%</div>
            <div className="stat-label">Avg Progress</div>
          </div>
        </div>
      )}

      <div className="filters-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search workouts..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="filter-select">
          <option value="all">All Categories</option>
          <option value="strength">Strength</option>
          <option value="cardio">Cardio</option>
          <option value="flexibility">Flexibility</option>
          <option value="hiit">HIIT</option>
          <option value="yoga">Yoga</option>
        </select>
      </div>

      {filteredWorkouts.length === 0 ? (
        <div className="empty-state">No workouts found</div>
      ) : (
        <div className="workouts-grid">
          {filteredWorkouts.map(workout => (
            <div key={workout._id || workout.id} className="workout-card">
              <div className="card-header">
                <h3>{workout.workoutTitle}</h3>
                <span className="status-badge" style={{ backgroundColor: getStatusColor(workout.status) }}>
                  {workout.status}
                </span>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="label">Member:</span>
                  <span className="value">{workout.memberId?.fullName || workout.memberId || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Category:</span>
                  <span className="value">{workout.workoutCategory}</span>
                </div>
                <div className="info-row">
                  <span className="label">Difficulty:</span>
                  <span className="value">{workout.difficultyLevel}</span>
                </div>
                <div className="info-row">
                  <span className="label">Duration:</span>
                  <span className="value">{workout.duration} min</span>
                </div>
                <div className="info-row">
                  <span className="label">Exercises:</span>
                  <span className="value">{workout.exerciseCount || workout.exercises?.length || 0}</span>
                </div>
                <div className="progress-section">
                  <div className="progress-label">
                    <span>Progress</span>
                    <span>{workout.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${workout.progress}%` }} />
                  </div>
                </div>
              </div>
              <div className="card-actions">
                {workout.status === 'active' && (
                  <>
                    <button className="btn btn-sm btn-outline" onClick={() => handleEditClick(workout)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="btn btn-sm btn-warning" onClick={() => handlePauseWorkout(workout._id || workout.id)}>
                      <FaPause /> Pause
                    </button>
                    <button className="btn btn-sm btn-success" onClick={() => handleCompleteWorkout(workout._id || workout.id)}>
                      <FaCheckCircle /> Complete
                    </button>
                  </>
                )}
                {workout.status === 'paused' && (
                  <button className="btn btn-sm btn-primary" onClick={() => handleResumeWorkout(workout._id || workout.id)}>
                    <FaPlay /> Resume
                  </button>
                )}
                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteWorkout(workout._id || workout.id)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingWorkout ? 'Edit Workout' : 'Create Workout'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={editingWorkout ? handleUpdateWorkout : handleCreateWorkout} className="workout-form">
              <div className="form-group">
                <label>Workout Title *</label>
                <input
                  type="text"
                  value={formData.workoutTitle}
                  onChange={e => setFormData({ ...formData, workoutTitle: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.workoutCategory}
                    onChange={e => setFormData({ ...formData, workoutCategory: e.target.value })}
                    required
                  >
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="hiit">HIIT</option>
                    <option value="yoga">Yoga</option>
                    <option value="pilates">Pilates</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Difficulty *</label>
                  <select
                    value={formData.difficultyLevel}
                    onChange={e => setFormData({ ...formData, difficultyLevel: e.target.value })}
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Duration (minutes) *</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Frequency</label>
                  <input
                    type="text"
                    value={formData.frequency}
                    onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                    placeholder="e.g., 3 times per week"
                  />
                </div>
              </div>

              <div className="exercises-section">
                <div className="section-header">
                  <h3>Exercises</h3>
                  <button type="button" className="btn btn-sm btn-outline" onClick={handleAddExercise}>
                    <FaPlus /> Add Exercise
                  </button>
                </div>
                {formData.exercises.map((exercise, index) => (
                  <div key={index} className="exercise-item">
                    <div className="exercise-row">
                      <input
                        type="text"
                        placeholder="Exercise name"
                        value={exercise.exerciseName}
                        onChange={e => handleExerciseChange(index, 'exerciseName', e.target.value)}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Sets"
                        min="1"
                        value={exercise.sets}
                        onChange={e => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Reps"
                        value={exercise.reps}
                        onChange={e => handleExerciseChange(index, 'reps', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Weight"
                        value={exercise.weight}
                        onChange={e => handleExerciseChange(index, 'weight', e.target.value)}
                      />
                      {formData.exercises.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveExercise(index)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingWorkout ? 'Update Workout' : 'Create Workout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainerWorkouts;
