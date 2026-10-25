export type Priority = "P0" | "P1";

export type Spec = {
  product_name: string;
  one_liner: string;
  problem: string;
  target_users: { persona: string; pain: string }[];
  core_features: { name: string; description: string; priority: Priority }[];
  user_flow: string[];
  screens: { name: string; purpose: string }[];
  data_model: { table: string; columns: string[] }[];
  api_endpoints: {
    method: "GET" | "POST" | "PATCH" | "DELETE";
    path: string;
    description: string;
  }[];
  out_of_scope: string[];
  risks: string[];
  first_prompt: string;
  participant_guide: {
    purpose: string;
    schedule: string;
    venue: string;
    items_to_prepare: string;
    dietary_notice: string;
  };
};

export type CreateSpecInput = {
  title: string;
  problem: string;
  target: string;
  timeframe: "1주" | "2주" | "1달";
};

export type SpecListItem = {
  id: string;
  created_at: string;
  title: string;
  product_name: string;
  timeframe: string;
  one_liner: string;
};

export type RegistrationForm = {
  event_name: string;
  guide: Spec["participant_guide"];
};

export type RegistrationResponse = {
  id: string;
  created_at: string;
  name: string;
  preferred_language: string;
  dietary_allergies: string;
  support_needs: string;
};
