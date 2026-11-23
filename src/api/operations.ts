/**
 * Pure helpers for configurable operations (no React Native imports, usable from Node smoke
 * scripts). The editors live in `@/components/form/configurable-operation`, which re-exports these.
 */
/** Same shape as the schema's `ConfigurableOperationInput`. */
export interface ConfigurableOperationInput {
  code: string;
  arguments: { name: string; value: string }[];
}

/** Selection for definitions; spread into your query: `…{ code description args { …ConfigArgDef } }`. */
export interface OperationDefinition {
  code: string;
  description: string;
  args: {
    name: string;
    type: string;
    list: boolean;
    required: boolean;
    defaultValue?: unknown;
    label?: string | null;
    description?: string | null;
    ui?: unknown;
  }[];
}

export type ArgDef = OperationDefinition['args'][number];

/** Converts a stored operation (`{ code, args }`) into the input shape (`{ code, arguments }`). */
export function toOperationInput(op: {
  code: string;
  args: { name: string; value: string }[];
}): ConfigurableOperationInput {
  return {
    code: op.code,
    arguments: op.args.map((a) => ({ name: a.name, value: a.value })),
  };
}

/** A fresh operation with each argument's default value. */
export function defaultOperation(def: OperationDefinition): ConfigurableOperationInput {
  return {
    code: def.code,
    arguments: def.args.map((a) => ({
      name: a.name,
      value:
        a.defaultValue == null
          ? a.list
            ? '[]'
            : a.type === 'boolean'
              ? 'false'
              : ''
          : typeof a.defaultValue === 'string'
            ? a.defaultValue
            : JSON.stringify(a.defaultValue),
    })),
  };
}

/** Missing required arguments, for validation before save. */
export function missingArgs(op: ConfigurableOperationInput, defs: OperationDefinition[]): string[] {
  const def = defs.find((d) => d.code === op.code);
  if (!def) return [];
  return def.args
    .filter((a) => a.required)
    .filter((a) => {
      const v = op.arguments.find((x) => x.name === a.name)?.value ?? '';
      return v === '' || v === '[]';
    })
    .map((a) => a.label ?? a.name);
}
