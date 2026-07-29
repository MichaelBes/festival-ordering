// ============================================================
// API — talks to the Google Apps Script backend.
// You shouldn't need to edit this file.
// ============================================================

function getStation() {
  const params = new URLSearchParams(window.location.search);
  return params.get("station") || DEFAULT_STATION;
}

// Normalizes a phone number to the +1XXXXXXXXXX format Telnyx (and most
// SMS APIs) expect, so nothing ever fails later just because someone
// typed "555-123-4567" instead of "+15551234567". Returns "" if the
// input is empty/unusable.
function normalizePhoneNumber(raw) {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (trimmed.startsWith("+")) {
    // Already has a country code — just strip stray formatting characters.
    return "+" + trimmed.slice(1).replace(/\D/g, "");
  }
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  if (digits.length === 10) return "+1" + digits;
  // Anything unusual (too short/long, extension, etc.) — best effort,
  // don't silently drop a number someone actually typed in.
  return "+1" + digits;
}

// NOTE: Content-Type is deliberately "text/plain" on POST requests.
// This avoids the browser sending a CORS "preflight" request first,
// which Apps Script web apps don't handle well. Apps Script still
// reads the JSON string fine on the other end.
async function postToBackend(payload) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Request failed: " + res.status);
  return res.json();
}

async function getFromBackend(params) {
  const url = new URL(APPS_SCRIPT_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  // Cache-buster: Apps Script GET responses can otherwise get cached by
  // the browser since the URL is often identical between polls, causing
  // "changes that appear to revert" even though they actually saved fine.
  url.searchParams.set('_ts', Date.now());
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error("Request failed: " + res.status);
  return res.json();
}

async function submitOrder({ station, items, total, paymentMethod, customerName, phone }) {
  return postToBackend({
    action: "submitOrder",
    station,
    items,
    total,
    paymentMethod,
    customerName: customerName || "",
    phone: phone || "",
  });
}

// Online ordering: charges the card and creates the order in one step.
// cardToken comes from the Square Web Payments SDK's tokenize() call.
async function submitOnlineOrder({ items, total, customerName, phone, cardToken }) {
  return postToBackend({
    action: "submitOnlineOrder",
    items, total, cardToken,
    customerName: customerName || "",
    phone: phone || "",
  });
}

async function fetchOrders(statusFilter) {
  return getFromBackend({ action: "getOrders", status: statusFilter || "" });
}

async function updateOrderStatus(orderId, status) {
  return postToBackend({ action: "updateStatus", orderId, status });
}

// Called by the Main Kitchen or Sandwich Kitchen screen when staff tap
// "Start" on an order — marks that kitchen's portion as started.
async function startOrderPortion(orderId, kitchen) {
  return postToBackend({ action: "startPortion", orderId, kitchen });
}

// Used while a card order is on the "pay on terminal" screen — checks
// whether the Square Terminal checkout has completed yet.
async function checkPaymentStatus(orderId) {
  return getFromBackend({ action: "checkPayment", orderId });
}

// Returns every order (any status, any day) for the history/lookup page.
async function fetchHistory() {
  return getFromBackend({ action: "getHistory" });
}

// Returns { itemId: { status, note } } for items with a non-default status.
async function fetchMenuStatus() {
  const result = await getFromBackend({ action: "getMenuStatus" });
  return result.items || {};
}

// Admin-only: sets an item to "normal", "long_wait", or "out_of_stock".
async function setMenuStatus(itemId, status, note) {
  return postToBackend({ action: "setMenuStatus", itemId, status, note: note || "" });
}

// Admin-only: today's order stats and any flagged/stuck orders.
async function fetchStats() {
  return getFromBackend({ action: "getStats" });
}
