// src/lib/error-logger.ts
interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: Date;
  userId?: string;
  path?: string;
}

export async function logError(error: Error, userId?: string, path?: string) {
  const errorLog: ErrorLog = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date(),
    userId,
    path,
  };

  // Log to database
  await prisma.errorLog.create({ data: errorLog });

  // Optional: Send critical errors to admin
  if (process.env.NODE_ENV === 'production') {
    console.error(JSON.stringify(errorLog));
  }
}
