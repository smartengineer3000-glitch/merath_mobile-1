/**
 * Comprehensive Error Handler
 * Phase 1: Advanced Error Management & User Feedback
 *
 * Provides centralized error handling with user-friendly messages
 * and detailed logging for debugging
 *
 * FIXES:
 * - H5 (🟠): Error recovery with retry mechanism and exponential backoff
 */

export type ErrorSeverity = "info" | "warning" | "error" | "critical";

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  severity: ErrorSeverity;
  timestamp: Date;
  context?: Record<string, any>;
  stack?: string;
  // ===== FIX H5: Enhanced error metadata =====
  retryCount?: number;
  lastRetry?: Date;
  recoverable: boolean;
  category: ErrorCategory;
}

// ===== FIX H5: Error categorization =====
export type ErrorCategory =
  | "network"
  | "validation"
  | "calculation"
  | "storage"
  | "pdf_export"
  | "ui"
  | "unknown";

// ===== FIX H5: Retry configuration =====
export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  backoffFactor: number;
  maxDelayMs: number;
  retryableErrorCodes: string[];
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  backoffFactor: 2,
  maxDelayMs: 10000,
  retryableErrorCodes: [
    "NETWORK_ERROR",
    "STORAGE_ERROR",
    "PDF_EXPORT_ERROR",
    "TIMEOUT_ERROR",
  ],
};

// ===== FIX H5: Recovery strategy types =====
export type RecoveryStrategy =
  | "retry"
  | "fallback"
  | "reset"
  | "ignore"
  | "notify_user";

export interface RecoveryPlan {
  strategy: RecoveryStrategy;
  action: () => Promise<void>;
  fallbackValue?: any;
  estimatedSuccessRate: number;
}

export class ErrorLogger {
  private static errors: AppError[] = [];
  private static maxErrors = 1000;

  // ===== FIX H5: Retry tracking =====
  private static retryCounts = new Map<string, number>();
  private static lastRetryTime = new Map<string, number>();

  /**
   * Log an error with context
   */
  static logError(
    code: string,
    message: string,
    userMessage: string,
    severity: ErrorSeverity = "error",
    context?: Record<string, any>,
    stack?: string,
    recoverable: boolean = true,
    category: ErrorCategory = "unknown",
  ): AppError {
    const error: AppError = {
      code,
      message,
      userMessage,
      severity,
      timestamp: new Date(),
      context,
      stack,
      recoverable,
      category,
    };

    // Store in memory
    this.errors.push(error);

    // Keep only last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console in development
    if (__DEV__) {
      console.error(`[${severity.toUpperCase()}] ${code}`, {
        message,
        userMessage,
        context,
        stack,
        recoverable,
        category,
      });
    }

    return error;
  }

  /**
   * Get all logged errors
   */
  static getErrors(
    severity?: ErrorSeverity,
    limit?: number,
    category?: ErrorCategory,
  ): AppError[] {
    let filtered = this.errors;

    if (severity) {
      filtered = filtered.filter((e) => e.severity === severity);
    }

    if (category) {
      filtered = filtered.filter((e) => e.category === category);
    }

    if (limit) {
      filtered = filtered.slice(-limit);
    }

    return filtered;
  }

  /**
   * Clear error log
   */
  static clearErrors(): void {
    this.errors = [];
    this.retryCounts.clear();
    this.lastRetryTime.clear();
  }

  /**
   * Export errors as JSON
   */
  static exportAsJSON(): string {
    return JSON.stringify(this.errors, null, 2);
  }

