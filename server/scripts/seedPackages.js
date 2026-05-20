require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: String, tagline: String, description: String, location: String,
  difficulty: String, difficultyNote: String, duration: Number,
  maxAltitude: String, season: String, bestSeasonTip: String, trekType: String,
  maxGroupSize: Number, availableSlots: Number,
  price: Number, priceUSD: Number, premiumPrice: Number, pricingType: String,
  includes: [String], excludes: [String],
  itinerary: [{ day: Number, description: String, walkingHours: String }],
  permits: [{ name: String, cost: String }],
  images: [{ url: String, isCover: Boolean, order: Number }],
  coverImage: String,
  availableDates: [Date],
  isPremiumOnly: Boolean, isActive: Boolean, isFeatured: Boolean,
  showOnMap: Boolean, status: String,
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);

const raw = [
  {
    title: "Australian Camp Trek",
    tagline: "Scenic ridge walk perfect for families and first-time trekkers",
    location: "Pokhara, Nepal",
    description: "The Australian Camp Trek is one of the most accessible and rewarding short treks departing from Pokhara. Starting with a short drive to Kande (1,770m), the trail climbs gently through dense rhododendron and oak forests before opening up to sweeping panoramic views of the Annapurna range, Machhapuchhre (Fishtail), Lamjung Himal, and Dhaulagiri. The campsite at Australian Camp (2,060m) offers one of the most dramatic open-sky viewpoints in the entire Pokhara region — ideal for sunrise and sunset photography. The descent on Day 2 passes through the traditional Gurung village of Dhampus, where you can interact with locals and explore stone-paved lanes. The trek requires no prior experience and suits all ages, including children and senior trekkers. Teahouses along the route provide comfortable accommodation and warm Nepali meals including dal bhat, momos, and noodle soup. The trail is well-marked and safe year-round, making it the perfect introduction to Himalayan trekking.",
    difficulty: "Easy", difficultyNote: "Gentle ascent, 3–4 hrs walking per day, no altitude concern, suitable for all ages",
    duration: 2, maxAltitude: "2,060m", season: "Year-round",
    bestSeasonTip: "Oct–Nov for crystal clear skies, Mar–Apr for rhododendron blooms",
    trekType: "Teahouse", maxGroupSize: 25, availableSlots: 25,
    priceNPR: 6000, priceUSD: 45, premiumPriceNPR: 4500, pricingType: "per_person",
    includes: ["Teahouse accommodation", "All meals (3 per day)", "Licensed English-speaking guide", "Transport Pokhara–Kande–Pokhara", "First aid kit"],
    excludes: ["ACAP permit (NPR 3,000)", "Personal trekking gear", "Travel insurance", "Tips for guide", "Alcoholic beverages"],
    itinerary: [
      { day: 1, description: "Drive from Pokhara to Kande (30 min). Trek through rhododendron forest via Pothana to Australian Camp (2,060m). Enjoy panoramic Annapurna sunset views.", walkingHours: "3–4 hrs" },
      { day: 2, description: "Early sunrise views over Annapurna and Fishtail. Descend via the traditional Gurung village of Dhampus. Drive back to Pokhara lakeside.", walkingHours: "3–4 hrs" }
    ],
    permits: [{ name: "ACAP (Annapurna Conservation Area Permit)", cost: "NPR 3,000 (~USD 23) — not included, purchased separately" }],
    images: [
      { url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200", isCover: true, order: 1 },
      { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200", isCover: false, order: 2 },
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200", isCover: false, order: 3 }
    ],
    availableDates: ["2026-01-20","2026-04-20","2026-07-15","2026-10-20"],
    isActive: true, isPremiumOnly: false, isFeatured: true, showOnMap: true, status: "published"
  },
  {
    title: "Ghandruk Village Cultural Trek",
    tagline: "Immersive Gurung heritage with front-row Fishtail mountain views",
    location: "Pokhara, Nepal",
    description: "The Ghandruk Village Cultural Trek is the perfect blend of mountain scenery and authentic Nepali culture. Ghandruk is one of the largest Gurung villages in Nepal, perched at 2,010m with breathtaking views of Annapurna South, Hiunchuli, and the iconic Machhapuchhre (Fishtail). The trek begins with a drive to Nayapul, then climbs through terraced farmland and subtropical forest to the stone-paved village, where traditional slate-roofed houses and carved wooden doorways line narrow lanes. On Day 2, visit the Gurung Museum to understand the warrior heritage, shamanic traditions, and daily life of the Gurung people. Descend to Jhinu Danda (1,780m) — a riverside settlement famous for its natural hot springs, where you can soak tired legs in thermal pools overlooking the Modi Khola river. The final day follows the riverbank trail back to Nayapul for the return drive to Pokhara. This trek is ideal for culture lovers, photographers, and anyone wanting a genuine village experience without extreme exertion.",
    difficulty: "Easy", difficultyNote: "Gentle to moderate terrain, 4–5 hrs daily, well-marked trails, suitable for beginners",
    duration: 3, maxAltitude: "2,010m", season: "Year-round",
    bestSeasonTip: "Oct–Nov for mountain clarity, Dec–Feb for quiet trails and crisp air",
    trekType: "Teahouse", maxGroupSize: 20, availableSlots: 20,
    priceNPR: 18000, priceUSD: 135, premiumPriceNPR: 14000, pricingType: "per_person",
    includes: ["Teahouse accommodation (2 nights)", "All meals", "Licensed guide", "Transport Pokhara–Nayapul–Pokhara", "Gurung Museum entrance"],
    excludes: ["ACAP permit (NPR 3,000)", "Hot spring entry fee (NPR 200)", "Personal expenses", "Tips", "Travel insurance"],
    itinerary: [
      { day: 1, description: "Drive Pokhara to Nayapul (1.5 hrs). Trek through Birethanti and ascend through terraced fields to Ghandruk village (2,010m). Evening village walk.", walkingHours: "5 hrs" },
      { day: 2, description: "Morning visit to Gurung Museum and village cultural tour. Descend forest trail to Jhinu Danda (1,780m). Relax at the famous natural hot springs.", walkingHours: "3 hrs" },
      { day: 3, description: "Morning river walk from Jhinu Danda to Nayapul along Modi Khola. Drive back to Pokhara. Arrive by afternoon.", walkingHours: "3–4 hrs" }
    ],
    permits: [
      { name: "ACAP (Annapurna Conservation Area Permit)", cost: "NPR 3,000 (~USD 23)" },
      { name: "TIMS Card", cost: "NPR 2,000 (~USD 15)" }
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=1200", isCover: true, order: 1 },
      { url: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200", isCover: false, order: 2 },
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200", isCover: false, order: 3 }
    ],
    availableDates: ["2026-02-15","2026-05-10","2026-09-15","2026-12-01"],
    isActive: true, isPremiumOnly: false, isFeatured: false, showOnMap: true, status: "published"
  },
  {
    title: "Poon Hill Sunrise Trek",
    tagline: "Nepal's most iconic sunrise — Annapurna & Dhaulagiri from 3,210m",
    location: "Pokhara, Nepal",
    description: "The Poon Hill Trek is Nepal's most celebrated short trek and one of the most photographed viewpoints in all of Asia. The trail follows the classic Ghorepani route, winding through Magar villages, ancient stone-paved stairways, and the world's largest rhododendron forest — which explodes into crimson and pink bloom every March and April. Ghorepani (2,874m) is a bustling teahouse village where trekkers gather each evening in anticipation of the pre-dawn climb to Poon Hill (3,210m). The summit view is staggering: a 180-degree panorama of Dhaulagiri I (8,167m), Annapurna I (8,091m), Annapurna South, Nilgiri, Tukuche, and Machhapuchhre rising like cathedral spires from the ridgeline as the sun burns orange across the Himalayan horizon. The descent passes through Tadapani and Ghandruk, offering continued cultural immersion and forest walks. This trek strikes the perfect balance between accessibility and reward — tough enough to feel like an achievement, manageable enough for anyone with moderate fitness.",
    difficulty: "Moderate", difficultyNote: "5–7 hrs daily, significant stone stairway climbing, reaches 3,210m — some altitude awareness needed",
    duration: 4, maxAltitude: "3,210m", season: "Year-round",
    bestSeasonTip: "Mar–Apr for rhododendron blooms, Oct–Nov for the sharpest mountain views",
    trekType: "Teahouse", maxGroupSize: 20, availableSlots: 20,
    priceNPR: 39000, priceUSD: 299, premiumPriceNPR: 32000, pricingType: "per_person",
    includes: ["Teahouse accommodation (3 nights)", "All meals (3 per day)", "Licensed English-speaking guide", "Porter (1 per 2 trekkers)", "Transport Pokhara–Nayapul–Pokhara", "ACAP & TIMS permits", "First aid kit"],
    excludes: ["Personal trekking gear", "Travel insurance (mandatory)", "Alcoholic drinks", "Hot showers at teahouses (NPR 200–300 extra)", "Tips"],
    itinerary: [
      { day: 1, description: "Drive Pokhara to Nayapul (1.5 hrs). Trek via Birethanti to Tikhedhunga (1,577m), passing the famous 3,000-step stone stairway. Overnight teahouse.", walkingHours: "5–6 hrs" },
      { day: 2, description: "Climb from Tikhedhunga through dense rhododendron forest to Ghorepani (2,874m). First Himalayan panorama views appear as you near the top.", walkingHours: "5–6 hrs" },
      { day: 3, description: "Pre-dawn hike (45 min) to Poon Hill (3,210m) for sunrise over Dhaulagiri and Annapurna range. Return to Ghorepani for breakfast, then trek to Tadapani (2,630m).", walkingHours: "6–7 hrs total" },
      { day: 4, description: "Descend through Ghandruk village (2,010m), explore Gurung museum, drive from Syauli Bazaar back to Pokhara. Arrive by evening.", walkingHours: "3–4 hrs + 2 hr drive" }
    ],
    permits: [
      { name: "ACAP (Annapurna Conservation Area Permit)", cost: "NPR 3,000 (~USD 23) — included in package" },
      { name: "TIMS Card", cost: "NPR 2,000 (~USD 15) — included in package" }
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=1200", isCover: true, order: 1 },
      { url: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=1200", isCover: false, order: 2 },
      { url: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200", isCover: false, order: 3 },
      { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200", isCover: false, order: 4 }
    ],
    availableDates: ["2026-03-01","2026-04-15","2026-10-05","2026-11-20"],
    isActive: true, isPremiumOnly: false, isFeatured: true, showOnMap: true, status: "published"
  },
  {
    title: "Mardi Himal Base Camp Trek",
    tagline: "Peaceful ridge walk with the closest views of Fishtail in all of Nepal",
    location: "Pokhara, Nepal",
    description: "The Mardi Himal Trek is Pokhara's best-kept secret — a stunning high-ridge trail that delivers closer views of Machhapuchhre (Fishtail, 6,993m) than any other trek in the region, yet remains remarkably uncrowded compared to Poon Hill or Annapurna Base Camp. The route climbs from Kande through Australian Camp and deep into the Mardi Himal Conservation Zone, ascending through four distinct ecological zones: subtropical forest, rhododendron belt, alpine meadow, and high-altitude rocky terrain. Low Camp (3,150m) and High Camp (3,850m) offer progressively more dramatic views of Mardi Himal, Annapurna I, Annapurna South, Hiunchuli, and the towering blade of Machhapuchhre, which changes color from gold to pink at dawn. The summit push to Mardi Himal Base Camp (4,500m) is the trek's climax — a rocky cirque surrounded by glaciers and ice walls with unobstructed views of the Annapurna Sanctuary. Facilities at higher camps are basic (no Wi-Fi, limited hot water), which keeps the experience authentic and the trail quiet.",
    difficulty: "Moderate", difficultyNote: "Reaches 4,500m — moderate altitude risk, 5–7 hrs daily, rocky trail above Low Camp, basic facilities at high camps",
    duration: 5, maxAltitude: "4,500m", season: "Mar–May, Oct–Nov",
    bestSeasonTip: "Apr for blooming rhododendrons, Oct–Nov for stable skies and sharp ridge views",
    trekType: "Teahouse", maxGroupSize: 15, availableSlots: 15,
    priceNPR: 40300, priceUSD: 310, premiumPriceNPR: 33000, pricingType: "per_person",
    includes: ["Teahouse accommodation (4 nights)", "All meals", "Licensed guide", "Porter", "Transport Pokhara–Kande–Siding–Pokhara", "ACAP & TIMS permits"],
    excludes: ["Personal trekking gear", "Travel insurance", "Wi-Fi and hot showers (charged separately at camps)", "Tips", "Emergency evacuation costs"],
    itinerary: [
      { day: 1, description: "Drive Pokhara to Kande (30 min). Trek via Australian Camp (2,060m) and Pothana to Forest Camp (2,600m) through dense rhododendron. Overnight teahouse.", walkingHours: "6–7 hrs" },
      { day: 2, description: "Trek from Forest Camp through Low Camp (3,150m). Ridge opens up with first views of Machhapuchhre at close range. Short acclimatization walk in afternoon.", walkingHours: "4–5 hrs" },
      { day: 3, description: "Ascend to High Camp (3,850m). Sweeping panoramic ridge views of Annapurna I, Annapurna South, and Mardi Himal. Rest and acclimatize.", walkingHours: "4 hrs" },
      { day: 4, description: "Early start to Mardi Himal Base Camp (4,500m) — glacial cirque with 360° high-altitude views. Return to Low Camp for overnight.", walkingHours: "6–7 hrs" },
      { day: 5, description: "Descend via forest trail to Siding village. Jeep transfer back to Pokhara. Arrive by afternoon.", walkingHours: "4–5 hrs + 1 hr drive" }
    ],
    permits: [
      { name: "ACAP (Annapurna Conservation Area Permit)", cost: "NPR 3,000 (~USD 23) — included" },
      { name: "TIMS Card", cost: "NPR 2,000 (~USD 15) — included" }
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1585016495481-91613ca6e1de?w=1200", isCover: true, order: 1 },
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200", isCover: false, order: 2 },
      { url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200", isCover: false, order: 3 }
    ],
    availableDates: ["2026-03-20","2026-04-25","2026-10-15","2026-11-10"],
    isActive: true, isPremiumOnly: false, isFeatured: true, showOnMap: true, status: "published"
  },
  {
    title: "Annapurna Base Camp Trek",
    tagline: "Into the Annapurna Sanctuary — surrounded by eight peaks above 7,000m",
    location: "Pokhara, Nepal",
    description: "The Annapurna Base Camp Trek (ABC) is one of the most awe-inspiring journeys in Himalayan trekking — leading into the Annapurna Sanctuary, a glacial amphitheater enclosed by a ring of towering summits including Annapurna I (8,091m), Annapurna South (7,219m), Hiunchuli (6,441m), Machhapuchhre (6,993m), Gangapurna (7,455m), and Glacier Dome (7,193m). The trail departs from Pokhara and winds through the Modi Khola valley, passing Gurung and Magar villages, bamboo groves, terraced rice fields, and increasingly dramatic gorge landscapes before emerging into the open high-altitude Sanctuary at 4,130m. Machhapuchhre Base Camp (3,700m) provides the first jaw-dropping view of the entire Annapurna massif wall — a sight that consistently ranks among the most photographed in Nepal. The route is well-serviced with comfortable teahouses, diverse cuisine, and established rescue infrastructure, making it suitable for first-time high-altitude trekkers with good fitness. The natural hot springs at Jhinu Danda on the return leg are a well-earned reward.",
    difficulty: "Moderate", difficultyNote: "5–7 hrs daily, max altitude 4,130m — altitude sickness awareness required, good fitness needed",
    duration: 9, maxAltitude: "4,130m", season: "Mar–May, Oct–Nov",
    bestSeasonTip: "Mar–Apr for spring rhododendrons, Oct–Nov for clear skies and stable weather",
    trekType: "Teahouse", maxGroupSize: 16, availableSlots: 16,
    priceNPR: 52000, priceUSD: 400, premiumPriceNPR: 43000, pricingType: "per_person",
    includes: ["Teahouse accommodation (8 nights)", "All meals (3 per day)", "Licensed English-speaking guide", "Porter (1 per 2 trekkers)", "Transport Pokhara–Nayapul–Pokhara", "ACAP & TIMS permits", "First aid kit", "Duffel bag for porter"],
    excludes: ["International & domestic flights", "Travel insurance (mandatory for high altitude)", "Personal trekking gear", "Alcoholic drinks", "Hot showers & Wi-Fi (charged at teahouses)", "Tips", "Emergency helicopter evacuation"],
    itinerary: [
      { day: 1, description: "Drive Pokhara to Nayapul (1.5 hrs). Trek via Birethanti to Chomrong (2,170m) through Gurung villages and terraced fields.", walkingHours: "5–6 hrs" },
      { day: 2, description: "Trek from Chomrong down into the Modi Khola gorge, cross suspension bridges, and climb to Sinuwa (2,360m) through bamboo forest.", walkingHours: "5 hrs" },
      { day: 3, description: "Continue through Bamboo (2,310m) and Doban (2,600m), ascending the narrowing gorge with increasing views of Hiunchuli and Annapurna South.", walkingHours: "5 hrs" },
      { day: 4, description: "Trek through Himalayan (2,920m) to Deurali (3,230m). Rhododendron and magnolia forests give way to alpine scrub. First views of the Sanctuary walls.", walkingHours: "5–6 hrs" },
      { day: 5, description: "Ascend to Machhapuchhre Base Camp (3,700m) — full view of the Fishtail peak looming overhead. Continue to Annapurna Base Camp (4,130m). Surrounded by Himalayan giants.", walkingHours: "5–6 hrs" },
      { day: 6, description: "Sunrise at ABC — arguably the most spectacular morning view in Nepal. Descend to Bamboo for overnight.", walkingHours: "6–7 hrs" },
      { day: 7, description: "Trek from Bamboo back to Chomrong. Hot springs at Jhinu Danda (1 hr detour) for recovery soak.", walkingHours: "5 hrs" },
      { day: 8, description: "Final descent from Chomrong to Nayapul via Ghandruk. Optional Gurung village exploration. Drive to Pokhara.", walkingHours: "5 hrs + 2 hr drive" },
      { day: 9, description: "Buffer / rest day in Pokhara. Free time at Phewa Lake, relaxation, or optional paragliding. Departure transfers.", walkingHours: "Rest day" }
    ],
    permits: [
      { name: "ACAP (Annapurna Conservation Area Permit)", cost: "NPR 3,000 (~USD 30) — included" },
      { name: "TIMS Card", cost: "NPR 2,000 (~USD 15) — included" }
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=1200", isCover: true, order: 1 },
      { url: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=1200", isCover: false, order: 2 },
      { url: "https://images.unsplash.com/photo-1585016495481-91613ca6e1de?w=1200", isCover: false, order: 3 },
      { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200", isCover: false, order: 4 }
    ],
    availableDates: ["2026-03-10","2026-04-20","2026-10-10","2026-11-05"],
    isActive: true, isPremiumOnly: false, isFeatured: true, showOnMap: true, status: "published"
  },
  {
    title: "Annapurna Circuit Trek",
    tagline: "The world's greatest trek — crossing Thorong La Pass at 5,416m",
    location: "Pokhara, Nepal",
    description: "The Annapurna Circuit is widely regarded as one of the finest long-distance treks on earth, offering an extraordinary diversity of landscape, culture, and altitude within a single route. Circumnavigating the entire Annapurna massif, the trail passes through subtropical river valleys, ancient Buddhist monasteries, the remote high-altitude desert of Mustang, and culminates in the legendary crossing of Thorong La Pass (5,416m) — the highest point of any standard trekking route in Nepal. The journey begins with a drive from Pokhara to Dharapani, then follows the Marsyangdi River northward through Gurung and Manangi villages, past terraced farmland and dense forest, before entering the stark, wind-sculpted landscapes of Manang district at 3,500m. Acclimatization hikes from Manang — including the optional Ice Lake hike to 4,600m — prepare trekkers for the dramatic Thorong La crossing. Beyond the pass, the sacred Hindu and Buddhist pilgrimage site of Muktinath temple sits at 3,800m in the otherworldly Mustang plateau. The trek concludes with a flight or drive from Jomsom back to Pokhara. A mandatory licensed guide has been required on all Annapurna Circuit routes since 2023.",
    difficulty: "Difficult", difficultyNote: "12–17 days, Thorong La at 5,416m — high altitude sickness risk, strong fitness and prior trekking experience recommended",
    duration: 15, maxAltitude: "5,416m", season: "Mar–May, Oct–Nov",
    bestSeasonTip: "Oct–Nov for stable weather and best pass conditions, Mar–May for spring color",
    trekType: "Teahouse", maxGroupSize: 12, availableSlots: 12,
    priceNPR: 130000, priceUSD: 1000, premiumPriceNPR: 108000, pricingType: "per_person",
    includes: ["Teahouse accommodation (14 nights)", "All meals (3 per day)", "Licensed government-registered guide (mandatory)", "Porter", "ACAP & TIMS permits", "Jomsom–Pokhara flight ticket", "First aid & emergency oxygen"],
    excludes: ["International flights", "Travel insurance (mandatory)", "Personal high-altitude gear", "Alcoholic beverages", "Nar Phu Valley restricted area permit (USD 90/week if added)", "Tips", "Emergency helicopter evacuation"],
    itinerary: [
      { day: 1, description: "Drive Pokhara to Dharapani (5–6 hrs). Check into teahouse, trail briefing. First views of Annapurna II.", walkingHours: "Drive day" },
      { day: 2, description: "Trek Dharapani to Chame (2,670m) along the Marsyangdi River through pine forest. Views of Annapurna II and Lamjung Himal.", walkingHours: "5–6 hrs" },
      { day: 3, description: "Chame to Pisang (3,300m). Trail narrows with dramatic gorge views. First Tibetan-influenced villages and prayer walls.", walkingHours: "5–6 hrs" },
      { day: 4, description: "Pisang to Manang (3,500m) via Upper Pisang ridge route for panoramic Annapurna III and Gangapurna views.", walkingHours: "5–6 hrs" },
      { day: 5, description: "Acclimatization day in Manang. Hike to Ice Lake (4,600m) for altitude prep and stunning views. Altitude medicine briefing.", walkingHours: "4–5 hrs (day hike)" },
      { day: 6, description: "Manang to Yak Kharka (4,018m). Landscape turns high alpine — sparse vegetation, yak herds, stone walls.", walkingHours: "3–4 hrs" },
      { day: 7, description: "Yak Kharka to Thorang Phedi (4,525m) — last teahouse before the pass. Early dinner and 3am wake-up call.", walkingHours: "3 hrs" },
      { day: 8, description: "Cross Thorong La Pass (5,416m) — pre-dawn 4–5 hr ascent. Ceremonial summit photo. Steep descent to Muktinath (3,800m). Sacred temple visit.", walkingHours: "7–8 hrs" },
      { day: 9, description: "Rest day at Muktinath. Explore the 108 water spout temple — sacred to both Hindus and Buddhists. Acclimatize and recover.", walkingHours: "Rest / exploration" },
      { day: 10, description: "Trek Muktinath to Kagbeni (2,810m) — a medieval Thakali village along the Kali Gandaki River, gateway to Upper Mustang.", walkingHours: "3–4 hrs" },
      { day: 11, description: "Trek Kagbeni to Jomsom (2,720m) through the world's deepest gorge (Kali Gandaki — between Dhaulagiri and Annapurna). Afternoon wind picks up.", walkingHours: "3 hrs" },
      { day: 12, description: "Optional: Trek Jomsom to Marpha (2,670m) — apple orchard village famous for brandy and stone-paved lanes. Overnight Jomsom.", walkingHours: "2 hrs (optional)" },
      { day: 13, description: "Morning flight Jomsom to Pokhara (25 min, weather permitting). Panoramic aerial views of Dhaulagiri and Annapurna range. Lakeside arrival.", walkingHours: "Flight day" },
      { day: 14, description: "Rest and recovery day in Pokhara. Optional: boat trip on Phewa Lake, World Peace Pagoda hike, spa and massage.", walkingHours: "Rest day" },
      { day: 15, description: "Departure day. Transfer to Pokhara airport or tourist bus to Kathmandu. Trek certificate issued.", walkingHours: "Departure" }
    ],
    permits: [
      { name: "ACAP (Annapurna Conservation Area Permit)", cost: "NPR 3,000 (~USD 25) — included" },
      { name: "TIMS Card", cost: "NPR 2,000 (~USD 15) — included" },
      { name: "Nar Phu Valley RAP (optional extension)", cost: "USD 90/week — not included" }
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200", isCover: true, order: 1 },
      { url: "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=1200", isCover: false, order: 2 },
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200", isCover: false, order: 3 }
    ],
    availableDates: ["2026-03-15","2026-04-01","2026-10-01","2026-10-20"],
    isActive: true, isPremiumOnly: false, isFeatured: true, showOnMap: true, status: "published"
  },
  {
    title: "Upper Mustang Trek — Forbidden Kingdom",
    tagline: "Ancient Tibetan kingdom, walled city of Lo Manthang, and desert Himalaya",
    location: "Pokhara, Nepal",
    description: "Upper Mustang is Nepal's most exclusive and otherworldly trekking destination — a restricted Tibetan Buddhist kingdom that was closed to the outside world until 1992 and still limits visitor numbers through a USD 500 restricted area permit. Often called the 'Last Forbidden Kingdom', Upper Mustang sits in the rain shadow of the Annapurna and Dhaulagiri ranges, creating a stark Martian landscape of eroded ochre cliffs, wind-carved canyons, ancient cave monasteries, and whitewashed chortens entirely unlike anything else in Nepal. The walled medieval city of Lo Manthang (3,840m) is the cultural centerpiece — a living museum of Tibetan Buddhist art, rare Thangka paintings, and centuries-old monasteries including Thubchen, Jampa, and Chhoede Gompas. Unlike most Nepal treks, Upper Mustang is best visited during the monsoon season (May–October) because its desert microclimate means virtually no rain, while the rest of Nepal is soaked. The USD 500 permit deliberately keeps trekker numbers low, preserving both the environment and the authentic cultural experience. A mandatory licensed guide is required for all visitors to the restricted zone.",
    difficulty: "Difficult", difficultyNote: "Remote terrain, basic lodge accommodation, long rough-road jeep sections, 3,840m max altitude — prior trekking experience strongly recommended",
    duration: 14, maxAltitude: "3,840m", season: "May–Oct (best during monsoon — rain shadow desert)",
    bestSeasonTip: "Jun–Aug for desert clarity while all of Nepal has monsoon — the only major trek better in monsoon than spring",
    trekType: "Teahouse", maxGroupSize: 10, availableSlots: 10,
    priceNPR: 390000, priceUSD: 3000, premiumPriceNPR: 325000, pricingType: "per_person",
    includes: ["All accommodation (basic lodges)", "All meals throughout", "Licensed government guide (mandatory for restricted zone)", "Porter", "Jomsom–Pokhara flight (both ways)", "Upper Mustang restricted area permit (USD 500)", "ACAP & TIMS permits"],
    excludes: ["International flights", "Travel insurance (mandatory)", "Personal trekking gear", "Alcoholic beverages", "Tips", "Emergency evacuation"],
    itinerary: [
      { day: 1, description: "Fly or drive Pokhara to Jomsom (2,720m). Acclimatize in this wind-battered Thakali trading town on the Kali Gandaki River.", walkingHours: "Flight/drive day" },
      { day: 2, description: "Trek Jomsom to Kagbeni (2,810m) — mandatory check post for restricted zone entry. Enter the kingdom. Medieval village with apple orchards and prayer walls.", walkingHours: "3 hrs" },
      { day: 3, description: "Trek Kagbeni to Chele (3,050m). First canyon landscapes. Enter the dramatic red-cliff gorges that define Upper Mustang's visual identity.", walkingHours: "6 hrs" },
      { day: 4, description: "Chele to Syangboche (3,800m) through high-altitude plateau with wind-sculpted earth pyramids and isolated chortens.", walkingHours: "6–7 hrs" },
      { day: 5, description: "Syangboche to Ghami (3,520m). Ancient Ghami wall — the longest mani wall in Nepal — and Ghami Monastery.", walkingHours: "5–6 hrs" },
      { day: 6, description: "Ghami to Lo Manthang (3,840m) — arrival at the walled capital of the Mustang Kingdom. Ceremonial entrance through the main city gate.", walkingHours: "5 hrs" },
      { day: 7, description: "Full day in Lo Manthang. Visit Thubchen, Jampa, and Chhoede Gompas. Meet local monks. Explore the palace of the Lo King.", walkingHours: "Exploration day" },
      { day: 8, description: "Day excursion to Luri Gompa — 14th-century cave monastery with rare murals. Overnight Lo Manthang.", walkingHours: "5–6 hrs round trip" },
      { day: 9, description: "Begin return — Lo Manthang to Drakmar (3,810m) via an alternative route through sky caves of Chhosar.", walkingHours: "5 hrs" },
      { day: 10, description: "Drakmar to Ghiling (3,570m) through fossil beds and ancient trade routes used for centuries by Tibetan salt traders.", walkingHours: "5 hrs" },
      { day: 11, description: "Ghiling to Muktinath (3,800m) via Nyphu Gompa. Muktinath temple visit — sacred to Hindus and Tibetan Buddhists.", walkingHours: "6 hrs" },
      { day: 12, description: "Rest day at Muktinath. Explore the 108-spout temple, Jwala Devi fire and water shrine, and the ancient Saligram fossil riverbed.", walkingHours: "Rest / exploration" },
      { day: 13, description: "Trek or jeep Muktinath to Jomsom. Final evening in Jomsom. Local Thakali dinner with apple brandy.", walkingHours: "3 hrs or jeep" },
      { day: 14, description: "Morning flight Jomsom to Pokhara. Certificate issued. Lakeside celebration dinner.", walkingHours: "Flight day" }
    ],
    permits: [
      { name: "Upper Mustang Restricted Area Permit (RAP)", cost: "USD 500 for 10 days — included in package price" },
      { name: "ACAP (Annapurna Conservation Area Permit)", cost: "NPR 3,000 (~USD 25) — included" },
      { name: "TIMS Card", cost: "NPR 2,000 (~USD 15) — included" }
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1596786232430-c8db14eefd9a?w=1200", isCover: true, order: 1 },
      { url: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=1200", isCover: false, order: 2 },
      { url: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200", isCover: false, order: 3 }
    ],
    availableDates: ["2026-05-20","2026-06-15","2026-09-01","2026-10-01"],
    isActive: true, isPremiumOnly: true, isFeatured: true, showOnMap: true, status: "published"
  },
  {
    title: "Dhaulagiri Circuit Trek",
    tagline: "Nepal's wildest high-altitude circuit — two passes above 5,000m, full camping",
    location: "Pokhara, Nepal",
    description: "The Dhaulagiri Circuit Trek is one of Nepal's most challenging and remote trekking routes — a complete circumnavigation of the Dhaulagiri massif (8,167m), the world's seventh highest mountain. Unlike most Nepal treks, Dhaulagiri has almost no teahouse infrastructure above base camp, requiring a fully equipped camping expedition with an experienced guide team, kitchen crew, and complete camping gear. The route passes through two high mountain passes — French Pass (5,360m) and Dhampus Pass (5,244m) — with the terrain between being raw, glaciated, and prone to avalanche. The Dhaulagiri Icefall approach offers some of the most surreal mountain photography in Asia: a vertical wall of ice and rock rising from the trail's edge. Despite the difficulty, the reward is absolute wilderness — fewer than 200 trekkers complete this circuit per year, making it one of the most exclusive mountain experiences on earth. Trekkers must be in excellent physical condition with prior high-altitude experience (ideally above 5,000m).",
    difficulty: "Expert", difficultyNote: "Expert only — two passes 5,000m+, full camping, avalanche risk zones, prior high-altitude experience at 5,000m+ mandatory",
    duration: 20, maxAltitude: "5,360m", season: "Apr–May, Sep–Oct only",
    bestSeasonTip: "Apr–May window is short but reliable; Sep–Oct post-monsoon offers stable weather — DO NOT attempt in winter or monsoon",
    trekType: "Camping", maxGroupSize: 8, availableSlots: 8,
    priceNPR: 520000, priceUSD: 4000, premiumPriceNPR: 440000, pricingType: "per_person",
    includes: ["Full camping equipment and tents", "All meals (camp kitchen crew)", "Experienced senior guide + assistant guide", "Full porter team", "Emergency oxygen (2 cylinders)", "Satellite phone", "ACAP & TIMS permits", "Pokhara hotel 1 night pre/post"],
    excludes: ["International flights", "Comprehensive travel and evacuation insurance (mandatory)", "Personal high-altitude gear (crampons, ice axe, down suit)", "Tips for all staff", "Emergency helicopter evacuation costs"],
    itinerary: [
      { day: 1, description: "Drive Pokhara to Beni (2 hrs). Trek begins up the Myagdi Khola river valley toward the Dhaulagiri range.", walkingHours: "3 hrs" },
      { day: 2, description: "Trek Beni to Darbang (1,140m) through dense subtropical forest and traditional Magar villages.", walkingHours: "6 hrs" },
      { day: 3, description: "Darbang to Muri (1,850m). Trail steepens. First views of Dhaulagiri range begin to appear above the valley walls.", walkingHours: "6 hrs" },
      { day: 4, description: "Muri to Sallaghari (2,400m). Camp in clearing. Night sky unobstructed — spectacular stargazing.", walkingHours: "6 hrs" },
      { day: 5, description: "Sallaghari to Italian Base Camp (3,660m). Named after an early Italian expedition. Dramatic waterfall and icefall views.", walkingHours: "7 hrs" },
      { day: 6, description: "Acclimatization day at Italian Base Camp. Rest, short hike to moraine ridge for icefall views. Altitude medicine checks.", walkingHours: "Rest day" },
      { day: 7, description: "Trek to Dhaulagiri Base Camp (4,750m). Surrounded by the icefall, seracs, and the North Face of Dhaulagiri. Camp on moraine.", walkingHours: "5 hrs" },
      { day: 8, description: "Rest and acclimatize at base camp. Explore glacier moraine. Briefing on French Pass crossing conditions.", walkingHours: "Short hike only" },
      { day: 9, description: "Cross French Pass (5,360m) — summit of the trek. Crampons may be required. Descend steeply into Hidden Valley. Camp on plateau.", walkingHours: "7–8 hrs" },
      { day: 10, description: "Rest in Hidden Valley (5,100m). Extraordinary isolation — no trails, no teahouses, just peaks in every direction.", walkingHours: "Rest day" },
      { day: 11, description: "Cross Dhampus Pass (5,244m). Technical descent on loose scree and snow slopes. Views of Annapurna I and Mustang Valley. Camp at Yak Kharka.", walkingHours: "7–8 hrs" },
      { day: 12, description: "Descend Yak Kharka toward Marpha (2,670m) through alpine meadow and juniper scrub. First teahouse in days.", walkingHours: "6 hrs" },
      { day: 13, description: "Rest day in Marpha. Apple orchards, stone lanes, and some of Nepal's best homemade apple brandy and jam. Gear check.", walkingHours: "Rest day" },
      { day: 14, description: "Trek Marpha to Jomsom (2,720m). Afternoon winds pick up on the Kali Gandaki. Comfortable teahouse accommodation.", walkingHours: "2 hrs" },
      { day: 15, description: "Morning flight Jomsom to Pokhara (weather permitting). Circuit completion celebration dinner. Certificate issued.", walkingHours: "Flight day" }
    ],
    permits: [
      { name: "ACAP (Annapurna Conservation Area Permit)", cost: "NPR 3,000 (~USD 25) — included" },
      { name: "TIMS Card", cost: "NPR 2,000 (~USD 15) — included" },
      { name: "Special Dhaulagiri Zone Permit", cost: "Arranged by agency — included" }
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200", isCover: true, order: 1 },
      { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200", isCover: false, order: 2 },
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200", isCover: false, order: 3 }
    ],
    availableDates: ["2026-04-10","2026-09-20"],
    isActive: true, isPremiumOnly: true, isFeatured: false, showOnMap: true, status: "published"
  },
  {
    title: "Khopra Danda Ridge Trek",
    tagline: "Hidden high ridge between Poon Hill and Annapurna — uncrowded perfection",
    location: "Pokhara, Nepal",
    description: "The Khopra Danda Trek is one of Nepal's best-kept secrets — a high ridge route connecting the Ghorepani area to the sacred Khayer Lake (4,500m) with views so comprehensive and trails so uncrowded that many experienced trekkers name it their favourite Nepal experience. Walking the long Khopra Ridge at 3,660m provides unbroken 180-degree panoramas of Dhaulagiri, all four Annapurna peaks, Machhapuchhre, Nilgiri, and dozens of minor summits stretching across the horizon — a view that beats even Poon Hill in scope and duration. The route passes through dense rhododendron and magnolia forest, traditional Magar villages where barely any tourists stop, and reaches the ridge community lodge at Khopra Danda with its extraordinary sunset views over the valleys. The optional Khayer Lake extension adds two more days and reaches a glacial lake at 4,500m considered sacred by local Hindus. This trek is ideal for trekkers who have already done Poon Hill and want something more wilderness-oriented without the crowds.",
    difficulty: "Moderate", difficultyNote: "5–7 hrs daily, ridge section reaches 3,660m, Khayer Lake optional extension to 4,500m requires good acclimatization",
    duration: 6, maxAltitude: "4,500m", season: "Mar–May, Oct–Nov",
    bestSeasonTip: "Apr for rhododendron blooms along the ridge, Nov for crystal-clear panoramas",
    trekType: "Teahouse", maxGroupSize: 14, availableSlots: 14,
    priceNPR: 48000, priceUSD: 365, premiumPriceNPR: 39000, pricingType: "per_person",
    includes: ["Teahouse and community lodge accommodation (5 nights)", "All meals", "Licensed guide", "Porter", "Transport Pokhara–Nayapul–Pokhara", "ACAP & TIMS permits"],
    excludes: ["Personal trekking gear", "Travel insurance", "Alcoholic beverages", "Hot showers (extra charge)", "Tips"],
    itinerary: [
      { day: 1, description: "Drive Pokhara to Nayapul. Trek to Ghorepani (2,874m) via Tikhedhunga and the rhododendron forest.", walkingHours: "6–7 hrs" },
      { day: 2, description: "Optional dawn Poon Hill hike, then leave the crowds behind — trek south to Bayali Camp (2,310m) through empty trail.", walkingHours: "5 hrs" },
      { day: 3, description: "Bayali Camp to Khopra Danda Ridge (3,660m). The ridge opens with a full Himalayan panorama — one of the widest views in Nepal.", walkingHours: "5–6 hrs" },
      { day: 4, description: "Full day at Khopra Danda. Optional extension to Khayer Lake (4,500m) — sacred glacial lake with Dhaulagiri reflection.", walkingHours: "6 hrs round trip to Khayer" },
      { day: 5, description: "Descend from Khopra Ridge to Swanta village (1,980m). Experience authentic village life with virtually no tourist infrastructure.", walkingHours: "6 hrs" },
      { day: 6, description: "Trek from Swanta to Siwai, then drive back to Pokhara. Afternoon free at Phewa Lake.", walkingHours: "3 hrs + drive" }
    ],
    permits: [
      { name: "ACAP (Annapurna Conservation Area Permit)", cost: "NPR 3,000 (~USD 23) — included" },
      { name: "TIMS Card", cost: "NPR 2,000 (~USD 15) — included" }
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=1200", isCover: true, order: 1 },
      { url: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=1200", isCover: false, order: 2 },
      { url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200", isCover: false, order: 3 }
    ],
    availableDates: ["2026-03-25","2026-04-18","2026-10-12","2026-11-08"],
    isActive: true, isPremiumOnly: false, isFeatured: false, showOnMap: true, status: "published"
  },
  {
    title: "Tilicho Lake Trek",
    tagline: "The world's highest lake at 4,919m — a turquoise jewel ringed by 7,000m peaks",
    location: "Pokhara, Nepal",
    description: "Tilicho Lake (4,919m) holds the record as one of the highest lakes of its size anywhere on earth, and the trek to reach it is among the most dramatic in the Annapurna region. Approached as a side trip from the Annapurna Circuit via Manang (3,500m), the route crosses a high-altitude traverse below the imposing face of Tilicho Peak (7,134m), climbs through boulder fields and glacial moraines, and emerges at the lake shore where the water is an impossibly vivid turquoise color reflecting the surrounding peaks. The day of the lake visit requires a very early 4am start from Tilicho Base Camp to reach the lake before afternoon clouds roll in. The high mountain silence, the altitude, and the scale of the surrounding peaks — Annapurna III, Grand Barrier, and Tilicho Peak — make this one of the most profound natural experiences available on any trekking route.",
    difficulty: "Difficult", difficultyNote: "Reaches 4,919m — serious altitude risk, landslide-prone traverse trail, cold temperatures year-round at the lake, prior acclimatization essential",
    duration: 12, maxAltitude: "4,919m", season: "Apr–May, Oct–Nov",
    bestSeasonTip: "Early Oct for stable weather and clearest lake reflection, May for spring conditions",
    trekType: "Teahouse", maxGroupSize: 10, availableSlots: 10,
    priceNPR: 98000, priceUSD: 750, premiumPriceNPR: 82000, pricingType: "per_person",
    includes: ["Teahouse accommodation (11 nights)", "All meals", "Licensed guide", "Porter", "ACAP & TIMS permits", "Transport to trailhead"],
    excludes: ["International flights", "Travel insurance (mandatory)", "Personal gear", "Alcoholic drinks", "Tips", "Emergency evacuation"],
    itinerary: [
      { day: 1, description: "Drive Pokhara to Besisahar, continue jeep to Dharapani (1,930m). First day of approach.", walkingHours: "Drive day" },
      { day: 2, description: "Trek Dharapani to Chame (2,670m) along the Marsyangdi River through pine and oak forest.", walkingHours: "5–6 hrs" },
      { day: 3, description: "Chame to Pisang (3,300m). Dramatic high-altitude landscape begins.", walkingHours: "5 hrs" },
      { day: 4, description: "Pisang to Manang (3,500m) via upper route over Ghyaru and Ngawal ridgeline. Incredible circuit panoramas.", walkingHours: "6 hrs" },
      { day: 5, description: "Acclimatization day at Manang. Hike to Gangapurna Lake and Ice Lake (4,600m) for altitude preparation.", walkingHours: "4–5 hrs day hike" },
      { day: 6, description: "Manang to Tilicho Base Camp (4,150m) via the landslide traverse — a narrow ledge path with sheer drops. Requires focus.", walkingHours: "5–6 hrs" },
      { day: 7, description: "Pre-dawn start (4am) to Tilicho Lake (4,919m). Sunrise on the turquoise lake with Tilicho Peak reflection. Return to Tilicho Base Camp.", walkingHours: "6–7 hrs" },
      { day: 8, description: "Rest and recovery at base camp or descend to Manang. Optional second visit to lake without packs.", walkingHours: "3–4 hrs" },
      { day: 9, description: "Trek Manang toward Thorong La preparation — ascend to Yak Kharka (4,018m).", walkingHours: "3–4 hrs" },
      { day: 10, description: "Yak Kharka to Thorong Phedi (4,525m). Pre-pass final preparation.", walkingHours: "3 hrs" },
      { day: 11, description: "Cross Thorong La Pass (5,416m) at dawn. Descend to Muktinath (3,800m). Temple visit and overnight.", walkingHours: "7–8 hrs" },
      { day: 12, description: "Drive or fly from Jomsom back to Pokhara. Trek completion certificate.", walkingHours: "Drive/flight day" }
    ],
    permits: [
      { name: "ACAP (Annapurna Conservation Area Permit)", cost: "NPR 3,000 (~USD 25) — included" },
      { name: "TIMS Card", cost: "NPR 2,000 (~USD 15) — included" }
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200", isCover: true, order: 1 },
      { url: "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=1200", isCover: false, order: 2 },
      { url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200", isCover: false, order: 3 }
    ],
    availableDates: ["2026-04-05","2026-05-02","2026-10-08","2026-11-01"],
    isActive: true, isPremiumOnly: false, isFeatured: false, showOnMap: true, status: "published"
  },
  {
    title: "Mohare Danda Sunrise Trek",
    tagline: "Community-owned ridgeline lodge with the widest Himalayan panorama in Nepal",
    location: "Pokhara, Nepal",
    description: "Mohare Danda (3,300m) is a community-owned conservation area and trekking destination developed by local Gurung and Magar communities to provide sustainable tourism revenue directly to villages. The ridgeline lodge at Mohare Danda is managed entirely by the local Sikha community and offers what many trekkers and photographers consider the single most comprehensive Himalayan panorama in Nepal — on a clear day, the 360-degree view encompasses Dhaulagiri I (8,167m) in the west, the entire Annapurna range in the north, Machhapuchhre and Mardi Himal to the east, and the green Pokhara valley far below. The trail passes through authentic Magar villages that receive almost no tourist foot traffic, with opportunities for genuine homestay experiences and local cultural immersion. The community lodge uses solar power, employs only local guides and staff, and donates a portion of every booking to village school and forest conservation programmes.",
    difficulty: "Moderate", difficultyNote: "5–6 hrs daily, reaches 3,300m, steep sections on Day 2 ascent, suitable for trekkers with basic fitness",
    duration: 4, maxAltitude: "3,300m", season: "Oct–May (closed Jun–Sep monsoon)",
    bestSeasonTip: "Nov–Dec for crisp winter panoramas, Mar–Apr for rhododendron forest in full bloom",
    trekType: "Teahouse", maxGroupSize: 12, availableSlots: 12,
    priceNPR: 32000, priceUSD: 245, premiumPriceNPR: 26000, pricingType: "per_person",
    includes: ["Community lodge and teahouse accommodation (3 nights)", "All meals (local Nepali cuisine)", "Licensed community guide", "Transport Pokhara–Nayapul", "Community conservation fee", "ACAP permit"],
    excludes: ["TIMS Card (NPR 2,000)", "Personal gear", "Travel insurance", "Tips", "Alcoholic beverages"],
    itinerary: [
      { day: 1, description: "Drive Pokhara to Nayapul, trek to Ghorepani (2,874m) via Ulleri and rhododendron forest. Traditional teahouse dinner.", walkingHours: "6–7 hrs" },
      { day: 2, description: "From Ghorepani, leave the Poon Hill crowds and trek south along the ridge to Mohare Danda (3,300m). Arrive for sunset panorama.", walkingHours: "5–6 hrs" },
      { day: 3, description: "Sunrise at Mohare Danda. Full day excursion to Narchyang village and surrounding ridge viewpoints. Community dinner with local family.", walkingHours: "4 hrs exploration" },
      { day: 4, description: "Descend via Sikha village to Beni. Drive Beni to Pokhara (2 hrs). Arrive by afternoon.", walkingHours: "5 hrs + 2 hr drive" }
    ],
    permits: [
      { name: "ACAP (Annapurna Conservation Area Permit)", cost: "NPR 3,000 (~USD 23) — included" },
      { name: "TIMS Card", cost: "NPR 2,000 (~USD 15) — not included" },
      { name: "Mohare Community Conservation Fee", cost: "NPR 500 — included" }
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=1200", isCover: true, order: 1 },
      { url: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=1200", isCover: false, order: 2 },
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200", isCover: false, order: 3 }
    ],
    availableDates: ["2026-03-05","2026-04-10","2026-10-20","2026-11-15"],
    isActive: true, isPremiumOnly: false, isFeatured: false, showOnMap: true, status: "published"
  },
  {
    title: "Pokhara Valley Hiking Day Tour",
    tagline: "World Peace Pagoda, Sarangkot sunrise and Begnas Lake — Pokhara in one day",
    location: "Pokhara, Nepal",
    description: "The Pokhara Valley Day Tour is the perfect introduction to the natural and cultural wonders surrounding Pokhara without any overnight commitment. The day begins before dawn with a drive to Sarangkot Hill (1,592m), where the sunrise behind the Annapurna and Manaslu ranges over Phewa Lake is one of the most photographed moments in all of Nepal. After breakfast at Sarangkot, the tour descends through Bindyabasini Temple — Pokhara's main Hindu shrine — before crossing Phewa Lake by traditional wooden rowboat to reach the gleaming white World Peace Pagoda (Shanti Stupa) perched on its ridge above the lake. The afternoon explores Begnas Lake, the quieter and more pristine of Pokhara's two main lakes, where local fishermen cast nets in the shadow of Annapurna II. The tour includes a guided walk through Pokhara's Old Bazaar, the Gurkha Museum, and the International Mountain Museum — making this the most comprehensive one-day cultural and natural experience available in the Pokhara valley.",
    difficulty: "Easy", difficultyNote: "Minimal walking — 2–3 hrs total on flat to gentle terrain, suitable for all fitness levels including elderly and children",
    duration: 1, maxAltitude: "1,592m", season: "Year-round",
    bestSeasonTip: "Oct–Nov for guaranteed mountain visibility at sunrise, avoid monsoon mornings (Jun–Sep) for clearer views",
    trekType: "Teahouse", maxGroupSize: 30, availableSlots: 30,
    priceNPR: 4500, priceUSD: 35, premiumPriceNPR: 3500, pricingType: "per_person",
    includes: ["Private vehicle (full day)", "English-speaking guide", "Boat ride on Phewa Lake", "Entrance fees (Pagoda, Museum)", "Breakfast at Sarangkot"],
    excludes: ["Lunch and dinner", "Personal shopping", "Tips", "Camera fees at some sites"],
    itinerary: [
      { day: 1, description: "5am pickup from hotel. Drive to Sarangkot for sunrise over Annapurna and Phewa Lake. Breakfast at viewpoint café. Visit Bindyabasini Temple, rowboat to World Peace Pagoda, Begnas Lake afternoon, Old Bazaar walk. Return by 5pm.", walkingHours: "2–3 hrs walking total" }
    ],
    permits: [
      { name: "World Peace Pagoda Entry", cost: "NPR 50 — included" },
      { name: "International Mountain Museum", cost: "NPR 300 — included" }
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200", isCover: true, order: 1 },
      { url: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200", isCover: false, order: 2 },
      { url: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=1200", isCover: false, order: 3 }
    ],
    availableDates: ["2026-01-10","2026-02-10","2026-03-10","2026-04-10","2026-05-10","2026-10-10","2026-11-10","2026-12-10"],
    isActive: true, isPremiumOnly: false, isFeatured: false, showOnMap: true, status: "published"
  },
  {
    title: "Nar Phu Valley Trek",
    tagline: "Remote Tibetan-Buddhist valley — ancient culture, wild passes, no crowds",
    location: "Pokhara, Nepal",
    description: "The Nar Phu Valley Trek ventures into one of Nepal's most isolated and culturally intact restricted areas — a pair of hidden Tibetan Buddhist villages tucked behind the Annapurna range that received no outside visitors for decades and still require a special restricted area permit. Nar (4,110m) and Phu (4,080m) are ancient settlements whose inhabitants maintain centuries-old traditions of Tibetan culture, language, and monastic Buddhism almost entirely unchanged by modernity. The approach follows the dramatic Nar Phu gorge, a narrow canyon with near-vertical walls soaring thousands of meters overhead, passable only on a single exposed ledge trail. The villages themselves, with their flat-roofed stone houses, spinning prayer wheels, and resident lamas, feel genuinely medieval. The optional extension over the challenging Kangla Pass (5,300m) connects back to the Annapurna Circuit at Manang. Trekkers must hire a licensed guide and pay the restricted area permit (USD 90 per week) — regulations that exist specifically to preserve the cultural and ecological integrity of the valley. Fewer than 500 people visit per year.",
    difficulty: "Difficult", difficultyNote: "Remote gorge with exposed trail sections, Kangla Pass extension reaches 5,300m — prior high-altitude trekking experience required",
    duration: 14, maxAltitude: "5,300m", season: "Mar–May, Oct–Nov",
    bestSeasonTip: "Oct–Nov for stable skies, Mar–May for spring wildflowers in the gorge",
    trekType: "Teahouse", maxGroupSize: 8, availableSlots: 8,
    priceNPR: 195000, priceUSD: 1500, premiumPriceNPR: 163000, pricingType: "per_person",
    includes: ["All accommodation (teahouse and guesthouse)", "All meals", "Licensed guide (mandatory for restricted zone)", "Porter", "Nar Phu restricted area permit", "ACAP & TIMS permits", "Transport to/from trailhead"],
    excludes: ["International flights", "Travel insurance (mandatory)", "Personal gear", "Alcoholic beverages", "Tips", "Emergency evacuation"],
    itinerary: [
      { day: 1, description: "Drive Pokhara to Koto (2,600m) via Besisahar — the entry point for the Nar Phu restricted zone. Permit check.", walkingHours: "Drive day" },
      { day: 2, description: "Enter the Nar Phu gorge. Trek Koto to Meta (3,560m) through the narrow canyon with sheer walls.", walkingHours: "6 hrs" },
      { day: 3, description: "Meta to Kyang (3,840m). Gorge opens slightly. Ancient chortens and mani walls appear.", walkingHours: "5 hrs" },
      { day: 4, description: "Kyang to Phu village (4,080m). Enter the hidden valley. Gompa visit and village exploration.", walkingHours: "5–6 hrs" },
      { day: 5, description: "Rest day at Phu. Explore the monastery, meet resident lamas, walk above the village to sky-burial site viewpoint.", walkingHours: "Rest / exploration" },
      { day: 6, description: "Trek Phu to Nar Phedi (4,020m), then ascend to Nar village (4,110m) — a different cultural micro-environment from Phu.", walkingHours: "5–6 hrs" },
      { day: 7, description: "Explore Nar village and Nar Gompa. Village festival preparation visible if timing is right.", walkingHours: "Exploration day" },
      { day: 8, description: "Begin crossing toward Kangla Pass — acclimatization camp at 4,600m.", walkingHours: "4–5 hrs" },
      { day: 9, description: "Cross Kangla Pass (5,300m). Technical high-altitude crossing. Descend toward Ngawal (3,657m) on the Annapurna Circuit.", walkingHours: "7–8 hrs" },
      { day: 10, description: "Ngawal to Manang (3,500m). Rejoin Annapurna Circuit teahouse infrastructure. Hot shower and proper meal.", walkingHours: "4 hrs" },
      { day: 11, description: "Acclimatize at Manang. Optional Ice Lake hike. Rest and gear check for Thorong La option or return.", walkingHours: "Optional day hike" },
      { day: 12, description: "Trek Manang toward return — Pisang to Chame descending the Marsyangdi.", walkingHours: "5–6 hrs" },
      { day: 13, description: "Chame to Besisahar by jeep. Overnight rest before Pokhara drive.", walkingHours: "Jeep day" },
      { day: 14, description: "Drive Besisahar to Pokhara. Trek certificate issued. End of expedition.", walkingHours: "Drive day" }
    ],
    permits: [
      { name: "Nar Phu Restricted Area Permit (RAP)", cost: "USD 90 per week — included" },
      { name: "ACAP (Annapurna Conservation Area Permit)", cost: "NPR 3,000 (~USD 25) — included" },
      { name: "TIMS Card", cost: "NPR 2,000 (~USD 15) — included" }
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1596786232430-c8db14eefd9a?w=1200", isCover: true, order: 1 },
      { url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200", isCover: false, order: 2 },
      { url: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200", isCover: false, order: 3 }
    ],
    availableDates: ["2026-03-28","2026-04-22","2026-10-18","2026-11-02"],
    isActive: true, isPremiumOnly: true, isFeatured: false, showOnMap: true, status: "published"
  },
  {
    title: "Annapurna Panorama Trek",
    tagline: "7-day teahouse loop taking in Ghandruk, Poon Hill and Annapurna views",
    location: "Pokhara, Nepal",
    description: "The Annapurna Panorama Trek is the ideal week-long introduction to the Annapurna region, combining the best cultural and scenic highlights of the Ghorepani–Poon Hill route with a full Gurung village immersion and natural hot spring reward — all in a comfortable teahouse circuit without the altitude demands of the longer treks. The route circles the lower Annapurna foothills, passing through Tikhedhunga, Ghorepani, Poon Hill, Tadapani, Ghandruk, and Jhinu Danda in a logical anti-clockwise loop that builds in elevation gradually and descends steadily. Unlike the straight Poon Hill trek, this Panorama circuit adds Tadapani's forest camp, the hidden Gurung village of Chomrong, and a final soak at Jhinu Danda's thermal springs. The trail presents a complete cross-section of Nepali mountain culture: Magar stone-stairway villages, Gurung slate-roofed towns, mixed Hindu-Buddhist shrines, and traditional farming life.",
    difficulty: "Moderate", difficultyNote: "5–7 hrs daily, max altitude 3,210m at Poon Hill, stone stairways, manageable for any fit adult",
    duration: 7, maxAltitude: "3,210m", season: "Year-round",
    bestSeasonTip: "Mar–Apr for blooming rhododendrons throughout the circuit, Oct–Nov for clearest mountain panoramas",
    trekType: "Teahouse", maxGroupSize: 18, availableSlots: 18,
    priceNPR: 58500, priceUSD: 450, premiumPriceNPR: 49000, pricingType: "per_person",
    includes: ["Teahouse accommodation (6 nights)", "All meals (3 per day)", "Licensed English-speaking guide", "Porter (1 per 2 trekkers)", "ACAP & TIMS permits", "Transport Pokhara–Nayapul–Pokhara", "First aid kit"],
    excludes: ["Travel insurance (mandatory)", "Personal trekking gear", "Alcoholic beverages", "Hot showers at teahouses", "Hot spring entry (NPR 200)", "Tips"],
    itinerary: [
      { day: 1, description: "Drive Pokhara to Nayapul (1.5 hrs). Trek via Birethanti to Tikhedhunga (1,577m). Evening at cosy teahouse.", walkingHours: "4–5 hrs" },
      { day: 2, description: "Tikhedhunga to Ghorepani (2,874m) through some of Nepal's densest rhododendron forest. Sunset views of Dhaulagiri.", walkingHours: "5–6 hrs" },
      { day: 3, description: "Dawn hike Poon Hill (3,210m) for the iconic Annapurna sunrise. Return to Ghorepani then trek to Tadapani (2,630m).", walkingHours: "7 hrs total" },
      { day: 4, description: "Tadapani to Ghandruk (2,010m) through forest. Explore Ghandruk village and Gurung Museum in the afternoon.", walkingHours: "4 hrs" },
      { day: 5, description: "Ghandruk to Chomrong (2,170m) — first views of Annapurna South and Machhapuchhre up close. Modi Khola gorge views.", walkingHours: "5 hrs" },
      { day: 6, description: "Chomrong to Jhinu Danda (1,780m). Descend to the famous thermal hot springs for a full afternoon soak. Well-earned relaxation.", walkingHours: "4 hrs" },
      { day: 7, description: "Jhinu Danda to Nayapul. Drive back to Pokhara. Arrive by lunchtime. Trek certificate issued.", walkingHours: "3 hrs + 2 hr drive" }
    ],
    permits: [
      { name: "ACAP (Annapurna Conservation Area Permit)", cost: "NPR 3,000 (~USD 23) — included" },
      { name: "TIMS Card", cost: "NPR 2,000 (~USD 15) — included" }
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=1200", isCover: true, order: 1 },
      { url: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=1200", isCover: false, order: 2 },
      { url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200", isCover: false, order: 3 },
      { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200", isCover: false, order: 4 }
    ],
    availableDates: ["2026-02-20","2026-03-22","2026-04-18","2026-10-08","2026-11-12"],
    isActive: true, isPremiumOnly: false, isFeatured: false, showOnMap: true, status: "published"
  },
  {
    title: "Royal Mustang & Muktinath Jeep Tour",
    tagline: "Mustang valley, Muktinath temple and Jomsom in a comfortable 4WD — no trekking required",
    location: "Pokhara, Nepal",
    description: "The Royal Mustang Jeep Tour offers the dramatic landscapes and sacred sites of the Mustang region without the physical demands of trekking — ideal for travellers with limited time or mobility, older visitors, or those wanting to combine sightseeing with a taste of the Annapurna region. The tour drives the epic Kali Gandaki highway from Pokhara through Beni, Tatopani, and the deepest river gorge on earth — flanked by Annapurna and Dhaulagiri — to reach Jomsom (2,720m), the wind-swept capital of Mustang district. From Jomsom, the 4WD continues north to Muktinath temple (3,800m), one of the most sacred pilgrimage sites in Hinduism and Tibetan Buddhism. The return route passes the famous Marpha village (apple orchards), the fossilized Ammonite (Saligram) riverbed of Kagbeni, and the scenic Tatopani hot springs — all in the comfort of a private 4WD Jeep.",
    difficulty: "Easy", difficultyNote: "Jeep tour — minimal walking at each stop (0.5–1 hr), high-altitude driving reaches 3,800m, suitable for all ages",
    duration: 4, maxAltitude: "3,800m", season: "Year-round (road may close in heavy monsoon)",
    bestSeasonTip: "Oct–Nov for mountain clarity, Jun–Sep for green valleys (road permitting)",
    trekType: "Teahouse", maxGroupSize: 6, availableSlots: 6,
    priceNPR: 35000, priceUSD: 270, premiumPriceNPR: 28000, pricingType: "per_person",
    includes: ["Private 4WD jeep (full tour)", "Licensed driver and guide", "All accommodation (2 nights Jomsom)", "All meals (3 per day)", "Muktinath temple entry", "Tatopani hot spring entry"],
    excludes: ["Travel insurance", "Personal purchases", "Alcoholic beverages", "Tips", "Lower Mustang permit if going north of Kagbeni"],
    itinerary: [
      { day: 1, description: "Drive Pokhara to Tatopani (1,189m) via Beni through the Kali Gandaki gorge. Stop at natural hot springs. Overnight Tatopani.", walkingHours: "Drive — 5 hrs, 1 hr hot spring walk" },
      { day: 2, description: "Drive Tatopani to Jomsom (2,720m) through the world's deepest gorge. Stop at Marpha apple village for brandy tasting. Check in Jomsom.", walkingHours: "Drive — 3 hrs, 1 hr village walks" },
      { day: 3, description: "Drive Jomsom to Muktinath (3,800m). Visit the 108-spout Hindu-Buddhist temple, Jwala Devi flame shrine. Drive to Kagbeni for Saligram fossil hunt. Return to Jomsom.", walkingHours: "Drive — 2 hrs, 1.5 hrs walking at sites" },
      { day: 4, description: "Morning in Jomsom. Drive back to Pokhara via Beni and Kusma gorge bridge. Arrive by evening.", walkingHours: "Drive — 7 hrs with stops" }
    ],
    permits: [
      { name: "Annapurna Conservation Area Permit (ACAP)", cost: "NPR 3,000 — included" },
      { name: "Muktinath Temple Entry", cost: "NPR 100 — included" }
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1596786232430-c8db14eefd9a?w=1200", isCover: true, order: 1 },
      { url: "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=1200", isCover: false, order: 2 },
      { url: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=1200", isCover: false, order: 3 }
    ],
    availableDates: ["2026-01-25","2026-03-15","2026-05-05","2026-10-01","2026-11-20"],
    isActive: true, isPremiumOnly: false, isFeatured: false, showOnMap: true, status: "published"
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Map priceNPR → price, premiumPriceNPR → premiumPrice, derive coverImage
  const docs = raw.map(p => ({
    ...p,
    price: p.priceNPR,
    premiumPrice: p.premiumPriceNPR || 0,
    coverImage: p.images.find(i => i.isCover)?.url || p.images[0]?.url || '',
    priceNPR: undefined,
    premiumPriceNPR: undefined,
  }));

  const result = await Package.insertMany(docs);
  console.log(`✅ Inserted ${result.length} packages successfully`);
  result.forEach(p => console.log(`   • ${p.title} (${p.difficulty}, ${p.duration}d, Rs. ${p.price.toLocaleString()})`));
  await mongoose.disconnect();
}

seed().catch(err => { console.error('❌ Seed failed:', err.message); process.exit(1); });
