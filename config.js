// ============================================================
// CONFIG — edit this file to set up your event
// ============================================================

// After you deploy the Apps Script (see README step 3), paste
// the Web App URL it gives you here:
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzcG9umOIZjlfBbraFOwIDPXpHhCfrvZ4m9RW9GtVsqup6BlmBJQaRc2Ugj-yBbGQ0k/exec";

// Your menu. id must be unique. price is in dollars.
const MENU = [
  { id: "kofta",    name: "Kofta Plate",         price: 12, category: "Mains" },
  { id: "shawarma", name: "Chicken Shawarma",    price: 10, category: "Mains" },
  { id: "koshari",  name: "Koshari",             price: 9,  category: "Mains" },
  { id: "falafel",  name: "Falafel Sandwich",    price: 7,  category: "Mains" },
  { id: "molokhia", name: "Molokhia & Rice",     price: 9,  category: "Mains" },
  { id: "warak",    name: "Grape Leaves (6pc)",  price: 6,  category: "Sides" },
  { id: "baklava",  name: "Baklava (2pc)",       price: 4,  category: "Desserts" },
  { id: "basbousa", name: "Basbousa",            price: 4,  category: "Desserts" },
  { id: "karkade",  name: "Hibiscus Tea (Karkade)", price: 3, category: "Drinks" },
  { id: "water",    name: "Bottled Water",       price: 1,  category: "Drinks" },
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
