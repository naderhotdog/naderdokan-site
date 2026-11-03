// Default Nader Dokan menu. Used until the head manager saves a menu in the owner panel
// (after that the saved copy in the database is used). Prices in Toman; null = "not set yet".
export const MENU = {
  currency: "تومان",
  items: [
    { id: "classic", cat: "hotdog", emoji: "🌭", name: "هات‌داگ کلاسیک", desc: "سوسیس گریل‌شده، نان تازه، سس کچاپ و خردل", price: null, available: true },
    { id: "cheese",  cat: "hotdog", emoji: "🧀", name: "هات‌داگ پنیری", desc: "کلاسیک با پنیر آب‌شده‌ی داغ", price: null, available: true },
    { id: "spicy",   cat: "hotdog", emoji: "🌶️", name: "هات‌داگ تند", desc: "هالاپینو و سس تند مخصوص", price: null, available: true },
    { id: "special", cat: "hotdog", emoji: "⭐", name: "هات‌داگ مخصوص نادر", desc: "دستور مخصوص ما با همه‌ی مخلفات", price: null, available: true },
    { id: "burger",  cat: "food",   emoji: "🍔", name: "برگر", desc: "برگر آبدار با کاهو، گوجه و سس", price: null, available: true },
    { id: "fries",   cat: "food",   emoji: "🍟", name: "سیب‌زمینی سرخ‌کرده", desc: "ترد و طلایی با ادویه‌ی مخصوص", price: null, available: true },
    { id: "soda",    cat: "drink",  emoji: "🥤", name: "نوشابه", desc: "خنک", price: null, available: true },
    { id: "doogh",   cat: "drink",  emoji: "🥛", name: "دوغ", desc: "خنک", price: null, available: true },
    { id: "water",   cat: "drink",  emoji: "💧", name: "آب معدنی", desc: "", price: null, available: true }
  ],
  custom: {
    basePrice: null,
    buns: [
      { id: "plain",  name: "نان ساده", available: true },
      { id: "sesame", name: "نان کنجدی", available: true }
    ],
    sausages: [
      { id: "regular", name: "سوسیس معمولی", available: true },
      { id: "smoked",  name: "سوسیس دودی", available: true },
      { id: "spicy",   name: "سوسیس تند", available: true }
    ],
    toppings: [
      { id: "cheese",     name: "پنیر",     color: "#FFB627", price: 0, available: true },
      { id: "pickles",    name: "خیارشور",  color: "#7BA428", price: 0, available: true },
      { id: "onion",      name: "پیاز",     color: "#EFE3F1", price: 0, available: true },
      { id: "friedonion", name: "پیاز داغ", color: "#B8742A", price: 0, available: true },
      { id: "tomato",     name: "گوجه",     color: "#E2352B", price: 0, available: true },
      { id: "mushroom",   name: "قارچ",     color: "#A98B6D", price: 0, available: true },
      { id: "jalapeno",   name: "هالاپینو", color: "#3E8E3A", price: 0, available: true },
      { id: "lettuce",    name: "کاهو",     color: "#8BC34A", price: 0, available: true }
    ],
    sauces: [
      { id: "ketchup", name: "سس کچاپ",   color: "#C8102E", price: 0, available: true },
      { id: "mustard", name: "سس خردل",   color: "#F2C200", price: 0, available: true },
      { id: "mayo",    name: "سس مایونز", color: "#FFF6D8", price: 0, available: true },
      { id: "special", name: "سس مخصوص",  color: "#F08A3C", price: 0, available: true }
    ]
  }
};

export const TABLES = 5;
