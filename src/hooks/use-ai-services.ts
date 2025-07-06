/**
 * React hook for AI services integration
 */

import { useState, useEffect, useCallback } from 'react';
import { aiServices, aiServiceUtils, AIServicesError } from '../lib/ai-services';
import type { HealthCheckResponse } from '../lib/ai-services';

export interface UseAIServicesResult {
  isHealthy: boolean;
  isLoading: boolean;
  error: string | null;
  lastHealthCheck: HealthCheckResponse | null;
  checkHealth: () => Promise<void>;
  retryWithBackoff: <T>(operation: () => Promise<T>) => Promise<T>;
}

/**
 * Hook for managing AI services health and providing utility functions
 */
export function useAIServices(): UseAIServicesResult {
  const [isHealthy, setIsHealthy] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastHealthCheck, setLastHealthCheck] = useState<HealthCheckResponse | null>(null);

  const checkHealth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const healthResponse = await aiServiceUtils.healthCheckWithRetry(3, 1000);
      setLastHealthCheck(healthResponse);
      setIsHealthy(healthResponse.status === 'healthy');
    } catch (err) {
      const errorMessage = err instanceof AIServicesError 
        ? err.message 
        : 'Health check failed';
      setError(errorMessage);
      setIsHealthy(false);
      console.error('AI Services health check failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retryWithBackoff = useCallback(async <T>(operation: () => Promise<T>): Promise<T> => {
    return aiServiceUtils.withRetry(operation, 3, 1000);
  }, []);

  // Perform initial health check
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Set up periodic health checks (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      checkHealth();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    isHealthy,
    isLoading,
    error,
    lastHealthCheck,
    checkHealth,
    retryWithBackoff
  };
}

/**
 * Hook for individual generator operations
 */
export interface UseGeneratorResult {
  isGenerating: boolean;
  result: any;
  error: string | null;
  generate: (prompt: string) => Promise<void>;
  clear: () => void;
}

export function useGenerator(
  generatorFunction: (prompt: string) => Promise<any>
): UseGeneratorResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { retryWithBackoff } = useAIServices();

  const generate = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      setError('Prompt cannot be empty');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const generatedResult = await retryWithBackoff(() => generatorFunction(prompt));
      setResult(generatedResult);
    } catch (err) {
      const errorMessage = err instanceof AIServicesError 
        ? err.message 
        : 'Generation failed. Please try again.';
      setError(errorMessage);
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [generatorFunction, retryWithBackoff]);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    isGenerating,
    result,
    error,
    generate,
    clear
  };
}