// Nader Dokan menu — edit names and prices here (prices in Toman; null = "not set yet").
export const MENU = {
  currency: "تومان",
  items: [
    { id: "classic", cat: "hotdog", emoji: "🌭", name: "هات‌داگ کلاسیک", desc: "سوسیس گریل‌شده، نان تازه، سس کچاپ و خردل", price: null },
    { id: "cheese",  cat: "hotdog", emoji: "🧀", name: "هات‌داگ پنیری", desc: "کلاسیک با پنیر آب‌شده‌ی داغ", price: null },
    { id: "spicy",   cat: "hotdog", emoji: "🌶️", name: "هات‌داگ تند", desc: "هالاپینو و سس تند مخصوص", price: null },
    { id: "special", cat: "hotdog", emoji: "⭐", name: "هات‌داگ مخصوص نادر", desc: "دستور مخصوص ما با همه‌ی مخلفات", price: null },
    { id: "burger",  cat: "food",   emoji: "🍔", name: "برگر", desc: "برگر آبدار با کاهو، گوجه و سس", price: null },
    { id: "fries",   cat: "food",   emoji: "🍟", name: "سیب‌زمینی سرخ‌کرده", desc: "ترد و طلایی با ادویه‌ی مخصوص", price: null },
    { id: "soda",    cat: "drink",  emoji: "🥤", name: "نوشابه", desc: "خنک", price: null },
    { id: "doogh",   cat: "drink",  emoji: "🥛", name: "دوغ", desc: "خنک", price: null },
    { id: "water",   cat: "drink",  emoji: "💧", name: "آب معدنی", desc: "", price: null }
  ],
  custom: {
    basePrice: null,
    buns: [
      { id: "plain",  name: "نان ساده" },
      { id: "sesame", name: "نان کنجدی" }
    ],
    sausages: [
      { id: "regular", name: "سوسیس معمولی" },
      { id: "smoked",  name: "سوسیس دودی" },
      { id: "spicy",   name: "سوسیس تند" }
    ],
    toppings: [
      { id: "cheese",   name: "پنیر",        color: "#FFB627" },
      { id: "pickles",  name: "خیارشور",     color: "#7BA428" },
      { id: "onion",    name: "پیاز",        color: "#EFE3F1" },
      { id: "friedonion", name: "پیاز داغ",  color: "#B8742A" },
      { id: "tomato",   name: "گوجه",        color: "#E2352B" },
      { id: "mushroom", name: "قارچ",        color: "#A98B6D" },
      { id: "jalapeno", name: "هالاپینو",    color: "#3E8E3A" },
      { id: "lettuce",  name: "کاهو",        color: "#8BC34A" }
    ],
    sauces: [
      { id: "ketchup", name: "سس کچاپ",  color: "#C8102E" },
      { id: "mustard", name: "سس خردل",  color: "#F2C200" },
      { id: "mayo",    name: "سس مایونز", color: "#FFF6D8" },
      { id: "special", name: "سس مخصوص", color: "#F08A3C" }
    ]
  }
};

export const TABLES = 5;
