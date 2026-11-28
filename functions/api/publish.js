/**
 * Optional Cloudflare Pages Function (/api/publish) for pushing store updates to GitHub.
 *
 * Optional Environment Variables (Cloudflare Pages -> Settings -> Environment variables):
 *   - GITHUB_TOKEN    : Fine-grained GitHub PAT with Contents Read & Write access
 *   - GITHUB_REPO     : Optional, defaults to "jayprakashkkk/Sadbhavna_mart"
 *   - GITHUB_BRANCH   : Optional, defaults to "main"
 *   - ADMIN_PASSWORD  : Optional, defaults to "2026" (verified before pushing)
 *
 * If GITHUB_TOKEN is not set on Cloudflare Pages, returns 503 with `{ fallback: true }`
 * so admin.html uses the owner's browser-saved GitHub token directly.
 */

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

async function ghRequest(token, path, method = "GET", payload = null) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "User-Agent": "Sadbhavna-Mart-Admin",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json"
    },
    body: payload ? JSON.stringify(payload) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `GitHub API error (${res.status})`);
  }
  return data;
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return jsonResponse({}, 204);
  }

  if (request.method === "GET") {
    return jsonResponse({
      configured: Boolean(env.GITHUB_TOKEN),
      repo: env.GITHUB_REPO || "jayprakashkkk/Sadbhavna_mart",
      branch: env.GITHUB_BRANCH || "main"
    });
  }

  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
  }

  if (!env.GITHUB_TOKEN) {
    return jsonResponse({
      fallback: true,
      configured: false,
      error: "GITHUB_TOKEN not set on Cloudflare; use browser GitHub token in Admin."
    }, 503);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const expectedPass = env.ADMIN_PASSWORD || "2026";
    if (!body.password || String(body.password) !== String(expectedPass)) {
      return jsonResponse({ ok: false, error: "Invalid admin password" }, 401);
    }

    const files = Array.isArray(body.files) ? body.files : [];
    if (!files.length) {
      return jsonResponse({ ok: false, error: "No files supplied" }, 400);
    }

    const repo = env.GITHUB_REPO || "jayprakashkkk/Sadbhavna_mart";
    const branch = env.GITHUB_BRANCH || "main";
    const message = String(body.message || "Update Sadbhavna Mart from Admin Console").slice(0, 120);

    const refData = await ghRequest(env.GITHUB_TOKEN, `/repos/${repo}/git/ref/heads/${branch}`);
    const latestCommitSha = refData.object.sha;
    const commitData = await ghRequest(env.GITHUB_TOKEN, `/repos/${repo}/git/commits/${latestCommitSha}`);
    const baseTreeSha = commitData.tree.sha;

    const treeItems = [];
    for (const f of files) {
      if (!f || !f.path || typeof f.content !== "string") continue;
      const blob = await ghRequest(env.GITHUB_TOKEN, `/repos/${repo}/git/blobs`, "POST", {
        content: f.content,
        encoding: f.encoding === "base64" ? "base64" : "utf-8"
      });
      treeItems.push({
        path: f.path,
        mode: "100644",
        type: "blob",
        sha: blob.sha
      });
    }

    const newTree = await ghRequest(env.GITHUB_TOKEN, `/repos/${repo}/git/trees`, "POST", {
      base_tree: baseTreeSha,
      tree: treeItems
    });

    const newCommit = await ghRequest(env.GITHUB_TOKEN, `/repos/${repo}/git/commits`, "POST", {
      message,
      tree: newTree.sha,
      parents: [latestCommitSha]
    });

    await ghRequest(env.GITHUB_TOKEN, `/repos/${repo}/git/refs/heads/${branch}`, "PATCH", {
      sha: newCommit.sha,
      force: false
    });

    return jsonResponse({
      ok: true,
      commitSha: newCommit.sha,
      repo,
      branch
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message || "Publish failed" }, 500);
  }
}
