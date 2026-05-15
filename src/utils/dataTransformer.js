/**
 * Data Transformation Utilities
 * Provides functions to transform and normalize API responses
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

/**
 * Transform dashboard overview response
 * @param {Object} data - Raw API response
 * @returns {Object} - Transformed dashboard data
 */
export function transformDashboardOverview(data) {
  if (!data) return null;

  return {
    trainer: {
      id: data.trainer?._id || data.trainer?.id,
      fullName: data.trainer?.fullName || '',
      email: data.trainer?.email || '',
      specialization: data.trainer?.specialization || '',
      experience: data.trainer?.experience || 0,
      rating: data.trainer?.rating || 0,
      assignedBranch: data.trainer?.assignedBranch || null,
      trainerStatus: data.trainer?.trainerStatus || 'active',
    },
    statistics: {
      totalMembers: data.statistics?.totalMembers || 0,
      activeMembers: data.statistics?.activeMembers || 0,
      todaySessions: data.statistics?.todaySessions || 0,
      upcomingSessions: data.statistics?.upcomingSessions || 0,
      activeWorkouts: data.statistics?.activeWorkouts || 0,
      activeDiets: data.statistics?.activeDiets || 0,
      monthlyAttendance: data.statistics?.monthlyAttendance || 0,
      completedSessions: data.statistics?.completedSessions || 0,
      recentProgressUpdates: data.statistics?.recentProgressUpdates || 0,
    },
  };
}

/**
 * Transform client list response
 * @param {Object} data - Raw API response
 * @returns {Object} - Transformed client list data
 */
export function transformClientList(data) {
  if (!data) return { members: [], pagination: {} };

  return {
    members: (data.members || []).map((member) => transformClientCard(member)),
    pagination: {
      currentPage: data.pagination?.currentPage || 1,
      totalPages: data.pagination?.totalPages || 1,
      totalMembers: data.pagination?.totalMembers || 0,
      limit: data.pagination?.limit || 10,
      hasMore: data.pagination?.hasMore || false,
    },
  };
}

/**
 * Transform individual client card data
 * @param {Object} member - Raw member data
 * @returns {Object} - Transformed client card data
 */
export function transformClientCard(member) {
  if (!member) return null;

  return {
    id: member._id || member.id,
    fullName: member.fullName || '',
    email: member.email || '',
    phone: member.phone || '',
    gender: member.gender || 'other',
    age: member.age || 0,
    fitnessGoal: member.fitnessGoal || '',
    membershipStatus: member.membershipStatus || 'active',
    membershipPlan: member.membershipPlan || '',
    profileImage: member.profileImage || null,
    progress: member.progress || 0,
    lastVisit: member.lastVisit ? new Date(member.lastVisit) : null,
    sessions: member.sessions || 0,
  };
}

/**
 * Transform client profile response
 * @param {Object} data - Raw API response
 * @returns {Object} - Transformed client profile data
 */
export function transformClientProfile(data) {
  if (!data) return null;

  return {
    member: {
      id: data.member?._id || data.member?.id,
      fullName: data.member?.fullName || '',
      email: data.member?.email || '',
      phone: data.member?.phone || '',
      age: data.member?.age || 0,
      gender: data.member?.gender || 'other',
      fitnessGoal: data.member?.fitnessGoal || '',
      height: data.member?.height || 0,
      weight: data.member?.weight || 0,
      membershipStatus: data.member?.membershipStatus || 'active',
      membershipPlan: data.member?.membershipPlan || '',
      joinDate: data.member?.joinDate ? new Date(data.member.joinDate) : null,
      profileImage: data.member?.profileImage || null,
    },
    fitnessGoals: {
      height: data.fitnessGoals?.height || 0,
      weight: data.fitnessGoals?.weight || 0,
      bmi: data.fitnessGoals?.bmi || 0,
      bmiCategory: data.fitnessGoals?.bmiCategory || '',
    },
    membership: {
      plan: data.membership?.plan || '',
      branch: data.membership?.branch || null,
      status: data.membership?.status || 'active',
      startDate: data.membership?.startDate ? new Date(data.membership.startDate) : null,
      endDate: data.membership?.endDate ? new Date(data.membership.endDate) : null,
    },
    attendance: (data.attendance || []).map((record) => ({
      date: record.date ? new Date(record.date) : null,
      checkInTime: record.checkInTime || '',
      checkOutTime: record.checkOutTime || '',
      duration: record.duration || 0,
      status: record.status || 'present',
    })),
    progress: {
      weight: data.progress?.weight || [],
      bodyFat: data.progress?.bodyFat || [],
      strength: data.progress?.strength || [],
      months: data.progress?.months || [],
    },
    workoutPlans: (data.workoutPlans || []).map((plan) => ({
      id: plan._id || plan.id,
      title: plan.title || '',
      status: plan.status || 'active',
      progress: plan.progress || 0,
      startDate: plan.startDate ? new Date(plan.startDate) : null,
      endDate: plan.endDate ? new Date(plan.endDate) : null,
    })),
    progressNotes: (data.progressNotes || []).map((note) => ({
      date: note.date ? new Date(note.date) : null,
      note: note.note || '',
      trainer: note.trainer || '',
    })),
  };
}

