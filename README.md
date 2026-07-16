# St. George Festival Ordering System — Setup Guide

Three pages (`index.html` order page, `kitchen.html` cook screen,
`pickup.html` pickup display) hosted free on GitHub Pages, backed
by a Google Sheet through Apps Script. No card numbers are ever
typed into these pages — Square Terminal handles card payment
separately once you wire it in.

## 1. Create the Google Sheet

1. Go to sheets.google.com → create a **new blank Sheet**. Name it
   something like "Festival Orders".
2. Rename the first tab (bottom-left) to exactly `Orders`.
3. In row 1, add these headers exactly, one per column (A–K):
   `OrderID | Station | Timestamp | ItemsJSON | Total | PaymentMethod | Status | CustomerName | CheckoutId | MainStarted | SandwichStarted`

   **If you already built the sheet from an earlier version:** just add
   two more headers, `MainStarted` in column J and `SandwichStarted`
   in column K — everything else stays the same.

## 2. Add the backend script

1. In the Sheet, go to **Extensions → Apps Script**. A new tab opens.
2. Delete the placeholder code in `Code.gs`.
3. Copy the entire contents of `apps-script/Code.gs` (from this
   project) and paste it in.
4. Click the **Save** icon (or Ctrl/Cmd+S).

## 3. Deploy it as a Web App

1. Top right, click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**. The first time, Google will ask you to
   authorize the script — click through the "unverified app"
   warning (it's your own script, this is expected for personal
   Apps Script projects).
5. Copy the **Web app URL** it gives you — looks like
   `https://script.google.com/macros/s/AKfycb.../exec`.

## 4. Connect the frontend to the backend

1. Open `config.js` in this project.
2. Paste your Web app URL into `APPS_SCRIPT_URL`.
3. Edit the `MENU` array to match your actual food and prices.

## 5. Put it on GitHub Pages

1. Create a **new GitHub repository** (separate from your RSVP
   site — having two repos is completely fine, each gets its own
   free Pages URL).
2. Upload all the files from this project (`index.html`,
   `kitchen.html`, `pickup.html`, `style.css`, `config.js`, `api.js`)
   to the repo root. (You don't need to upload the `apps-script`
   folder — that code lives in Google, not GitHub.)
3. Go to **Settings → Pages** in the repo.
4. Under "Build and deployment," set Source to **Deploy from a
   branch**, branch `main`, folder `/ (root)`. Save.
5. Wait about a minute, then your site is live at
   `https://yourusername.github.io/your-repo-name/`.

## 6. Test the whole flow (before adding real Square payments)

With `SQUARE_ENABLED = false` (the default in Code.gs), you can
test everything end-to-end safely:

1. Open `.../your-repo-name/index.html` on your laptop or phone —
   add a couple items, checkout with **Cash**.
2. Open `.../your-repo-name/kitchen.html` in another tab — your
   test order should appear within a few seconds. Tap **Start
   Cooking**, then **Mark Ready**.
3. Open `.../your-repo-name/pickup.html` — confirm it moves from
   "Cooking" to "Ready for Pickup," and tapping it clears it.

If all three pages talk to each other correctly, the system works —
adding real card payments later is a config change, not a rebuild.

## 7. Add Square Terminal payments (once you have the terminals)

1. In the Square dashboard, open the **Developer** section, create
   an application if you don't have one, and grab your **production
   access token**.
2. Use the [Devices API](https://developer.squareup.com/docs/terminal-api/quickstart)
   (or your Square app pairing flow) to pair each Terminal and get
   its **device ID**. Square support can also usually read this off
   for you if the API feels like a lot — worth a quick call to them.
3. Back in Apps Script (`Code.gs`):
   - Paste your access token into `SQUARE_ACCESS_TOKEN`.
   - Paste each terminal's device ID into `STATION_DEVICE_IDS`
     (station "1" → Terminal 1's ID, station "2" → Terminal 2's ID).
   - Change `SQUARE_ENABLED` to `true`.
   - Click **Deploy → Manage deployments → edit (pencil) → New
     version → Deploy** so the change goes live.
4. Test with a real card on-site before the festival opens — place
   a $1 test order and make sure the correct Terminal lights up.

## The kitchen workflow — which screen is which

- **`index.html?station=1` / `?station=2`** — the two order-taking iPads
- **`kitchen.html`** — **Main Kitchen** screen. Shows only orders with
  main-line items, filtered to just those items. One button: **Start
  Order**. Tapping it removes it from this screen.
- **`kitchen-sandwiches.html`** — **Sandwich Kitchen** screen. Same
  idea, but only for items tagged `kitchen: "sandwich"` in `config.js`.
- **`assembly.html`** — **Assembly** screen. As soon as *either*
  kitchen starts an order, the *entire* order (every item, from both
  kitchens) appears here so whoever's assembling it can see the whole
  picture and gather everything. One button: **Mark Ready**.
- **`pickup.html`** — the pickup display, unchanged.
- **`history.html`** — searchable order lookup, unchanged.

**Before the event, double-check `config.js`:** every menu item has a
`kitchen: "main"` or `kitchen: "sandwich"` tag. I made reasonable
guesses based on typical festival menus, but you know your actual two
lines best — go through the `MENU` list and correct any that are wrong.
An order with items from both kitchens will show up on both kitchen
screens (each seeing only their own items) and then as one combined
order on Assembly once either side has started it.

## 8. Set up the two order-taking iPads

Each iPad needs to know which Terminal it's paired with. Do this
by adding `?station=1` or `?station=2` to the URL:

- iPad A: `https://yourusername.github.io/your-repo-name/index.html?station=1`
- iPad B: `https://yourusername.github.io/your-repo-name/index.html?station=2`

## 9. Make it full-screen on each iPad

Safari on iPad can't be forced fullscreen from code, but this gets
you there:

1. Open the correct URL (with `?station=`) in Safari.
2. Tap the Share icon → **Add to Home Screen**.
3. Launch the app from that new home screen icon — it opens with
   no browser bar.
4. To stop people leaving the app: **Settings → Accessibility →
   Guided Access → on**. Then triple-click the side/home button
   while the app is open to lock it to that one app. Set a passcode
   different from the one used to actually unlock the iPad.

Do the same "Add to Home Screen" for the kitchen and pickup iPads
(no `?station=` needed for those — they show all stations at once).

## Notes / things worth doing before the event

- **Clear test rows** from the Orders sheet before the festival
  starts, so old test orders don't show up.
- **Test on the actual WiFi/hotspot** you'll use at the festival —
  that's the most likely failure point, not the software.
- **Cash orders** now require a volunteer's confirmation before
  they're sent to the kitchen: after the customer picks "Cash," the
  iPad shows a "turn this to a volunteer" screen with a big Confirm
  button. Only the volunteer's tap actually creates the order — this
  stops walk-aways where someone orders and leaves without paying.
- **Card orders** submit immediately and show a "pay on the
  terminal" screen with a spinner. The order only shows the customer
  their confirmation number once the terminal reports the payment
  succeeded. While `SQUARE_ENABLED` is `false` (before you've wired
  in your terminals), card payments are simulated as instantly
  successful so you can still test this whole path today.
- The kitchen screen plays a chime on new orders, but iOS requires
  one tap on the screen first before any sound can play — tap
  anywhere on the kitchen screen once after it loads each morning.
- All three screens now update instantly when you tap a button
  (Start Cooking, Mark Ready, tapping a ready order on pickup) —
  the screen changes right away and syncs with the Sheet in the
  background, rather than waiting on the network round-trip.
