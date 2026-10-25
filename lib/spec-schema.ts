export const specSchema = {
  type: "object",
  additionalProperties: false,
  required: ["product_name", "one_liner", "problem", "target_users", "core_features", "user_flow", "screens", "data_model", "api_endpoints", "out_of_scope", "risks", "first_prompt"],
  properties: {
    product_name: { type: "string" }, one_liner: { type: "string" }, problem: { type: "string" },
    target_users: { type: "array", items: { type: "object", additionalProperties: false, required: ["persona", "pain"], properties: { persona: { type: "string" }, pain: { type: "string" } } } },
    core_features: { type: "array", items: { type: "object", additionalProperties: false, required: ["name", "description", "priority"], properties: { name: { type: "string" }, description: { type: "string" }, priority: { type: "string", enum: ["P0", "P1"] } } } },
    user_flow: { type: "array", items: { type: "string" } },
    screens: { type: "array", items: { type: "object", additionalProperties: false, required: ["name", "purpose"], properties: { name: { type: "string" }, purpose: { type: "string" } } } },
    data_model: { type: "array", items: { type: "object", additionalProperties: false, required: ["table", "columns"], properties: { table: { type: "string" }, columns: { type: "array", items: { type: "string" } } } } },
    api_endpoints: { type: "array", items: { type: "object", additionalProperties: false, required: ["method", "path", "description"], properties: { method: { type: "string", enum: ["GET", "POST", "PATCH", "DELETE"] }, path: { type: "string" }, description: { type: "string" } } } },
    out_of_scope: { type: "array", items: { type: "string" } }, risks: { type: "array", items: { type: "string" } }, first_prompt: { type: "string" },
  },
} as const;
