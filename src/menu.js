// Nader Hotdog menu — taken from the shop's Snappfood page (Nov 2026). Prices in Toman.
// Used until the head manager saves a menu in the owner panel (after that the saved copy is used).
export const MENU = {
  v: 2,
  currency: "تومان",
  cats: [
    { id: "special", name: "ساندویچ‌های هات‌داگ مخصوص", short: "مخصوص‌ها", emoji: "⭐" },
    { id: "classic", name: "ساندویچ‌های هات‌داگ کلاسیک", short: "کلاسیک‌ها", emoji: "🌭" },
    { id: "fries",   name: "سیب‌زمینی", short: "سیب‌زمینی", emoji: "🍟" },
    { id: "drink",   name: "نوشیدنی", short: "نوشیدنی", emoji: "🥤" }
  ],
  items: [
    // --- special hotdogs (all with a 70% beef special hotdog, hotdog bun and seasoned fries)
    { id: "smokedog",   cat: "special", emoji: "🔥", name: "اسموک داگ",   desc: "هات‌داگ اسپشیال گوشت ۷۰٪، سس باربیکیو، ۴۰ گرم بیکن گوشت و مرغ ۹۰٪، پنیر موزارلا دودی، نان هات‌داگ، ۱۵۰ گرم سیب‌زمینی سرخ‌شده‌ی طعم‌دار", price: 663000, available: true },
    { id: "cheddarslam", cat: "special", emoji: "🧀", name: "چدار اسلم",  desc: "هات‌داگ اسپشیال گوشت ۷۰٪ سرخ‌شده، نان مخصوص هات‌داگ، سس دست‌ساز، دیپ چدار، پیاز کاراملی، سیب‌زمینی سرخ‌شده‌ی طعم‌دار", price: 619000, available: true },
    { id: "monsterbite", cat: "special", emoji: "👹", name: "مانستر بایت", desc: "هات‌داگ اسپشیال گوشت ۷۰٪ سرخ‌شده، نان مخصوص هات‌داگ، ۴۰ گرم گوشت چرخ‌کرده‌ی سرخ‌شده‌ی طعم‌دار، سس دست‌ساز، دیپ چدار، بیکن گوشت و مرغ ۹۰٪، سیب‌زمینی سرخ‌شده", price: 745000, available: true },
    { id: "lavadog",    cat: "special", emoji: "🌋", name: "لاوا داگ",    desc: "هات‌داگ اسپشیال گوشت ۷۰٪ سرخ‌شده، نان مخصوص هات‌داگ، سس دست‌ساز، ۴۰ گرم پپرونی گوشت گوساله ۹۰٪، پنیر موزارلا دودی، سیب‌زمینی سرخ‌شده", price: 645000, available: true },
    { id: "loadeddog",  cat: "special", emoji: "💥", name: "لودد داگ",    desc: "هات‌داگ اسپشیال گوشت ۷۰٪ سرخ‌شده، نان مخصوص هات‌داگ، سس دست‌ساز، دیپ چدار، ۴۰ گرم بیکن گوشت و مرغ ۹۰٪، سیب‌زمینی سرخ‌شده", price: 653000, available: true },
    { id: "sausagedog", cat: "special", emoji: "🥩", name: "سویج داگ",    desc: "هات‌داگ اسپشیال گوشت ۷۰٪ سرخ‌شده، نان مخصوص هات‌داگ، سس دست‌ساز، دیپ چدار، گوشت چرخ‌کرده‌ی گوسفندی سرخ‌شده‌ی طعم‌دار، سیب‌زمینی سرخ‌شده‌ی طعم‌دار", price: 667000, available: true },
    { id: "jizzdog",    cat: "special", emoji: "🌶️", name: "جیز داگ",     desc: "هات‌داگ اسپشیال گوشت ۷۰٪ سرخ‌شده، نان مخصوص هات‌داگ، ۳۰ گرم سس هالاپینو تند، ۴۰ گرم پپرونی گوشت گوساله ۹۰٪، ۴۰ گرم پنیر پیتزا، ۱۵۰ گرم سیب‌زمینی سرخ‌شده‌ی طعم‌دار", price: 639000, available: true },
    // --- classic hotdogs
    { id: "specialclassic", cat: "classic", emoji: "🌭", name: "هات‌داگ اسپشیال",          desc: "یک عدد سوسیس هات‌داگ گوشت ۷۰٪، ۱۵۰ گرم سیب‌زمینی سرخ‌کرده، سس دست‌ساز خیارشور، سس خردل", price: 520000, available: true },
    { id: "beefclassic",    cat: "classic", emoji: "🥖", name: "بیف هات‌داگ دست‌ساز",     desc: "نان باگت، یک عدد هات‌داگ دست‌ساز گوشت گوسفندی ۹۰٪، سس دست‌ساز، ۱۵۰ گرم سیب‌زمینی سرخ‌شده", price: 659000, available: true },
    { id: "chickenclassic", cat: "classic", emoji: "🐔", name: "چیکن هات‌داگ دست‌ساز",    desc: "نان باگت، یک عدد هات‌داگ مرغ دست‌ساز ۹۰٪، سس دست‌ساز، ۱۵۰ گرم سیب‌زمینی سرخ‌شده", price: 548000, available: true },
    { id: "cheeseclassic",  cat: "classic", emoji: "🧀", name: "چیز هات‌داگ دست‌ساز",     desc: "نان باگت، یک عدد هات‌داگ مرغ پنیری دست‌ساز ۷۰٪، سس دست‌ساز، ۱۵۰ گرم سیب‌زمینی سرخ‌شده", price: 559000, available: true },
    // --- fries
    { id: "frieslarge", cat: "fries", emoji: "🍟", name: "سیب‌زمینی سرخ‌شده بزرگ (۳۰۰ گرم)", desc: "سیب‌زمینی سرخ‌شده با ادویه‌ی مخصوص و سس دست‌ساز", price: 239000, available: true },
    { id: "friesmini",  cat: "fries", emoji: "🍟", name: "سیب‌زمینی سرخ‌شده مینی",           desc: "سیب‌زمینی سرخ‌شده با ادویه‌ی مخصوص و سس دست‌ساز", price: 189000, available: true },
    { id: "beeffries",  cat: "fries", emoji: "🥓", name: "بیف فرایز",                        desc: "۳۰۰ گرم سیب‌زمینی سرخ‌شده با هات‌داگ حلقه‌ای گوشت ۷۰٪", price: 499000, available: true },
    // --- drinks
    { id: "heydaypeach",  cat: "drink", emoji: "🍑", name: "ماءالشعیر هی‌دی هلو",     desc: "قوطی ۳۳۰ میلی‌لیتر", price: 90000, available: true },
    { id: "heydaylemon",  cat: "drink", emoji: "🍋", name: "ماءالشعیر هی‌دی لیمو",    desc: "قوطی ۳۳۰ میلی‌لیتر", price: 90000, available: true },
    { id: "heydaytropic", cat: "drink", emoji: "🍍", name: "ماءالشعیر هی‌دی استوایی", desc: "قوطی ۳۳۰ میلی‌لیتر", price: 90000, available: true },
    { id: "coke",   cat: "drink", emoji: "🥤", name: "کوکاکولا",       desc: "قوطی ۳۳۰ میلی‌لیتر", price: 94000, available: true },
    { id: "fanta",  cat: "drink", emoji: "🍊", name: "فانتا پرتقالی",  desc: "قوطی ۳۳۰ میلی‌لیتر", price: 94000, available: true },
    { id: "sprite", cat: "drink", emoji: "🍋‍🟩", name: "اسپرایت",      desc: "قوطی ۳۳۰ میلی‌لیتر", price: 94000, available: true },
    { id: "water",  cat: "drink", emoji: "💧", name: "آب معدنی کوچک", desc: "۵۰۰ میلی‌لیتر", price: 24000, available: true }
  ],
  // "Build your own" game. Price = basePrice + bun + sausage + each topping/sauce.
  // Base = هات‌داگ اسپشیال with 150g fries. Extra prices are worked out from the Snappfood combos.
  custom: {
    basePrice: 520000,
    note: "همراه ۱۵۰ گرم سیب‌زمینی سرخ‌شده",
    buns: [
      { id: "plain",    name: "نان مخصوص هات‌داگ", price: 0, available: true },
      { id: "baguette", name: "نان باگت",          price: 0, available: true }
    ],
    sausages: [
      { id: "regular", name: "اسپشیال گوشت ۷۰٪",           price: 0,      available: true },
      { id: "beef",    name: "دست‌ساز گوسفندی ۹۰٪",        price: 139000, available: true },
      { id: "chicken", name: "مرغ دست‌ساز ۹۰٪",            price: 28000,  available: true },
      { id: "cheesy",  name: "مرغ پنیری دست‌ساز ۷۰٪",      price: 39000,  available: true }
    ],
    toppings: [
      { id: "bacon",      name: "بیکن گوشت و مرغ",     color: "#C8553D", price: 78000, available: true },
      { id: "pepperoni",  name: "پپرونی گوساله",       color: "#B8321F", price: 80000, available: true },
      { id: "mince",      name: "گوشت چرخ‌کرده",       color: "#7A4026", price: 92000, available: true },
      { id: "mozzarella", name: "موزارلا دودی",        color: "#F6E7B8", price: 45000, available: true },
      { id: "pizzacheese",name: "پنیر پیتزا",          color: "#FFD45C", price: 30000, available: true },
      { id: "caramelonion", name: "پیاز کاراملی",      color: "#B8742A", price: 44000, available: true }
    ],
    sauces: [
      { id: "house",    name: "سس دست‌ساز",       color: "#F08A3C", price: 0,     available: true },
      { id: "cheddar",  name: "دیپ چدار",         color: "#FFA21F", price: 55000, available: true },
      { id: "bbq",      name: "سس باربیکیو",      color: "#6B2412", price: 20000, available: true },
      { id: "mustard",  name: "سس خردل",          color: "#F2C200", price: 0,     available: true },
      { id: "pickle",   name: "سس خیارشور",       color: "#9CB33A", price: 0,     available: true },
      { id: "jalapeno", name: "سس هالاپینو تند",  color: "#3E8E3A", price: 10000, available: true }
    ]
  }
};

export const TABLES = 5;
