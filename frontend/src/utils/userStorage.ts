/** All progress is keyed by the user's email so accounts are fully isolated */

export const getCurrentEmail = (): string => {
  try {
    const u = JSON.parse(localStorage.getItem('algoverse_current_user') || '{}');
    return u.email || 'guest';
  } catch { return 'guest'; }
};

// ── Completed courses ─────────────────────────────────────────────────────────
export const getCompletedCourses = (): string[] => {
  try { return JSON.parse(localStorage.getItem(`completed_courses_${getCurrentEmail()}`) || '[]'); }
  catch { return []; }
};
export const addCompletedCourse = (courseId: string): void => {
  const ids = getCompletedCourses();
  if (!ids.includes(courseId)) {
    ids.push(courseId);
    localStorage.setItem(`completed_courses_${getCurrentEmail()}`, JSON.stringify(ids));
  }
};

// ── Downloaded courses ────────────────────────────────────────────────────────
export const getDownloadedCourses = (): string[] => {
  try { return JSON.parse(localStorage.getItem(`downloaded_courses_${getCurrentEmail()}`) || '[]'); }
  catch { return []; }
};
export const addDownloadedCourse = (courseId: string): void => {
  const ids = getDownloadedCourses();
  if (!ids.includes(courseId)) {
    ids.push(courseId);
    localStorage.setItem(`downloaded_courses_${getCurrentEmail()}`, JSON.stringify(ids));
  }
};

// ── Section progress ──────────────────────────────────────────────────────────
export const getCourseStep = (courseId: string): number => {
  const v = localStorage.getItem(`course_step_${getCurrentEmail()}_${courseId}`);
  return v ? parseInt(v) : 0;
};
export const setCourseStep = (courseId: string, step: number): void => {
  localStorage.setItem(`course_step_${getCurrentEmail()}_${courseId}`, String(step));
};

// ── Assessment scores ─────────────────────────────────────────────────────────
export const getAssessmentScore = (courseId: string): number | null => {
  const v = localStorage.getItem(`assessment_score_${getCurrentEmail()}_${courseId}`);
  return v !== null ? parseInt(v) : null;
};
export const setAssessmentScore = (courseId: string, score: number): void => {
  localStorage.setItem(`assessment_score_${getCurrentEmail()}_${courseId}`, String(score));
};
