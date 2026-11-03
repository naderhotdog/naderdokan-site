# Nader Dokan website

Live at https://naderdokan.com and https://naderdokan.ir (Cloudflare Worker `naderdokan`).

- `/` coming-soon page (`public/index.html`); full site draft at `/site`
- `/menu?t=N` table ordering menu (N = table 1–5)
- `/build?t=N` build-your-own hotdog game
- `/kitchen` kitchen screen with auto-print (code chosen on first visit)
- `/qr` printable QR codes for the tables
- Menu items, toppings and prices: `src/menu.js`
- Orders are stored in the D1 database `naderdokan-orders`
