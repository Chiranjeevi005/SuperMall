// Browser-compatible logger for client-side code
const clientLogger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[INFO] ${message}`, meta || '');
    }
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[ERROR] ${message}`, meta || '');
    }
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[WARN] ${message}`, meta || '');
    }
  },
  debug: (message: string, meta?: Record<string, unknown>) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, meta || '');
    }
  }
};

export default clientLogger;