// ============================================================
// API — talks to the Google Apps Script backend.
// You shouldn't need to edit this file.
// ============================================================

function getStation() {
  const params = new URLSearchParams(window.location.search);
  return params.get("station") || DEFAULT_STATION;
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
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Request failed: " + res.status);
  return res.json();
}

async function submitOrder({ station, items, total, paymentMethod, customerName }) {
  return postToBackend({
    action: "submitOrder",
    station,
    items,
    total,
    paymentMethod,
    customerName: customerName || "",
  });
}

async function fetchOrders(statusFilter) {
  return getFromBackend({ action: "getOrders", status: statusFilter || "" });
}

async function updateOrderStatus(orderId, status) {
  return postToBackend({ action: "updateStatus", orderId, status });
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
