#!/usr/bin/env node
// Puffy MCP server (stdio, no dependencies). Tools: list_parts, get_part, get_rules, get_tokens, search_parts.
// Reads from puffyui.com by default; set PUFFY_SITE to a local server to test.
const SITE = process.env.PUFFY_SITE || "https://puffyui.com";
const cache = new Map();
async function get(path, json) {
  const key = path;
  if (!cache.has(key)) {
    const r = await fetch(SITE + path);
    if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
    cache.set(key, json ? await r.json() : await r.text());
  }
  return cache.get(key);
}
const manifest = () => get("/agent/components.json", true);
const text = (t) => ({ content: [{ type: "text", text: typeof t === "string" ? t : JSON.stringify(t, null, 2) }] });

const tools = {
  list_parts: {
    description: "List every Puffy part (install item) with its components and install command.",
    inputSchema: { type: "object", properties: {} },
    run: async () => (await manifest()).items.map(i => ({ item: i.item, title: i.title, components: i.components.map(c => c.name), install: i.install })),
  },
  search_parts: {
    description: "Find Puffy parts by a word, e.g. 'dialog', 'tabs', 'toggle'.",
    inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
    run: async ({ query }) => {
      const q = String(query).toLowerCase();
      return (await manifest()).items.filter(i => JSON.stringify(i).toLowerCase().includes(q))
        .map(i => ({ item: i.item, title: i.title, components: i.components.map(c => c.name), install: i.install }));
    },
  },
  get_part: {
    description: "Get one part: components, props, files and install command. Pass the install item name (e.g. 'display') or a component name (e.g. 'GlassTabs').",
    inputSchema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] },
    run: async ({ name }) => {
      const n = String(name).toLowerCase();
      const m = await manifest();
      const hit = m.items.find(i => i.item === n) || m.items.find(i => i.components.some(c => c.name.toLowerCase() === n));
      if (!hit) throw new Error(`No part named "${name}". Call list_parts.`);
      return hit;
    },
  },
  get_rules: {
    description: "Puffy design rules for agents (AGENTS.md). Read once per project before writing UI.",
    inputSchema: { type: "object", properties: {} },
    run: () => get("/tokens/AGENTS.md"),
  },
  get_tokens: {
    description: "Puffy design tokens as W3C JSON.",
    inputSchema: { type: "object", properties: {} },
    run: () => get("/tokens/puffy-tokens.json", true),
  },
};

function send(msg) { process.stdout.write(JSON.stringify({ jsonrpc: "2.0", ...msg }) + "\n"); }
async function handle(req) {
  const { id, method, params } = req;
  try {
    if (method === "initialize") return send({ id, result: { protocolVersion: params?.protocolVersion || "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "puffy", version: "0.1.0" } } });
    if (method === "tools/list") return send({ id, result: { tools: Object.entries(tools).map(([name, t]) => ({ name, description: t.description, inputSchema: t.inputSchema })) } });
    if (method === "tools/call") {
      const t = tools[params.name];
      if (!t) return send({ id, error: { code: -32602, message: `Unknown tool ${params.name}` } });
      try { return send({ id, result: text(await t.run(params.arguments || {})) }); }
      catch (e) { return send({ id, result: { ...text(String(e.message)), isError: true } }); }
    }
    if (method === "ping") return send({ id, result: {} });
    if (id !== undefined) send({ id, error: { code: -32601, message: `Unknown method ${method}` } });
  } catch (e) { if (id !== undefined) send({ id, error: { code: -32603, message: String(e.message) } }); }
}
let buf = "";
process.stdin.on("data", d => { buf += d; let i; while ((i = buf.indexOf("\n")) >= 0) { const l = buf.slice(0, i).trim(); buf = buf.slice(i + 1); if (l) { try { handle(JSON.parse(l)); } catch {} } } });
