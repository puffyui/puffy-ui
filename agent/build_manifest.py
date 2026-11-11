"""Builds agent/components.json and /llms.txt from the .d.ts files and registry.json.
Run from anywhere: python3 agent/build_manifest.py"""
import json, re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
reg = json.loads((root/"registry.json").read_text())
SITE = "https://puffyui.com"
out = {"name": "puffy", "site": SITE, "install": f"{SITE}/r/{{item}}.json", "items": []}
for it in reg["items"]:
    entry = {"item": it["name"], "title": it.get("title", it["name"]),
             "description": it.get("description", ""),
             "install": f"npx shadcn@latest add {SITE}/r/{it['name']}.json",
             "files": [f["path"] for f in it.get("files", [])], "components": []}
    for f in it.get("files", []):
        if not f["path"].endswith(".d.ts"): continue
        src = (root/f["path"]).read_text()
        for m in re.finditer(r"export interface (\w+)Props \{(.*?)\n\}", src, re.S):
            props = []
            for pm in re.finditer(r"^\s+(\w+)(\?)?:\s*([^;]+);", m.group(2), re.M):
                n = pm.group(1)
                if re.match(r"on[A-Z]", n) and n not in ("onClick","onChange","onSelect","onOpenChange"): continue
                props.append({"name": n, "type": pm.group(3).strip(), "required": not pm.group(2)})
            entry["components"].append({"name": m.group(1), "props": props})
    out["items"].append(entry)
(root/"agent"/"components.json").write_text(json.dumps(out, indent=1))
lines = ["# Puffy UI", "", "> React copy-paste components with a glass look, themed by four switches. Use Puffy parts and tokens before writing your own.", "",
 "## Rules", f"- [AGENTS.md]({SITE}/tokens/AGENTS.md): design rules for agents", f"- [Tokens CSS]({SITE}/tokens/puffy-tokens.css)", f"- [Tokens JSON]({SITE}/tokens/puffy-tokens.json)",
 f"- [Component manifest]({SITE}/agent/components.json): every part, its props and install command", f"- [Design system]({SITE}/system/)", "", "## Parts"]
for e in out["items"]:
    names = ", ".join(c["name"] for c in e["components"]) or e["title"]
    lines.append(f"- [{e['title']}]({SITE}/r/{e['item']}.json): {names}")
(root/"llms.txt").write_text("\n".join(lines)+"\n")
print(len(out["items"]), "items", sum(len(e["components"]) for e in out["items"]), "components")
