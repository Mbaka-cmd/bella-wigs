// Product catalog for the static Bella Wigs site.
// Images live in assets/images/ — filenames match the renamed seed_media files.
const PRODUCTS = [
  { id: "1", name: "13x4 Lace Front Wig, 22\"", category: "Straight Wigs", hair_type: "Brazilian Remy", density: "180%", lace: "13x4 Lace Front", length: 22, price: 11000, image: "straight-13x4-lace-front.png", badge: "Best Seller" },
  { id: "2", name: "Glueless 13x4 HD Lace Front Wig", category: "Straight Wigs", hair_type: "100% Human Hair", density: "150%", lace: "13x4 HD Lace", length: 20, price: 10500, image: "straight-glueless-13x4.png" },
  { id: "3", name: "Chic Bob Wig, Closure Fringe", category: "Bob Wigs", hair_type: "100% Human Hair", density: "150%", lace: "Closure", length: 12, price: 7000, image: "bob-closure-fringe.png" },
  { id: "4", name: "Sleek Pixie Cut Wig", category: "Pixie Wigs", hair_type: "100% Human Hair", density: "130%", lace: "Fringe, No Lace", length: 8, price: 6500, image: "pixie-sleek-cut.png" },
  { id: "5", name: "Peruvian Water Wave 20\"", category: "Water Wave Wigs", hair_type: "100% Human Hair", density: "180%", lace: "5x5 Closure, HD Lace", length: 20, price: 9500, image: "water-wave-peruvian-20.png", badge: "Best Seller" },
  { id: "6", name: "Balayage Body Wave Wig", category: "Water Wave Wigs", hair_type: "100% Human Hair", density: "150%", lace: "Lace Front", length: 18, price: 9800, image: "wave-balayage-body.png" },
  { id: "7", name: "Wavy Curls Wig", category: "Water Wave Wigs", hair_type: "100% Human Hair", density: "150%", lace: "Closure", length: 20, price: 9200, image: "wave-curls-style.png" },
  { id: "8", name: "Kinky Afro Curl Wig 16\"", category: "Afro Wigs", hair_type: "LDYESTIM Human Hair", density: "180%", lace: "Full Lace", length: 16, price: 8800, image: "afro-ldyestim-16.png" }
];

// Occasion -> category mapping for the AI Wig Finder
const OCCASION_MAP = {
  "Office": "Straight Wigs",
  "Wedding": "Water Wave Wigs",
  "Everyday": "Bob Wigs",
  "Church": "Pixie Wigs",
  "Fashion": "Afro Wigs",
  "Cancer Treatment": "all"
};
