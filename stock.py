#!/usr/bin/env python3
"""
Sadbhavna Mart — Terminal Stock Manager
Usage:
  python3 stock.py list
  python3 stock.py add "Chini" 50
  python3 stock.py set "Chini" 5
  python3 stock.py add "Chini" 50 --push
  python3 stock.py set "Chini" 50 --api https://sadbhavnamart.pages.dev/api/stock --key YOUR_ADMIN_KEY
"""

import argparse
import json
import os
import subprocess
import sys
import urllib.request
import urllib.error

REPO_DIR = os.path.dirname(os.path.abspath(__file__))
STOCK_FILE = os.path.join(REPO_DIR, "stock.json")


def load_stock():
    with open(STOCK_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_stock(data):
    with open(STOCK_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        f.write("\n")


def resolve_product(data, query):
    q = query.strip().lower()
    for name in data:
        if name.lower() == q:
            return name
    matches = [name for name in data if q in name.lower()]
    if len(matches) == 1:
        return matches[0]
    if len(matches) > 1:
        print(f"Multiple products match '{query}': {', '.join(matches)}")
        sys.exit(1)
    # Allow adding a new product key if exact name given
    return query.strip()


def print_table(data):
    print("\n📦 Sadbhavna Mart — Product Stock")
    print("-" * 44)
    for name, qty in data.items():
        if qty <= 0:
            status = "OUT OF STOCK"
        elif qty <= 5:
            status = f"LOW (Only {qty} left)"
        else:
            status = "IN STOCK"
        print(f"  {name:<22} | {qty:>4} | {status}")
    print("-" * 44 + "\n")


def push_live_api(api_url, admin_key, action, product, qty):
    payload = json.dumps({
        "action": action,
        "product": product,
        "quantity": qty
    }).encode("utf-8")
    req = urllib.request.Request(
        api_url,
        data=payload,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {admin_key}"
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            body = json.loads(resp.read().decode("utf-8"))
            print("✅ Live API updated:", body)
    except urllib.error.HTTPError as err:
        print(f"❌ API error ({err.code}):", err.read().decode("utf-8", errors="ignore"))
        sys.exit(1)


def git_push(product, qty):
    subprocess.run(["git", "-C", REPO_DIR, "add", "stock.json"], check=True)
    subprocess.run(
        ["git", "-C", REPO_DIR, "commit", "-m", f"chore(stock): update {product} stock to {qty}"],
        check=True
    )
    subprocess.run(["git", "-C", REPO_DIR, "push", "origin", "main"], check=True)
    print("🚀 Pushed stock.json to GitHub (Cloudflare Pages will auto-deploy).")


def main():
    parser = argparse.ArgumentParser(description="Sadbhavna Mart Terminal Stock Manager")
    sub = parser.add_subparsers(dest="cmd", required=True)

    sub.add_parser("list", help="Show all product stock levels")

    for cmd_name in ("add", "set"):
        p = sub.add_parser(cmd_name, help=f"{cmd_name.capitalize()} stock for a product")
        p.add_argument("product", help="Product name (e.g. 'Chini', 'Parle G')")
        p.add_argument("quantity", type=int, help="Quantity (non-negative integer)")
        p.add_argument("--push", action="store_true", help="Commit and push stock.json to git")
        p.add_argument("--api", default=os.environ.get("SADBHAVNA_API_URL", ""), help="Live /api/stock URL")
        p.add_argument("--key", default=os.environ.get("SADBHAVNA_ADMIN_KEY", ""), help="Admin API bearer key")

    args = parser.parse_args()
    data = load_stock()

    if args.cmd == "list":
        print_table(data)
        return

    if args.quantity < 0:
        print("❌ Quantity cannot be negative.")
        sys.exit(1)

    product = resolve_product(data, args.product)
    current = int(data.get(product, 0))
    new_qty = current + args.quantity if args.cmd == "add" else args.quantity

    data[product] = new_qty
    save_stock(data)
    print(f"✅ {product}: {current} -> {new_qty}")
    print_table(data)

    if args.api:
        if not args.key:
            print("❌ --key or SADBHAVNA_ADMIN_KEY is required when using --api")
            sys.exit(1)
        push_live_api(args.api, args.key, args.cmd, product, args.quantity)

    if args.push:
        git_push(product, new_qty)


if __name__ == "__main__":
    main()
