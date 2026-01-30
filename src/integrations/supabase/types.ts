export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_insights: {
        Row: {
          confidence_score: number | null
          content: string
          expires_at: string | null
          factors: Json | null
          generated_at: string | null
          id: string
          insight_type: string
          model_version: string | null
          recommendations: Json | null
          smb_entity_id: string | null
          tenant_id: string
          title: string
        }
        Insert: {
          confidence_score?: number | null
          content: string
          expires_at?: string | null
          factors?: Json | null
          generated_at?: string | null
          id?: string
          insight_type: string
          model_version?: string | null
          recommendations?: Json | null
          smb_entity_id?: string | null
          tenant_id: string
          title: string
        }
        Update: {
          confidence_score?: number | null
          content?: string
          expires_at?: string | null
          factors?: Json | null
          generated_at?: string | null
          id?: string
          insight_type?: string
          model_version?: string | null
          recommendations?: Json | null
          smb_entity_id?: string | null
          tenant_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_smb_entity_id_fkey"
            columns: ["smb_entity_id"]
            isOneToOne: false
            referencedRelation: "smb_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_insights_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string | null
          created_by: string
          environment: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          rate_limit_per_minute: number | null
          revoked_at: string | null
          revoked_by: string | null
          scopes: string[] | null
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          environment?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          rate_limit_per_minute?: number | null
          revoked_at?: string | null
          revoked_by?: string | null
          scopes?: string[] | null
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          environment?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          rate_limit_per_minute?: number | null
          revoked_at?: string | null
          revoked_by?: string | null
          scopes?: string[] | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      api_usage_logs: {
        Row: {
          api_key_id: string
          created_at: string | null
          endpoint: string
          error_message: string | null
          id: string
          ip_address: unknown
          latency_ms: number | null
          method: string
          request_size_bytes: number | null
          response_size_bytes: number | null
          status_code: number | null
          tenant_id: string
        }
        Insert: {
          api_key_id: string
          created_at?: string | null
          endpoint: string
          error_message?: string | null
          id?: string
          ip_address?: unknown
          latency_ms?: number | null
          method: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          status_code?: number | null
          tenant_id: string
        }
        Update: {
          api_key_id?: string
          created_at?: string | null
          endpoint?: string
          error_message?: string | null
          id?: string
          ip_address?: unknown
          latency_ms?: number | null
          method?: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          status_code?: number | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_usage_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          application_data: Json | null
          created_at: string | null
          decided_at: string | null
          decided_by: string | null
          decision_data: Json | null
          id: string
          offer_id: string | null
          portfolio_id: string
          requested_amount: number | null
          requested_term_months: number | null
          smb_entity_id: string
          status: Database["public"]["Enums"]["application_status"] | null
          submitted_at: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          application_data?: Json | null
          created_at?: string | null
          decided_at?: string | null
          decided_by?: string | null
          decision_data?: Json | null
          id?: string
          offer_id?: string | null
          portfolio_id: string
          requested_amount?: number | null
          requested_term_months?: number | null
          smb_entity_id: string
          status?: Database["public"]["Enums"]["application_status"] | null
          submitted_at?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          application_data?: Json | null
          created_at?: string | null
          decided_at?: string | null
          decided_by?: string | null
          decision_data?: Json | null
          id?: string
          offer_id?: string | null
          portfolio_id?: string
          requested_amount?: number | null
          requested_term_months?: number | null
          smb_entity_id?: string
          status?: Database["public"]["Enums"]["application_status"] | null
          submitted_at?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "prequal_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_smb_entity_id_fkey"
            columns: ["smb_entity_id"]
            isOneToOne: false
            referencedRelation: "smb_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown
          resource_id: string | null
          resource_type: string
          session_id: string | null
          tenant_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type: string
          session_id?: string | null
          tenant_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string
          session_id?: string | null
          tenant_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      business_owners: {
        Row: {
          address_city: string | null
          address_state: string | null
          address_street: string | null
          address_zip: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          first_name: string
          id: string
          is_guarantor: boolean | null
          last_name: string
          ownership_percentage: number | null
          phone: string | null
          smb_entity_id: string
          ssn_last_four: string | null
          updated_at: string | null
        }
        Insert: {
          address_city?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name: string
          id?: string
          is_guarantor?: boolean | null
          last_name: string
          ownership_percentage?: number | null
          phone?: string | null
          smb_entity_id: string
          ssn_last_four?: string | null
          updated_at?: string | null
        }
        Update: {
          address_city?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string
          id?: string
          is_guarantor?: boolean | null
          last_name?: string
          ownership_percentage?: number | null
          phone?: string | null
          smb_entity_id?: string
          ssn_last_four?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_owners_smb_entity_id_fkey"
            columns: ["smb_entity_id"]
            isOneToOne: false
            referencedRelation: "smb_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_scores: {
        Row: {
          consent_id: string | null
          created_at: string | null
          expires_at: string | null
          factors: Json | null
          id: string
          owner_id: string | null
          pulled_at: string | null
          raw_response: Json | null
          risk_class: string | null
          score: number | null
          score_range_max: number | null
          score_range_min: number | null
          score_type: string
          smb_entity_id: string
          source: Database["public"]["Enums"]["score_source"]
          tenant_id: string
        }
        Insert: {
          consent_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          factors?: Json | null
          id?: string
          owner_id?: string | null
          pulled_at?: string | null
          raw_response?: Json | null
          risk_class?: string | null
          score?: number | null
          score_range_max?: number | null
          score_range_min?: number | null
          score_type: string
          smb_entity_id: string
          source: Database["public"]["Enums"]["score_source"]
          tenant_id: string
        }
        Update: {
          consent_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          factors?: Json | null
          id?: string
          owner_id?: string | null
          pulled_at?: string | null
          raw_response?: Json | null
          risk_class?: string | null
          score?: number | null
          score_range_max?: number | null
          score_range_min?: number | null
          score_type?: string
          smb_entity_id?: string
          source?: Database["public"]["Enums"]["score_source"]
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_scores_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "business_owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_scores_smb_entity_id_fkey"
            columns: ["smb_entity_id"]
            isOneToOne: false
            referencedRelation: "smb_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_scores_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      data_lineage: {
        Row: {
          consent_reference: string | null
          coverage_pct: number | null
          created_at: string | null
          freshness_hours: number | null
          id: string
          metadata: Json | null
          pulled_at: string
          resource_id: string
          resource_type: string
          source_name: string
          source_type: string
          tenant_id: string
        }
        Insert: {
          consent_reference?: string | null
          coverage_pct?: number | null
          created_at?: string | null
          freshness_hours?: number | null
          id?: string
          metadata?: Json | null
          pulled_at: string
          resource_id: string
          resource_type: string
          source_name: string
          source_type: string
          tenant_id: string
        }
        Update: {
          consent_reference?: string | null
          coverage_pct?: number | null
          created_at?: string | null
          freshness_hours?: number | null
          id?: string
          metadata?: Json | null
          pulled_at?: string
          resource_id?: string
          resource_type?: string
          source_name?: string
          source_type?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_lineage_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      ews_queue: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          created_at: string | null
          description: string | null
          id: string
          is_acknowledged: boolean | null
          portfolio_id: string
          severity: string
          smb_entity_id: string
          tenant_id: string
          threshold_value: number | null
          trigger_value: number | null
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_acknowledged?: boolean | null
          portfolio_id: string
          severity: string
          smb_entity_id: string
          tenant_id: string
          threshold_value?: number | null
          trigger_value?: number | null
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_acknowledged?: boolean | null
          portfolio_id?: string
          severity?: string
          smb_entity_id?: string
          tenant_id?: string
          threshold_value?: number | null
          trigger_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ews_queue_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ews_queue_smb_entity_id_fkey"
            columns: ["smb_entity_id"]
            isOneToOne: false
            referencedRelation: "smb_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ews_queue_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_access: {
        Row: {
          can_create_keys: boolean | null
          can_export: boolean | null
          created_at: string | null
          id: string
          portfolio_id: string
          user_id: string
        }
        Insert: {
          can_create_keys?: boolean | null
          can_export?: boolean | null
          created_at?: string | null
          id?: string
          portfolio_id: string
          user_id: string
        }
        Update: {
          can_create_keys?: boolean | null
          can_export?: boolean | null
          created_at?: string | null
          id?: string
          portfolio_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_access_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          code: string
          config: Json | null
          created_at: string | null
          id: string
          name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          code: string
          config?: Json | null
          created_at?: string | null
          id?: string
          name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          config?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      prequal_offers: {
        Row: {
          amount_max: number | null
          amount_min: number | null
          created_at: string | null
          eligibility_factors: Json | null
          expires_at: string | null
          id: string
          portfolio_id: string
          product_type: string
          rate_max: number | null
          rate_min: number | null
          required_docs: Json | null
          ruleset_id: string | null
          smb_entity_id: string
          status: Database["public"]["Enums"]["offer_status"] | null
          tenant_id: string
          term_months_max: number | null
          term_months_min: number | null
          viewed_at: string | null
        }
        Insert: {
          amount_max?: number | null
          amount_min?: number | null
          created_at?: string | null
          eligibility_factors?: Json | null
          expires_at?: string | null
          id?: string
          portfolio_id: string
          product_type: string
          rate_max?: number | null
          rate_min?: number | null
          required_docs?: Json | null
          ruleset_id?: string | null
          smb_entity_id: string
          status?: Database["public"]["Enums"]["offer_status"] | null
          tenant_id: string
          term_months_max?: number | null
          term_months_min?: number | null
          viewed_at?: string | null
        }
        Update: {
          amount_max?: number | null
          amount_min?: number | null
          created_at?: string | null
          eligibility_factors?: Json | null
          expires_at?: string | null
          id?: string
          portfolio_id?: string
          product_type?: string
          rate_max?: number | null
          rate_min?: number | null
          required_docs?: Json | null
          ruleset_id?: string | null
          smb_entity_id?: string
          status?: Database["public"]["Enums"]["offer_status"] | null
          tenant_id?: string
          term_months_max?: number | null
          term_months_min?: number | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prequal_offers_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prequal_offers_ruleset_id_fkey"
            columns: ["ruleset_id"]
            isOneToOne: false
            referencedRelation: "underwriting_rulesets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prequal_offers_smb_entity_id_fkey"
            columns: ["smb_entity_id"]
            isOneToOne: false
            referencedRelation: "smb_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prequal_offers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          last_login: string | null
          mfa_enabled: boolean | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          last_login?: string | null
          mfa_enabled?: boolean | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_login?: string | null
          mfa_enabled?: boolean | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      report_jobs: {
        Row: {
          artifact_expires_at: string | null
          artifact_url: string | null
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          format: string | null
          id: string
          parameters: Json | null
          portfolio_id: string | null
          report_type: string
          requested_by: string
          started_at: string | null
          status: Database["public"]["Enums"]["report_status"] | null
          tenant_id: string
        }
        Insert: {
          artifact_expires_at?: string | null
          artifact_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          format?: string | null
          id?: string
          parameters?: Json | null
          portfolio_id?: string | null
          report_type: string
          requested_by: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          tenant_id: string
        }
        Update: {
          artifact_expires_at?: string | null
          artifact_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          format?: string | null
          id?: string
          parameters?: Json | null
          portfolio_id?: string | null
          report_type?: string
          requested_by?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_jobs_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_jobs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_aggregates: {
        Row: {
          aggregate_date: string
          avg_value: number | null
          computed_at: string | null
          count: number | null
          dimension: string | null
          dimension_value: string | null
          id: string
          max_value: number | null
          metric_type: string
          min_value: number | null
          portfolio_id: string
          sum_value: number | null
          tenant_id: string
        }
        Insert: {
          aggregate_date: string
          avg_value?: number | null
          computed_at?: string | null
          count?: number | null
          dimension?: string | null
          dimension_value?: string | null
          id?: string
          max_value?: number | null
          metric_type: string
          min_value?: number | null
          portfolio_id: string
          sum_value?: number | null
          tenant_id: string
        }
        Update: {
          aggregate_date?: string
          avg_value?: number | null
          computed_at?: string | null
          count?: number | null
          dimension?: string | null
          dimension_value?: string | null
          id?: string
          max_value?: number | null
          metric_type?: string
          min_value?: number | null
          portfolio_id?: string
          sum_value?: number | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_aggregates_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_aggregates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      score_history: {
        Row: {
          credit_score_id: string
          delta: number | null
          id: string
          recorded_at: string | null
          score: number
          smb_entity_id: string
          source: Database["public"]["Enums"]["score_source"]
        }
        Insert: {
          credit_score_id: string
          delta?: number | null
          id?: string
          recorded_at?: string | null
          score: number
          smb_entity_id: string
          source: Database["public"]["Enums"]["score_source"]
        }
        Update: {
          credit_score_id?: string
          delta?: number | null
          id?: string
          recorded_at?: string | null
          score?: number
          smb_entity_id?: string
          source?: Database["public"]["Enums"]["score_source"]
        }
        Relationships: [
          {
            foreignKeyName: "score_history_credit_score_id_fkey"
            columns: ["credit_score_id"]
            isOneToOne: false
            referencedRelation: "credit_scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "score_history_smb_entity_id_fkey"
            columns: ["smb_entity_id"]
            isOneToOne: false
            referencedRelation: "smb_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      smb_entities: {
        Row: {
          address_city: string | null
          address_state: string | null
          address_street: string | null
          address_zip: string | null
          annual_revenue: number | null
          business_name: string
          business_type: string | null
          created_at: string | null
          dba_name: string | null
          duns_number: string | null
          ein: string | null
          email: string | null
          employee_count: number | null
          formation_date: string | null
          id: string
          metadata: Json | null
          naics_code: string | null
          phone: string | null
          portfolio_id: string
          sic_code: string | null
          tenant_id: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address_city?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          annual_revenue?: number | null
          business_name: string
          business_type?: string | null
          created_at?: string | null
          dba_name?: string | null
          duns_number?: string | null
          ein?: string | null
          email?: string | null
          employee_count?: number | null
          formation_date?: string | null
          id?: string
          metadata?: Json | null
          naics_code?: string | null
          phone?: string | null
          portfolio_id: string
          sic_code?: string | null
          tenant_id: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address_city?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          annual_revenue?: number | null
          business_name?: string
          business_type?: string | null
          created_at?: string | null
          dba_name?: string | null
          duns_number?: string | null
          ein?: string | null
          email?: string | null
          employee_count?: number | null
          formation_date?: string | null
          id?: string
          metadata?: Json | null
          naics_code?: string | null
          phone?: string | null
          portfolio_id?: string
          sic_code?: string | null
          tenant_id?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "smb_entities_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "smb_entities_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          name: string
          session_timeout_minutes: number | null
          slug: string
          sso_provider: string | null
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          name: string
          session_timeout_minutes?: number | null
          slug: string
          sso_provider?: string | null
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          session_timeout_minutes?: number | null
          slug?: string
          sso_provider?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      underwriting_rulesets: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          portfolio_id: string | null
          rules: Json
          tenant_id: string
          thresholds: Json
          updated_at: string | null
          validated_at: string | null
          validated_by: string | null
          version: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          portfolio_id?: string | null
          rules?: Json
          tenant_id: string
          thresholds?: Json
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
          version: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          portfolio_id?: string | null
          rules?: Json
          tenant_id?: string
          thresholds?: Json
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "underwriting_rulesets_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "underwriting_rulesets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_configs: {
        Row: {
          created_at: string | null
          events: string[] | null
          failure_count: number | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          name: string
          secret_hash: string | null
          tenant_id: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          events?: string[] | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          name: string
          secret_hash?: string | null
          tenant_id: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          events?: string[] | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          name?: string
          secret_hash?: string | null
          tenant_id?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_configs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tenant_id: { Args: { _user_id: string }; Returns: string }
      has_portfolio_access: {
        Args: { _portfolio_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _tenant_id: string
          _user_id: string
        }
        Returns: boolean
      }
      has_tenant_access: {
        Args: { _tenant_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "developer"
        | "risk_analyst"
        | "relationship_manager"
        | "readonly"
      application_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "declined"
        | "expired"
      audit_action:
        | "VIEW_PII"
        | "SOFT_PULL_REQUESTED"
        | "SCORE_VIEWED"
        | "PREQUAL_GENERATED"
        | "APPLICATION_SUBMITTED"
        | "REPORT_GENERATED"
        | "REPORT_DOWNLOADED"
        | "API_KEY_CREATED"
        | "API_KEY_REVOKED"
        | "SETTINGS_CHANGED"
        | "ROLE_CHANGED"
        | "DATA_EXPORTED"
        | "LOGIN"
        | "LOGOUT"
      offer_status: "generated" | "viewed" | "accepted" | "declined" | "expired"
      report_status: "pending" | "processing" | "ready" | "failed"
      score_source:
        | "experian_business"
        | "experian_consumer"
        | "equifax_business"
        | "equifax_consumer"
        | "dnb"
        | "fico"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "developer",
        "risk_analyst",
        "relationship_manager",
        "readonly",
      ],
      application_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "declined",
        "expired",
      ],
      audit_action: [
        "VIEW_PII",
        "SOFT_PULL_REQUESTED",
        "SCORE_VIEWED",
        "PREQUAL_GENERATED",
        "APPLICATION_SUBMITTED",
        "REPORT_GENERATED",
        "REPORT_DOWNLOADED",
        "API_KEY_CREATED",
        "API_KEY_REVOKED",
        "SETTINGS_CHANGED",
        "ROLE_CHANGED",
        "DATA_EXPORTED",
        "LOGIN",
        "LOGOUT",
      ],
      offer_status: ["generated", "viewed", "accepted", "declined", "expired"],
      report_status: ["pending", "processing", "ready", "failed"],
      score_source: [
        "experian_business",
        "experian_consumer",
        "equifax_business",
        "equifax_consumer",
        "dnb",
        "fico",
      ],
    },
  },
} as const
