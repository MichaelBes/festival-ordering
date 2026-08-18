// ============================================================
// CONFIG — edit this file to set up your event
// ============================================================

// After you deploy the Apps Script (see README step 3), paste
// the Web App URL it gives you here:
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzcG9umOIZjlfBbraFOwIDPXpHhCfrvZ4m9RW9GtVsqup6BlmBJQaRc2Ugj-yBbGQ0k/exec";

// Your menu. id must be unique. price is in dollars.
// "kitchen" tells the system which prep screen this item shows up on:
// "main" = your main food line (grill, sides, desserts, drinks),
// "sandwich" = your sandwich line.
// "image" is optional — leave blank ("") for items without a photo yet.
//
// NOTE: pulled from last year's Square Online menu — please double
// check prices/items are still current, since a couple of things
// (like the Chicken and Kofta Plates, and possibly new shawarma
// bowls) were mentioned as not finalized yet. Add/edit freely below.
//
// FUTURE IDEA (not built yet, per your note): show "image"/"description"
// only on an online-ordering page, and hide them on the in-person
// station pages to save space there. Leaving both pages using the
// same MENU list for now — flag this again when you're ready and we
// can split it.
//
// "options" (optional): lets a customer customize an item before it's
// added to the cart. Each group has a "name", a list of "choices", and
// a "default" index (the standard choice — picking it won't add any
// note to the kitchen ticket; picking anything else will).
const MENU = [
  // ---- Combos ----
  {
    id: "combo-1", name: "Combo Plate", price: 22, category: "Combos", kitchen: "main",
    image: "images/combo-1.webp",
    description: "1 skewer of chicken and 2 skewers of kofta with rice or macaroni b\u00e9chamel, 5 pieces of stuffed grape leaves (mahshi), side salad, and 1 cheese goulash pastry. Comes with a free can of soda and a small dessert. Not all items shown in photo.",
    isMeal: true,
    options: [
      { name: "Starch", default: 0, choices: ["Rice (standard)", "Macaroni B\u00e9chamel"] },
    ],
  },

  // ---- Plates ----
  {
    id: "kofta-plate", name: "Kofta Plate", price: 13, category: "Plates", kitchen: "main",
    image: "images/kofta-plate.webp",
    description: "2 pieces of kofta served with rice, 5 pieces of stuffed grape leaves (mahshi), side salad, and 1 goulash pastry.",
    isMeal: true,
  },
  {
    id: "chicken-plate", name: "Chicken Plate", price: 13, category: "Plates", kitchen: "main",
    image: "images/chicken-plate.webp",
    description: "1 skewer of shish tawook (grilled chicken) served with rice, 5 pieces of stuffed grape leaves (mahshi), side salad, and 1 goulash pastry.",
    isMeal: true,
  },
  // Moved here from Sandwiches — the new official menu lists this
  // under Plates, not Sandwiches, which also answers the earlier open
  // question about which kitchen station should prep it.
  {
    id: "shawarma-bowl", name: "Shawarma Bowl", price: 13, category: "Plates", kitchen: "main",
    image: "images/beef-shawarma-bowl.webp",
    description: "Bed of rice, topped with roasted, shaved beef or chicken, served with salad.",
    options: [
      { name: "Meat", default: 0, choices: ["Beef (standard)", "Chicken"] },
      { name: "Spice Level", default: 0, choices: ["Regular (standard)", "Spicy"] },
      { name: "Tahini Sauce", default: 0, choices: ["Included (standard)", "No Tahini Sauce"] },
    ],
  },
  {
    id: "feteer-sausage-bastrami", name: "Feteer With Sausage or Bastrami", price: 10, category: "Plates", kitchen: "main",
    image: "images/feteer-sausage-bastrami.webp",
    description: "Flaky, layered Egyptian feteer pastry filled with your choice of spiced sausage or bastrami (seasoned, cured beef).",
    options: [
      { name: "Filling", default: 0, choices: ["Sausage (standard)", "Bastrami"] },
    ],
  },

  // ---- Sandwiches ----
  // Chicken Shawarma Sandwich removed — the new official menu no
  // longer lists it separately, just one combined "Shawarma Sandwich."
  // Kofta Sandwich removed — not on the new official menu at all.
  {
    id: "shawarma-sandwich", name: "Shawarma Sandwich", price: 13, category: "Sandwiches", kitchen: "sandwich",
    image: "images/beef-shawarma-sandwich.webp",
    description: "Roasted, shaved beef or chicken, served with salads, wrapped in pita.",
    options: [
      { name: "Meat", default: 0, choices: ["Beef (standard)", "Chicken"] },
      { name: "Spice Level", default: 0, choices: ["Regular (standard)", "Spicy"] },
      { name: "Tahini Sauce", default: 0, choices: ["Included (standard)", "No Tahini Sauce"] },
    ],
  },
  {
    id: "falafel-sandwich", name: "Falafel Sandwich", price: 8, category: "Sandwiches", kitchen: "sandwich",
    image: "images/falafel-sandwich.webp",
    description: "Spiced mashed chickpeas formed into balls and deep-fried, in pita bread.",
  },
  {
    id: "sausage-sandwich", name: "Sausage Sandwich", price: 9, category: "Sandwiches", kitchen: "sandwich",
    image: "images/sausage-sandwich.webp",
    description: "Spiced ground beef stuffed in beef casing, cooked with green peppers and onions.",
  },
  {
    id: "gyro-sandwich", name: "Gyro Sandwich", price: 10, category: "Sandwiches", kitchen: "sandwich",
    image: "images/gyro-sandwich.webp",
    description: "Thinly sliced, seasoned beef and lamb wrapped in pita bread, topped with tzatziki sauce, sliced tomatoes, and onions.",
  },
  {
    id: "liver-sandwich", name: "Liver Sandwich (Kibda)", price: 10, category: "Sandwiches", kitchen: "sandwich",
    image: "images/liver-sandwich.webp",
    description: "Beef liver cooked with onions, green pepper, yellow pepper, and garlic.",
  },

  // ---- Sides ----
  {
    id: "stuffed-grape-leaves", name: "Stuffed Grape Leaves (Mahshi)", price: 3, category: "Sides", kitchen: "main",
    image: "images/stuffed-grape-leaves.webp",
    description: "10 pieces of grape leaves stuffed with rice and ground beef.",
  },
  {
    id: "macaroni-bechamel", name: "Macaroni B\u00e9chamel", price: 3, category: "Sides", kitchen: "main",
    image: "images/macaroni-bechamel.webp",
    description: "An Egyptian take on baked pasta — penne layered with spiced ground beef and onion, topped with creamy b\u00e9chamel sauce and baked golden.",
  },
  {
    id: "goulash", name: "Goulash", price: 2, category: "Sides", kitchen: "main",
    image: "images/goulash.webp",
    description: "3 pieces of savory pastry made of filo dough filled with salted cheese.",
  },
  // Egyptian Sausage (standalone) removed — not on the new official
  // menu; only the Sausage Sandwich remains.
  {
    id: "feteer-meshaltet-whole", name: "Whole Feteer Meshaltet", price: 25, category: "Sides", kitchen: "main",
    image: "images/feteer-meshaltet.webp",
    description: "A whole feteer meshaltet — a large, flaky Egyptian pastry made of many thin, torn and layered sheets of dough, baked until golden. Serves a group.",
  },
  {
    id: "feteer-meshaltet-slice", name: "Feteer Meshaltet (By the Slice)", price: 3, category: "Sides", kitchen: "main",
    image: "images/feteer-meshaltet.webp",
    description: "A single slice of feteer meshaltet — flaky, torn and layered Egyptian pastry, baked until golden.",
  },
  // Placed last, matching where these fall on the physical menu — after
  // the numbered items, right before Desserts.
  // These two automatically charge the meal-discount price whenever the
  // cart already contains a plate/combo, and the full standalone price
  // otherwise — recalculated live any time the cart changes, matching
  // the new menu's "$2 with a meal / $4 on its own" pricing exactly.
  {
    id: "extra-kofta", name: "Extra Kofta (1 pc)", price: 4, category: "Sides", kitchen: "main",
    image: "",
    description: "One additional piece of kofta. $2 each when added alongside a Combo, Kofta Plate, or Chicken Plate — $4 each on its own.",
    isAddon: true, addonPriceWithMeal: 2, addonPriceStandalone: 4,
  },
  {
    id: "extra-chicken", name: "Extra Chicken (1 pc)", price: 4, category: "Sides", kitchen: "main",
    image: "",
    description: "One additional piece of grilled chicken (shish tawook). $2 each when added alongside a Combo, Kofta Plate, or Chicken Plate — $4 each on its own.",
    isAddon: true, addonPriceWithMeal: 2, addonPriceStandalone: 4,
  },

  // ---- Desserts ----
  {
    id: "kunafa", name: "Kunafa", price: 2, category: "Desserts", kitchen: "main",
    image: "images/kunafa.webp",
    description: "Fine shredded kunafa pastry rolled around sweet cream, topped with pistachio, sweetened with syrup, and baked until golden.",
  },
  {
    id: "basbousa", name: "Basbousa", price: 3, category: "Desserts", kitchen: "main",
    image: "images/basbousa.webp",
    description: "A semolina cake soaked in simple syrup.",
  },
  {
    id: "baklava", name: "Baklava", price: 5, category: "Desserts", kitchen: "main",
    image: "images/baklava.webp",
    description: "2 pieces of flaky filo pastry filled with nuts and sweet syrup.",
  },

  // ---- Drinks ----
  { id: "gatorade", name: "Gatorade", price: 2, category: "Drinks", kitchen: "main", image: "", description: "" },
  { id: "propel", name: "Propel", price: 2, category: "Drinks", kitchen: "main", image: "", description: "" },
  { id: "capri-sun", name: "Capri Sun", price: 1, category: "Drinks", kitchen: "main", image: "", description: "" },
  { id: "water", name: "Bottled Water", price: 1, category: "Drinks", kitchen: "main", image: "", description: "" },
  { id: "soda", name: "Soda", price: 1, category: "Drinks", kitchen: "main", image: "", description: "" },
  { id: "sparkling-water", name: "Sparkling Water", price: 2, category: "Drinks", kitchen: "main", image: "", description: "" },
];

