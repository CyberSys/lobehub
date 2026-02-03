/**
 * Agent Evaluation Types
 * Defines test cases, run configurations, and metadata for agent evaluation
 */

/**
 * Test case content structure
 */
export interface EvalTestCaseContent {
  context?: Record<string, unknown>;
  expected?: string;
  input: string;
}

/**
 * Test case metadata
 */
export interface EvalTestCaseMetadata {
  [key: string]: unknown;
  difficulty?: 'easy' | 'hard' | 'medium';
  source?: string;
  tags?: string[];
}

/**
 * Evaluation run status
 */
export type EvalRunStatus = 'aborted' | 'completed' | 'failed' | 'pending' | 'running';

/**
 * Evaluation run configuration
 */
export interface EvalRunConfig {
  [key: string]: unknown;
  judgeModel?: string;
  judgeProvider?: string;
  maxConcurrency?: number;
  timeout?: number;
}

/**
 * Evaluation run metrics/statistics
 */
export interface EvalRunMetrics {
  [key: string]: unknown;
  averageScore: number;
  duration?: number;
  failedCases: number;
  passRate: number;
  passedCases: number;
  rubricScores?: Record<string, number>;
  totalCases: number;
}

/**
 * Evaluation topic metadata extension
 */
export interface EvalTopicMetadata {
  benchmarkId: string;
  datasetId: string;
  evalRunId: string;
  testCaseId: string;
}

/**
 * Individual rubric score result
 */
export interface EvalRubricScore {
  reason?: string;
  rubricId: string;
  score: number;
}

/**
 * Evaluation thread metadata extension
 */
export interface EvalThreadMetadata {
  completedAt?: string;
  duration?: number;
  error?: string;
  passed?: boolean;
  scores?: EvalRubricScore[];
  testCaseId: string;
  totalScore?: number;
}