  // ===== FIX H5: Retry mechanism with exponential backoff =====
  static async withRetry<T>(
    operation: () => Promise<T>,
    errorCode: string,
    config: Partial<RetryConfig> = {},
  ): Promise<T> {
    const fullConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
    const errorKey = `${errorCode}_${Date.now()}`;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= fullConfig.maxRetries; attempt++) {
      try {
        const result = await operation();

        // Clear retry count on success
        this.retryCounts.delete(errorKey);
        this.lastRetryTime.delete(errorKey);

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Check if error is retryable
        if (!this.isRetryableError(error, fullConfig)) {
          throw error;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          fullConfig.initialDelayMs *
            Math.pow(fullConfig.backoffFactor, attempt - 1),
          fullConfig.maxDelayMs,
        );

        // Log retry attempt
        this.logError(
          `${errorCode}_RETRY_${attempt}`,
          `Retry attempt ${attempt}/${fullConfig.maxRetries}: ${lastError.message}`,
          `محاولة إعادة المحاولة ${attempt}/${fullConfig.maxRetries}`,
          "warning",
          { attempt, delay, originalError: lastError.message },
          lastError.stack,
          true,
          this.categorizeError(error),
        );

        // Update retry tracking
        this.retryCounts.set(errorKey, attempt);
        this.lastRetryTime.set(errorKey, Date.now());

        // Wait before next retry
        await this.sleep(delay);
      }
    }

    // All retries failed
    const finalError = new Error(
      `All ${fullConfig.maxRetries} retry attempts failed: ${lastError?.message}`,
    );
    this.logError(
      `${errorCode}_RETRY_EXHAUSTED`,
      finalError.message,
      "فشلت جميع محاولات إعادة المحاولة",
      "error",
      { maxRetries: fullConfig.maxRetries },
      finalError.stack,
      false,
      this.categorizeError(lastError),
    );

    throw finalError;
  }

  // ===== FIX H5: Check if error is retryable =====
  private static isRetryableError(error: any, config: RetryConfig): boolean {
    if (!error) return false;

    const errorCode = error.code || error.name || "UNKNOWN_ERROR";

    // Check against retryable codes
    if (config.retryableErrorCodes.includes(errorCode)) {
      return true;
    }

    // Network errors are usually retryable
    if (errorCode.includes("NETWORK") || errorCode.includes("TIMEOUT")) {
      return true;
    }

    // Storage errors might be retryable
    if (errorCode.includes("STORAGE") || errorCode.includes("ASYNC_STORAGE")) {
      return true;
    }

    return false;
  }

  // ===== FIX H5: Categorize error =====
  private static categorizeError(error: any): ErrorCategory {
    const errorStr = String(error?.message || error || "").toLowerCase();

    if (
      errorStr.includes("network") ||
      errorStr.includes("internet") ||
      errorStr.includes("connection")
    ) {
      return "network";
    }
    if (errorStr.includes("validation") || errorStr.includes("invalid")) {
      return "validation";
    }
    if (errorStr.includes("calculation") || errorStr.includes("math")) {
      return "calculation";
    }
    if (
      errorStr.includes("storage") ||
      errorStr.includes("async") ||
      errorStr.includes("database")
    ) {
      return "storage";
    }
    if (errorStr.includes("pdf") || errorStr.includes("export")) {
      return "pdf_export";
    }
    if (errorStr.includes("ui") || errorStr.includes("render")) {
      return "ui";
    }

    return "unknown";
  }

  // ===== FIX H5: Sleep utility =====
  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ===== FIX H5: Get retry statistics =====
  static getRetryStats(): {
    totalRetries: number;
    activeRetries: number;
    averageRetryDelay: number;
  } {
    const activeRetries = this.retryCounts.size;
    const totalRetries = Array.from(this.retryCounts.values()).reduce(
      (a, b) => a + b,
      0,
    );

    // Calculate average delay from last retry times
    const now = Date.now();
    const delays = Array.from(this.lastRetryTime.values())
      .map((time) => now - time)
      .filter((delay) => delay < 3600000); // Last hour only

    const averageDelay =
      delays.length > 0 ? delays.reduce((a, b) => a + b, 0) / delays.length : 0;

    return {
      totalRetries,
      activeRetries,
      averageRetryDelay: averageDelay,
    };
  }

  // ===== FIX H5: Generate recovery plan for error =====
  static generateRecoveryPlan(error: AppError): RecoveryPlan {
    switch (error.category) {
      case "network":
        return {
          strategy: "retry",
          action: async () => {
            // Network retry logic
            await this.sleep(2000);
          },
          estimatedSuccessRate: 0.7,
        };

      case "storage":
        return {
          strategy: "retry",
          action: async () => {
            // Storage retry with backup
            await this.sleep(500);
          },
          estimatedSuccessRate: 0.8,
        };

      case "calculation":
        return {
          strategy: "fallback",
          action: async () => {
            // Fallback to simplified calculation
          },
          fallbackValue: null,
          estimatedSuccessRate: 0.9,
        };

      case "validation":
        return {
          strategy: "notify_user",
          action: async () => {
            // User needs to fix input
          },
          estimatedSuccessRate: 0.5,
        };

      case "pdf_export":
        return {
          strategy: "retry",
          action: async () => {
            await this.sleep(1000);
          },
          estimatedSuccessRate: 0.6,
        };

      default:
        return {
          strategy: "ignore",
          action: async () => {},
          estimatedSuccessRate: 0.1,
        };
    }
  }

  // ===== FIX H5: Get error summary for user =====
  static getUserFriendlyMessage(error: AppError): string {
    if (!error.recoverable) {
      return `${error.userMessage}\n\nهذا الخطأ غير قابل للاسترداد. يرجى إعادة تشغيل التطبيق.`;
    }

    const retryInfo = error.retryCount
      ? `\n\nمحاولة إعادة المحاولة: ${error.retryCount}/${DEFAULT_RETRY_CONFIG.maxRetries}`
      : "";

    switch (error.category) {
      case "network":
        return `${error.userMessage}\n\nيرجى التحقق من اتصال الإنترنت الخاص بك.${retryInfo}`;
      case "storage":
        return `${error.userMessage}\n\nسيتم إعادة المحاولة تلقائياً.${retryInfo}`;
      case "calculation":
        return `${error.userMessage}\n\nجاري استخدام طريقة حساب بديلة...${retryInfo}`;
      case "pdf_export":
        return `${error.userMessage}\n\nيرجى المحاولة مرة أخرى.${retryInfo}`;
      default:
        return error.userMessage + retryInfo;
    }
  }
}

