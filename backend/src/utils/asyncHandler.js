/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors and pass them to Express error middleware
 * This ensures that all errors thrown in async functions reach the error handler
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
