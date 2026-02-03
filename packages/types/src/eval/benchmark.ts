/**
 * Evaluation Benchmark Types
 * Defines scoring rules and benchmark configurations for agent evaluation
 */

/**
 * Rubric scoring method types
 */
export type RubricType =
  // Deterministic matching
  | 'equals' // Exact match
  | 'contains' // Contains
  | 'regex' // Regular expression
  | 'starts-with'
  | 'ends-with'
  | 'json-schema' // JSON structure validation
  | 'javascript' // JS script
  | 'python' // Python script
  // LLM scoring
  | 'llm-rubric' // Natural language rubric
  | 'factuality' // Factuality check
  | 'answer-relevance' // Answer relevance
  // Similarity
  | 'similar' // Semantic similarity
  | 'levenshtein'; // Edit distance

/**
 * Rubric config for equals, contains, starts-with, ends-with
 */
export interface RubricConfigValue {
  value: string;
}

/**
 * Rubric config for regex
 */
export interface RubricConfigRegex {
  pattern: string;
}

/**
 * Rubric config for json-schema
 */
export interface RubricConfigJsonSchema {
  schema: Record<string, unknown>;
}

/**
 * Rubric config for javascript, python
 */
export interface RubricConfigScript {
  code: string;
}

/**
 * Rubric config for llm-rubric, factuality, answer-relevance
 */
export interface RubricConfigLLM {
  criteria: string;
  model?: string;
  provider?: string;
}

/**
 * Rubric config for similar, levenshtein
 */
export interface RubricConfigSimilarity {
  threshold?: number;
  value: string;
}

/**
 * Union type for all rubric configs
 */
export type RubricConfig =
  | RubricConfigJsonSchema
  | RubricConfigLLM
  | RubricConfigRegex
  | RubricConfigScript
  | RubricConfigSimilarity
  | RubricConfigValue;

/**
 * Evaluation rubric definition
 */
export interface EvalBenchmarkRubric {
  config: RubricConfig;
  id: string;
  name: string;
  threshold?: number;
  type: RubricType;
  weight: number;
}