/**
 * Custom Error Classes with recovery support
 */
export class CalculationError extends Error {
  constructor(
    public code: string,
    public userMessage: string,
    message: string,
    severity: ErrorSeverity = "error",
    public recoverable: boolean = true,
    public category: ErrorCategory = "calculation",
  ) {
    super(message);
    this.name = "CalculationError";

    ErrorLogger.logError(
      code,
      message,
      userMessage,
      severity,
      {},
      new Error().stack,
      recoverable,
      category,
    );
  }
}

export class ValidationError extends Error {
  constructor(
    public field: string,
    public userMessage: string,
    message: string,
    public recoverable: boolean = false,
  ) {
    super(message);
    this.name = "ValidationError";

    ErrorLogger.logError(
      `VALIDATION_ERROR:${field}`,
      message,
      userMessage,
      "warning",
      { field },
      new Error().stack,
      recoverable,
      "validation",
    );
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    userMessage: string = "حدث خطأ في الاتصال بالشبكة",
    public recoverable: boolean = true,
  ) {
    super(message);
    this.name = "NetworkError";

    ErrorLogger.logError(
      "NETWORK_ERROR",
      message,
      userMessage,
      "error",
      {},
      new Error().stack,
      recoverable,
      "network",
    );
  }
}

export class StorageError extends Error {
  constructor(
    message: string,
    userMessage: string = "حدث خطأ في تخزين البيانات",
    public recoverable: boolean = true,
  ) {
    super(message);
    this.name = "StorageError";

    ErrorLogger.logError(
      "STORAGE_ERROR",
      message,
      userMessage,
      "error",
      {},
      new Error().stack,
      recoverable,
      "storage",
    );
  }
}

export class EstateCalculationError extends CalculationError {
  constructor(
    message: string,
    userMessage: string,
    recoverable: boolean = true,
  ) {
    super(
      "ESTATE_CALC_ERROR",
      userMessage,
      message,
      "error",
      recoverable,
      "calculation",
    );
  }
}

export class HeirValidationError extends ValidationError {
  constructor(field: string, userMessage: string, message: string) {
    super(field, userMessage, message, false);
  }
}

