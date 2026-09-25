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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      abox_is_tenant_member: { Args: { p_tenant_id: string }; Returns: boolean }
      abox_m06_permissions_for_role: {
        Args: { p_role_code: string }
        Returns: string[]
      }
      abox_resolve_context: { Args: { p_user_id: string }; Returns: Json }
      abox_sync_m06_grants: {
        Args: {
          p_organization_id: string
          p_role_code: string
          p_tenant_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      gov_recon_candidate: {
        Args: { p_cand: string; p_run: string }
        Returns: Json
      }
      gov_recon_decisions: {
        Args: { p_issue: string; p_run: string; p_state: string }
        Returns: Json
      }
      gov_recon_load: {
        Args: {
          p_file_hash: string
          p_m00: Json
          p_m00_hash: string
          p_run: Json
        }
        Returns: Json
      }
      gov_recon_me: { Args: never; Returns: Json }
      gov_recon_overview: { Args: never; Returns: Json }
      gov_recon_propose: {
        Args: {
          p_cand_ids: string[]
          p_evidence_refs: Json
          p_idem: string
          p_issue_ids: string[]
          p_outcome: Json
          p_rationale: string
          p_run: string
          p_type: string
        }
        Returns: Json
      }
      gov_recon_queue: {
        Args: {
          p_limit: number
          p_offset: number
          p_run: string
          p_search: string
          p_sem: string
          p_severity: string
          p_type: string
        }
        Returns: Json
      }
      gov_recon_review: {
        Args: {
          p_action: string
          p_decision: string
          p_idem: string
          p_rationale: string
        }
        Returns: Json
      }
      gov_recon_set: {
        Args: { p_action: string; p_idem: string; p_run: string; p_set: string }
        Returns: Json
      }
      lucie_m06_api: {
        Args: {
          p_is_platform_admin?: boolean
          p_op: string
          p_organization_id?: string
          p_payload?: Json
          p_tenant_id?: string
          p_user_id?: string
        }
        Returns: Json
      }
      m00_api: {
        Args: {
          p_idempotency_key?: string
          p_is_platform_admin?: boolean
          p_op: string
          p_payload?: Json
          p_tenant_id?: string
          p_user_id?: string
        }
        Returns: Json
      }
      m00_emit: {
        Args: {
          p_actor: string
          p_aggregate_id: string
          p_aggregate_type: string
          p_audit_code: string
          p_correlation: string
          p_event_name: string
          p_payload: Json
          p_tenant_id: string
        }
        Returns: string
      }
      m00_foundation_status: { Args: never; Returns: Json }
      m00_set_request_context: {
        Args: {
          p_is_platform_admin: boolean
          p_tenant_id: string
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
