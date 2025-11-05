
// Common HTTP status helpers
export const STATUS = {
  OK: { status: 200 },
  BAD_REQUEST: { status: 400 },
  NOT_FOUND: { status: 404 },
  SERVER_ERROR: { status: 500 },
} as const;