/**
 * Transform analytics response
 * @param {Object} data - Raw API response
 * @returns {Object} - Transformed analytics data
 */
export function transformAnalytics(data) {
  if (!data) return null;

  return {
    totalCount: data.totalCount || 0,
    breakdown: data.breakdown || {},
    metrics: data.metrics || {},
    trends: data.trends || [],
    timestamp: new Date().toISOString(),
  };
}

/**
 * Transform member analytics response
 * @param {Object} data - Raw API response
 * @returns {Object} - Transformed member analytics
 */
export function transformMemberAnalytics(data) {
  if (!data) return null;

  return {
    totalMembers: data.totalMembers || 0,
    byMembershipStatus: data.byMembershipStatus || {},
    byFitnessGoal: data.byFitnessGoal || {},
    byGender: data.byGender || {},
    byMembershipPlan: data.byMembershipPlan || {},
  };
}

/**
 * Transform session analytics response
 * @param {Object} data - Raw API response
 * @returns {Object} - Transformed session analytics
 */
export function transformSessionAnalytics(data) {
  if (!data) return null;

  return {
    totalSessions: data.totalSessions || 0,
    sessionsThisMonth: data.sessionsThisMonth || 0,
    byType: data.byType || {},
    byStatus: data.byStatus || {},
    completionRate: data.completionRate || 0,
    cancellationRate: data.cancellationRate || 0,
    averageParticipants: data.averageParticipants || 0,
  };
}

/**
 * Transform attendance analytics response
 * @param {Object} data - Raw API response
 * @returns {Object} - Transformed attendance analytics
 */
export function transformAttendanceAnalytics(data) {
  if (!data) return null;

  return {
    totalRecords: data.totalRecords || 0,
    uniqueMembers: data.uniqueMembers || 0,
    recordsPerDay: data.recordsPerDay || 0,
    averageDuration: data.averageDuration || 0,
    byStatus: data.byStatus || {},
  };
}

/**
 * Transform workout analytics response
 * @param {Object} data - Raw API response
 * @returns {Object} - Transformed workout analytics
 */
export function transformWorkoutAnalytics(data) {
  if (!data) return null;

  return {
    totalWorkouts: data.totalWorkouts || 0,
    byStatus: data.byStatus || {},
    byCategory: data.byCategory || {},
    byDifficulty: data.byDifficulty || {},
    averageProgress: data.averageProgress || 0,
    completionRate: data.completionRate || 0,
  };
}

/**
 * Transform diet analytics response
 * @param {Object} data - Raw API response
 * @returns {Object} - Transformed diet analytics
 */
export function transformDietAnalytics(data) {
  if (!data) return null;

  return {
    totalDiets: data.totalDiets || 0,
    byStatus: data.byStatus || {},
    byDietType: data.byDietType || {},
    averageProgress: data.averageProgress || 0,
    averageAdherence: data.averageAdherence || 0,
  };
}

/**
 * Transform progress analytics response
 * @param {Object} data - Raw API response
 * @returns {Object} - Transformed progress analytics
 */
