export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          owner_user_id: string
          brand_name: string
          domain: string
          industry: string
          created_at: string
        }
        Insert: {
          id?: string
          owner_user_id: string
          brand_name: string
          domain: string
          industry: string
          created_at?: string
        }
        Update: {
          id?: string
          owner_user_id?: string
          brand_name?: string
          domain?: string
          industry?: string
          created_at?: string
        }
      }
      org_members: {
        Row: {
          org_id: string
          user_id: string
          role: string
        }
        Insert: {
          org_id: string
          user_id: string
          role?: string
        }
        Update: {
          org_id?: string
          user_id?: string
          role?: string
        }
      }
      runs: {
        Row: {
          id: string
          org_id: string
          scoring_version: string
          url_budget: number
          started_at: string
          finished_at: string | null
          total_score: number | null
          readiness_rank: string | null
          status: string
        }
        Insert: {
          id?: string
          org_id: string
          scoring_version: string
          url_budget: number
          started_at?: string
          finished_at?: string | null
          total_score?: number | null
          readiness_rank?: string | null
          status?: string
        }
        Update: {
          id?: string
          org_id?: string
          scoring_version?: string
          url_budget?: number
          started_at?: string
          finished_at?: string | null
          total_score?: number | null
          readiness_rank?: string | null
          status?: string
        }
      }
      queries: {
        Row: {
          id: string
          run_id: string
          scenario_key: string
          prompt: string
          locale: string
        }
        Insert: {
          id?: string
          run_id: string
          scenario_key: string
          prompt: string
          locale?: string
        }
        Update: {
          id?: string
          run_id?: string
          scenario_key?: string
          prompt?: string
          locale?: string
        }
      }
      answers: {
        Row: {
          id: string
          query_id: string
          provider: string
          answer_text: string
          citations: Json
          features: Json
          raw_json: Json
          retrieved_at: string
        }
        Insert: {
          id?: string
          query_id: string
          provider: string
          answer_text: string
          citations: Json
          features: Json
          raw_json: Json
          retrieved_at?: string
        }
        Update: {
          id?: string
          query_id?: string
          provider?: string
          answer_text?: string
          citations?: Json
          features?: Json
          raw_json?: Json
          retrieved_at?: string
        }
      }
      crawled_pages: {
        Row: {
          id: string
          run_id: string
          url: string
          status: number | null
          main_text: string | null
          html_hash: string | null
          passed_checks: Json
        }
        Insert: {
          id?: string
          run_id: string
          url: string
          status?: number | null
          main_text?: string | null
          html_hash?: string | null
          passed_checks?: Json
        }
        Update: {
          id?: string
          run_id?: string
          url?: string
          status?: number | null
          main_text?: string | null
          html_hash?: string | null
          passed_checks?: Json
        }
      }
      metrics: {
        Row: {
          id: string
          run_id: string
          content_quality_score: number | null
          technical_foundation_score: number | null
          authority_trust_score: number | null
          prompt_scenarios_score: number | null
        }
        Insert: {
          id?: string
          run_id: string
          content_quality_score?: number | null
          technical_foundation_score?: number | null
          authority_trust_score?: number | null
          prompt_scenarios_score?: number | null
        }
        Update: {
          id?: string
          run_id?: string
          content_quality_score?: number | null
          technical_foundation_score?: number | null
          authority_trust_score?: number | null
          prompt_scenarios_score?: number | null
        }
      }
      snapshots: {
        Row: {
          id: string
          answer_id: string
          html_fragment: string | null
          image_path: string | null
          created_at: string
        }
        Insert: {
          id?: string
          answer_id: string
          html_fragment?: string | null
          image_path?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          answer_id?: string
          html_fragment?: string | null
          image_path?: string | null
          created_at?: string
        }
      }
      scoring_weights: {
        Row: {
          id: string
          scoring_version: string
          weights: Json
          created_at: string
          is_active: boolean | null
        }
        Insert: {
          id?: string
          scoring_version: string
          weights: Json
          created_at?: string
          is_active?: boolean | null
        }
        Update: {
          id?: string
          scoring_version?: string
          weights?: Json
          created_at?: string
          is_active?: boolean | null
        }
      }
      logs: {
        Row: {
          id: string
          level: string
          message: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          level: string
          message: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          level?: string
          message?: string
          metadata?: Json | null
          created_at?: string
        }
      }
    }
  }
}

