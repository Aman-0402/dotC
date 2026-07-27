const STORAGE_KEY = 'progress';

export function getProgress() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
}

export function markLessonComplete(lessonId) {
  const progress = getProgress();
  progress[lessonId] = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function isLessonComplete(lessonId) {
  return Boolean(getProgress()[lessonId]);
}
