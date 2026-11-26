/**
 * Cloudflare Pages Function for Shared Real-Time Stock Management (/api/stock)
 *
 * Optional Environment Variables (Cloudflare Pages -> Settings -> Environment variables):
 *   - NEON_SQL_URL  : Neon HTTP SQL endpoint (https://<host>/sql)
 *   - NEON_CONN_STR : Neon PostgreSQL connection string
 *   - ADMIN_KEY     : Secret bearer token for terminal stock updates (`stock.py --api ... --key ...`)
 *
 * If Neon env vars are not configured yet, returns 503 with `{ fallback: true }`
 * so the frontend gracefully falls back to `stock.json` + local order tracking.
 */

const DEFAULT_STOCK = {
  "Parle G": 50,
  "Tedhe Medhe": 50,
  "Kurkure": 50,
  "Cup Maggi": 50,
  "Bourbon": 50,
  "Maggi Double Masala": 50,
  "Milk": 50,
  "Nescafe Coffee": 50,
  "BRU Coffee": 50,
  "Chini": 5,
  "Tata Tea": 50,
  "Red Label": 50,
  "Lays Classic": 50,
  "Oreo": 50,
  "Good Day": 50,
  "Dairy Milk": 50,
  "Frooti": 50,
  "Coca-Cola": 50,
  "Yippee Noodles": 50,
  "Bread": 50,
  "Linc Glycer Blue": 50,
  "Linc Glycer Black": 50,
  "Pentonic Blue": 50,
  "Pentonic Black": 50,
  "Pentonic V-RT": 50,
  "Practical File (100p)": 50,
  "Practical File (140p)": 50,
  "Practical File (Hardcover)": 50
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

async function runSql(env, query, params = []) {
  const res = await fetch(env.NEON_SQL_URL, {
    method: "POST",
    headers: {
      "Neon-Connection-String": env.NEON_CONN_STR,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, params })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Database error");
  }
  const data = await res.json();
  return data.rows || [];
}

async function ensureTable(env) {
  await runSql(
    env,
    `CREATE TABLE IF NOT EXISTS sadbhavna_stock (
      product TEXT PRIMARY KEY,
      qty INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`
  );
  const rows = await runSql(env, `SELECT COUNT(*)::int AS count FROM sadbhavna_stock;`);
  if ((rows[0]?.count || 0) === 0) {
    for (const [product, qty] of Object.entries(DEFAULT_STOCK)) {
      await runSql(
        env,
        `INSERT INTO sadbhavna_stock (product, qty) VALUES ($1, $2) ON CONFLICT (product) DO NOTHING;`,
        [product, qty]
      );
    }
  }
}

async function getAllStock(env) {
  const rows = await runSql(env, `SELECT product, qty FROM sadbhavna_stock ORDER BY product;`);
  const map = {};
  for (const r of rows) {
    map[r.product] = Number(r.qty) || 0;
  }
  return map;
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return jsonResponse({}, 204);
  }

  if (!env.NEON_SQL_URL || !env.NEON_CONN_STR) {
    return jsonResponse({ fallback: true, message: "Database not configured; using stock.json" }, 503);
  }

  try {
    await ensureTable(env);

    if (request.method === "GET") {
      const stock = await getAllStock(env);
      return jsonResponse({ ok: true, stock });
    }

    if (request.method === "POST") {
      const body = await request.json().catch(() => ({}));

      // Customer WhatsApp checkout stock deduction
      if (body.action === "order" && body.items && typeof body.items === "object") {
        for (const [product, orderedQty] of Object.entries(body.items)) {
          const qty = Math.max(0, parseInt(orderedQty, 10) || 0);
          if (qty > 0) {
            await runSql(
              env,
              `UPDATE sadbhavna_stock
               SET qty = GREATEST(0, qty - $1), updated_at = NOW()
               WHERE product = $2;`,
              [qty, product]
            );
          }
        }
        const stock = await getAllStock(env);
        return jsonResponse({ ok: true, stock });
      }

      // Admin terminal stock add / set
      if (body.action === "add" || body.action === "set") {
        if (!env.ADMIN_KEY || request.headers.get("Authorization") !== `Bearer ${env.ADMIN_KEY}`) {
          return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
        }
        const product = String(body.product || "").trim();
        const qty = Math.max(0, parseInt(body.quantity, 10) || 0);
        if (!product) {
          return jsonResponse({ ok: false, error: "Product name required" }, 400);
        }

        if (body.action === "add") {
          await runSql(
            env,
            `INSERT INTO sadbhavna_stock (product, qty) VALUES ($1, $2)
             ON CONFLICT (product) DO UPDATE
             SET qty = sadbhavna_stock.qty + EXCLUDED.qty, updated_at = NOW();`,
            [product, qty]
          );
        } else {
          await runSql(
            env,
            `INSERT INTO sadbhavna_stock (product, qty) VALUES ($1, $2)
             ON CONFLICT (product) DO UPDATE
             SET qty = EXCLUDED.qty, updated_at = NOW();`,
            [product, qty]
          );
        }
        const stock = await getAllStock(env);
        return jsonResponse({ ok: true, stock });
      }

      return jsonResponse({ ok: false, error: "Invalid action" }, 400);
    }

    return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message || "Server error" }, 500);
  }
}
