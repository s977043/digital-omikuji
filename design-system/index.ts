type TokenLeafValue =
  | string
  | number
  | boolean
  | null
  | {
      [key: string]: TokenLeafValue;
    };

type TokenLeaf = {
  value: TokenLeafValue;
};

type TokenTree = {
  [key: string]: TokenTree | TokenLeaf;
};

const primitiveTokens = require("../docs/design-system/tokens/primitive.json") as TokenTree;
const semanticTokens = require("../docs/design-system/tokens/semantic.json") as TokenTree;
const componentTokens = require("../docs/design-system/tokens/component.json") as TokenTree;

type TokenLayer = "primitive" | "semantic" | "component";

const trees: Record<TokenLayer, TokenTree> = {
  primitive: primitiveTokens,
  semantic: semanticTokens,
  component: componentTokens,
};

const TOKEN_REF_PATTERN = /^\{(primitive|semantic|component)\.(.+)\}$/;

function isTokenLeaf(node: TokenTree | TokenLeaf | TokenLeafValue): node is TokenLeaf {
  return typeof node === "object" && node !== null && "value" in node;
}

function getNodeFromTree(tree: TokenTree, path: string): TokenTree | TokenLeaf {
  return path.split(".").reduce<TokenTree | TokenLeaf>((current, segment) => {
    if (!current || isTokenLeaf(current) || !(segment in current)) {
      throw new Error(`Unknown design token path: ${path}`);
    }
    return current[segment] as TokenTree | TokenLeaf;
  }, tree);
}

function resolveValue(value: TokenLeafValue): TokenLeafValue {
  if (typeof value === "string") {
    const match = value.match(TOKEN_REF_PATTERN);
    if (match) {
      return getToken(match[1] as TokenLayer, match[2]);
    }
    return value;
  }

  if (typeof value !== "object" || value === null) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [key, resolveValue(nested)])
  );
}

function resolveNode(node: TokenTree | TokenLeaf): TokenLeafValue | Record<string, TokenLeafValue> {
  if (isTokenLeaf(node)) {
    return resolveValue(node.value);
  }

  return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, resolveNode(value)]));
}

export function getToken(
  layer: TokenLayer,
  path: string
): TokenLeafValue | Record<string, TokenLeafValue> {
  const node = getNodeFromTree(trees[layer], path);
  return resolveNode(node);
}

export function getTokenByPath(path: string): TokenLeafValue | Record<string, TokenLeafValue> {
  const [layer, ...segments] = path.split(".");
  if (layer !== "primitive" && layer !== "semantic" && layer !== "component") {
    throw new Error(`Unknown token layer: ${layer}`);
  }
  return getToken(layer, segments.join("."));
}

function expectObject<T extends Record<string, TokenLeafValue>>(
  value: TokenLeafValue | Record<string, TokenLeafValue>,
  path: string
): T {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Token ${path} is not an object token`);
  }
  return value as T;
}

export function getComponentTokens<T extends Record<string, TokenLeafValue>>(path: string): T {
  return expectObject<T>(getToken("component", path), `component.${path}`);
}

export function getSemanticTokens<T extends Record<string, TokenLeafValue>>(path: string): T {
  return expectObject<T>(getToken("semantic", path), `semantic.${path}`);
}

export function getStringToken(path: string): string {
  const value = getTokenByPath(path);
  if (typeof value !== "string") {
    throw new Error(`Token ${path} is not a string`);
  }
  return value;
}

export function getNumberToken(path: string): number {
  const value = getTokenByPath(path);
  if (typeof value !== "number") {
    throw new Error(`Token ${path} is not a number`);
  }
  return value;
}

export function withAlpha(hexColor: string, alpha: number): string {
  if (hexColor.startsWith("rgba") || hexColor.startsWith("rgb")) {
    return hexColor;
  }

  const normalized = hexColor.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export const designSystem = {
  primitive: primitiveTokens,
  semantic: semanticTokens,
  component: componentTokens,
};