// Which station number this iPad is. You can also override this
// per-device by adding ?station=2 to the URL instead of editing this.
const DEFAULT_STATION = "1";

// How long (ms) the final "order placed" screen stays up before the
// ordering page resets itself for the next customer.
const CONFIRMATION_DISPLAY_MS = 8000;

// How often (ms) the kitchen and pickup screens re-check for updates.
const POLL_INTERVAL_MS = 3000;

// How often (ms) the order page checks whether a card payment has
// completed on the terminal, while showing the "pay on terminal" screen.
const PAYMENT_POLL_INTERVAL_MS = 2000;

// 4-digit code a volunteer must enter to confirm a cash order before
// it's sent to the kitchen. Change this to whatever you'd like.
const VOLUNTEER_PASSCODE = "1111";

// Passcode to access admin.html. This is a basic deterrent, not real
// security — anyone who knows it (or views the page source) can get
// in. Good enough to stop casual/accidental access on a public link,
// not meant to stop someone determined. Change this to your own code.
const ADMIN_PASSCODE = "2468";

// How often (ms) the order page rechecks whether any item's status
// (long wait / out of stock) has changed.
const MENU_STATUS_POLL_INTERVAL_MS = 15000;

// How long (ms) Checkout waits for a fresh live availability check
// before giving up and using the last known status instead (which is
// never more than MENU_STATUS_POLL_INTERVAL_MS old). Apps Script can
// occasionally be slow to respond ("cold start"), so this caps the
// worst-case wait. Based on real observed response times, healthy
// checks finish well under 1.5s — 3000 gives real headroom above
// that without making checkout wait unnecessarily long.
const CHECKOUT_AVAILABILITY_TIMEOUT_MS = 3000;

// Card processing surcharge — applies to card payments only, never
// cash. Online orders are always card, so it always applies there.
const CARD_FEE_RATE = 0.03;

// ---- Online ordering (online.html) ----------------------------
// Needed for the Square card form on the online ordering page.
// Application ID is safe to expose publicly — it's different from
// the secret Access Token in Code.gs, which never appears here.
// Get both from the same Square Developer Dashboard app:
// Credentials page (Application ID) and Locations page (Location ID
// — same value already in Code.gs's SQUARE_LOCATION_ID).
const SQUARE_APPLICATION_ID = "sq0idp-nk75rLZVR1aMkVOO_vry3w";
const SQUARE_LOCATION_ID_PUBLIC = "L6VV44AAQ0SC3";