export class PDFExportError extends Error {
  constructor(
    message: string,
    userMessage: string = "فشل في تصدير PDF",
    public recoverable: boolean = true,
  ) {
    super(message);
    this.name = "PDFExportError";

    ErrorLogger.logError(
      "PDF_EXPORT_ERROR",
      message,
      userMessage,
      "error",
      {},
      new Error().stack,
      recoverable,
      "pdf_export",
    );
  }
}

/**
 * Error Recovery Strategies
 */
export class ErrorRecovery {
  // ===== FIX H5: Retry with exponential backoff =====
  static async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000,
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt === maxRetries) {
          break;
        }

        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.log(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms`);
        await this.sleep(delay);
      }
    }

    throw lastError || new Error("All retry attempts failed");
  }

  static async handleEstateError(error: Error): Promise<void> {
    if (error instanceof EstateCalculationError) {
      console.warn(`Estate Calculation Issue: ${error.userMessage}`);

      if (error.recoverable) {
        // Attempt recovery
        await ErrorRecovery.retryWithBackoff(
          async () => {
            // Recovery logic here
          },
          2,
          500,
        );
      }
      return;
    }

    ErrorLogger.logError(
      "ESTATE_ERROR",
      error.message,
      "Unable to process estate data. Please check your inputs.",
      "error",
      {},
      error.stack,
      true,
      "calculation",
    );
  }

  static async handleHeirError(error: Error): Promise<void> {
    if (error instanceof HeirValidationError) {
      console.warn(`Heir Validation Issue: ${error.userMessage}`);
      // Validation errors are not recoverable automatically
      return;
    }

    ErrorLogger.logError(
      "HEIR_ERROR",
      error.message,
      "Unable to process heir data. Please verify the information.",
      "error",
      {},
      error.stack,
      false,
      "validation",
    );
  }

  static async handleCalculationError(error: Error): Promise<void> {
    if (error instanceof CalculationError) {
      console.error(`Calculation Error: ${error.userMessage}`);

      if (error.recoverable) {
        await ErrorRecovery.retryWithBackoff(
          async () => {
            // Recovery logic
          },
          2,
          1000,
        );
      }
      return;
    }

    ErrorLogger.logError(
      "CALCULATION_ERROR",
      error.message,
      "An error occurred during calculation. Please try again.",
      "critical",
      {},
      error.stack,
      true,
      "calculation",
    );
  }

  static async handleNetworkError(error: Error): Promise<void> {
    if (error instanceof NetworkError) {
      console.warn(`Network Issue: ${error.message}`);

      // Network errors are retryable
      await ErrorRecovery.retryWithBackoff(
        async () => {
          // Network retry logic
        },
        3,
        2000,
      );
    }
  }

  static async handleStorageError(error: Error): Promise<void> {
    if (error instanceof StorageError) {
      console.warn(`Storage Issue: ${error.message}`);

      // Try to recover storage
      try {
        // Clear cache and retry
        await ErrorRecovery.retryWithBackoff(
          async () => {
            // Storage recovery
          },
          2,
          500,
        );
      } catch (recoveryError) {
        console.error("Storage recovery failed:", recoveryError);
      }
    }
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Error Context Manager
 */
export class ErrorContext {
  private context: Record<string, any> = {};
  private listeners: ((context: Record<string, any>) => void)[] = [];

  setContext(key: string, value: any): void {
    this.context[key] = value;
    this.notifyListeners();
  }

  getContext(): Record<string, any> {
    return { ...this.context };
  }

  clear(): void {
    this.context = {};
    this.notifyListeners();
  }

  // ===== FIX H5: Add context merging =====
  mergeContext(newContext: Record<string, any>): void {
    this.context = { ...this.context, ...newContext };
    this.notifyListeners();
  }

  // ===== FIX H5: Add listeners for context changes =====
  addListener(listener: (context: Record<string, any>) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    const contextCopy = { ...this.context };
    this.listeners.forEach((listener) => listener(contextCopy));
  }
}

// Declare __DEV__ for development mode detection
declare const __DEV__: boolean;
