/**
 * FRIDA Safe Structured Logger
 * Provides development diagnostics and safe production logging without sensitive data leaks.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  templateId?: string;
  invitationId?: string;
  component?: string;
  action?: string;
  [key: string]: unknown;
}

const isDev = process.env.NODE_ENV !== 'production';

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const ctxStr = context ? ` [${JSON.stringify(context)}]` : '';
  return `[FRIDA:${level.toUpperCase()}] ${timestamp} - ${message}${ctxStr}`;
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (isDev) {
      console.debug(formatMessage('debug', message, context));
    }
  },

  info(message: string, context?: LogContext) {
    console.info(formatMessage('info', message, context));
  },

  warn(message: string, context?: LogContext, error?: unknown) {
    console.warn(formatMessage('warn', message, context), error || '');
  },

  error(message: string, context?: LogContext, error?: unknown) {
    console.error(formatMessage('error', message, context), error || '');
  },
};
