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
    id: "combo-1", name: "Combo #1", price: 20, category: "Combos", kitchen: "main",
    image: "images/combo-1.webp",
    description: "Choice of rice or macaroni, 3 kofta, 2 pieces of chicken, 6 mashi (stuffed grape leaves), 1 goulash pastry, side salad, and a dessert. Not all items shown in photo.",
    options: [
      { name: "Meat", default: 0, choices: ["Kofta & Chicken (standard)", "All Kofta", "All Chicken"] },
      { name: "Starch", default: 0, choices: ["Rice (standard)", "Macaroni B\u00e9chamel"] },
    ],
  },
  // Chicken Plate ($15) and Kofta Plate ($15) — add once you have
  // descriptions/photos for these. Example row:
  // { id: "chicken-plate", name: "Chicken Plate", price: 15, category: "Combos", kitchen: "main", image: "", description: "" },

  // ---- Sandwiches ----
  {
    id: "chicken-shawarma-sandwich", name: "Chicken Shawarma Sandwich", price: 10, category: "Sandwiches", kitchen: "sandwich",
    image: "images/chicken-shawarma-sandwich.webp",
    description: "Roasted, thin-sliced chicken with tomato, parsley, and onion, topped with yogurt sauce and tahini, wrapped in pita.",
    options: [
      { name: "Spice Level", default: 0, choices: ["Regular (standard)", "Spicy"] },
    ],
  },
  {
    id: "kofta-sandwich", name: "Kofta Sandwich", price: 8, category: "Sandwiches", kitchen: "sandwich",
    image: "images/kofta-sandwich.webp",
    description: "Grilled ground beef kofta with cucumber, tomato, and lettuce, topped with tahini sauce, wrapped in pita.",
  },
  {
    id: "falafel-sandwich", name: "Falafel Sandwich", price: 8, category: "Sandwiches", kitchen: "sandwich",
    image: "images/falafel-sandwich.webp",
    description: "Spiced chickpea fritters, deep-fried and served in pita bread.",
  },
  {
    id: "beef-shawarma-sandwich", name: "Beef Shawarma Sandwich", price: 12, category: "Sandwiches", kitchen: "sandwich",
    image: "images/beef-shawarma-sandwich.webp",
    description: "Roasted, thin-sliced beef with tomato, parsley, and onion, topped with yogurt sauce and lemon-tahini sauce, wrapped in pita.",
    options: [
      { name: "Spice Level", default: 0, choices: ["Regular (standard)", "Spicy"] },
    ],
  },

  // ---- Sides ----
  {
    id: "macaroni-bechamel", name: "Macaroni B\u00e9chamel", price: 4, category: "Sides", kitchen: "main",
    image: "images/macaroni-bechamel.webp",
    description: "An Egyptian take on baked pasta — penne layered with spiced ground beef and onion, topped with creamy b\u00e9chamel sauce and baked golden.",
  },
  {
    id: "stuffed-grape-leaves", name: "Stuffed Grape Leaves (Mahshi)", price: 5, category: "Sides", kitchen: "main",
    image: "images/stuffed-grape-leaves.webp",
    description: "10 pieces of grape leaves stuffed with rice and ground beef.",
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