export function transformProgressAnalytics(data) {
  if (!data) return null;

  return {
    totalRecords: data.totalRecords || 0,
    uniqueMembers: data.uniqueMembers || 0,
    averageRecordsPerMember: data.averageRecordsPerMember || 0,
    photosUploaded: data.photosUploaded || 0,
    strengthMetricsRecorded: data.strengthMetricsRecorded || 0,
  };
}

/**
 * Transform performance statistics response
 * @param {Object} data - Raw API response
 * @returns {Object} - Transformed performance statistics
 */
export function transformPerformanceStats(data) {
  if (!data) return null;

  return {
    rating: data.rating || 0,
    sessionsCompleted: data.sessionsCompleted || 0,
    activeMembers: data.activeMembers || 0,
    monthlyMetrics: data.monthlyMetrics || {},
  };
}

/**
 * Transform ratings response
 * @param {Object} data - Raw API response
 * @returns {Object} - Transformed ratings data
 */
export function transformRatings(data) {
  if (!data) return null;

  return {
    overallRating: data.overallRating || 0,
    totalRatings: data.totalRatings || 0,
    breakdown: {
      fiveStar: data.breakdown?.fiveStar || 0,
      fourStar: data.breakdown?.fourStar || 0,
      threeStar: data.breakdown?.threeStar || 0,
      twoStar: data.breakdown?.twoStar || 0,
      oneStar: data.breakdown?.oneStar || 0,
    },
  };
}

/**
 * Transform reviews response
 * @param {Object} data - Raw API response
 * @returns {Object} - Transformed reviews data
 */
export function transformReviews(data) {
  if (!data) return { reviews: [], pagination: {} };

  return {
    reviews: (data.reviews || []).map((review) => ({
      id: review._id || review.id,
      clientName: review.clientName || '',
      rating: review.rating || 0,
      date: review.date ? new Date(review.date) : null,
      text: review.text || '',
    })),
    pagination: {
      currentPage: data.pagination?.currentPage || 1,
      totalPages: data.pagination?.totalPages || 1,
      totalReviews: data.pagination?.totalReviews || 0,
      limit: data.pagination?.limit || 10,
      hasMore: data.pagination?.hasMore || false,
    },
  };
}

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string (e.g., 'MM/DD/YYYY')
 * @returns {string} - Formatted date
 */
export function formatDate(date, format = 'MM/DD/YYYY') {
  if (!date) return '';

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  const formats = {
    'MM/DD/YYYY': `${month}/${day}/${year}`,
    'YYYY-MM-DD': `${year}-${month}-${day}`,
    'DD/MM/YYYY': `${day}/${month}/${year}`,
    'MM/DD/YYYY HH:mm': `${month}/${day}/${year} ${hours}:${minutes}`,
  };

  return formats[format] || formats['MM/DD/YYYY'];
}

/**
 * Format time duration
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration (e.g., "1h 30m")
 */
export function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '0m';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Calculate BMI
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {number} - BMI value
 */
export function calculateBMI(weight, height) {
  if (!weight || !height || height === 0) return 0;

  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
}

/**
 * Get BMI category
 * @param {number} bmi - BMI value
 * @returns {string} - BMI category
 */
export function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

/**
 * Normalize pagination data
 * @param {Object} pagination - Raw pagination data
 * @returns {Object} - Normalized pagination
 */
export function normalizePagination(pagination) {
  return {
    currentPage: pagination?.currentPage || 1,
    totalPages: pagination?.totalPages || 1,
    totalItems: pagination?.totalItems || pagination?.total || 0,
    limit: pagination?.limit || 10,
    hasMore: pagination?.hasMore || false,
  };
}

export default {
  transformDashboardOverview,
  transformClientList,
  transformClientCard,
  transformClientProfile,
  transformAnalytics,
  transformMemberAnalytics,
  transformSessionAnalytics,
  transformAttendanceAnalytics,
  transformWorkoutAnalytics,
  transformDietAnalytics,
  transformProgressAnalytics,
  transformPerformanceStats,
  transformRatings,
  transformReviews,
  formatDate,
  formatDuration,
  calculateBMI,
  getBMICategory,
  normalizePagination,
};
