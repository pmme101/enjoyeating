"use client";

import { useState, useEffect } from "react";

// ============================================
// BRAND SYSTEM — following EnjoyEating guideline
// ============================================
const BRAND = {
  // Page surfaces — warm cream family (avoid stark white)
  pageBg: "#F7EDDF",         // warmer cream page background (pulls from hero bottom-left)
  cardBg: "#FFFBF5",         // warm ivory cards (not stark white)
  cardBgAlt: "#F5F1EA",      // neutral soft cream for nested surfaces (not yellow)
  cardBorder: "rgba(31, 28, 23, 0.07)",
  divider: "rgba(31, 28, 23, 0.06)",

  // Text
  ink: "#1F1C17",
  inkSecondary: "#8A7D68",
  inkTertiary: "#BFB5A3",
  inkTagline: "#5A4E3E",

  // Semantic — keep locked guideline colors
  passText: "#4A7C3A", passBg: "#DFE8D0", passFill: "#8FAF7A",
  shortText: "#C04F3A", shortBg: "#F8DCC8",
  overText: "#C58B3A", overBg: "#F2DDB8",
  loggedText: "#A85A38", loggedBg: "#F8DCC8",
  todayBorder: "#E89074",

  // Calendar-specific — more distinction between states
  calEmpty: "#F0E4D0",       // visible warm cream, not washed out
  calLogged: "#F5C9A8",      // deeper peach for strong logged contrast
  calLoggedText: "#8A4028",  // deeper brown for readable date

  // Fonts
  fontHero: "'Pinyon Script', 'Allura', 'Great Vibes', cursive",
  fontTagline: "'Fraunces', Georgia, serif",
  fontBody: "'Inter', -apple-system, 'SF Pro', 'PingFang SC', 'Noto Sans SC', sans-serif",
};

const GOOGLE_FONTS_LINK = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,14..144,400..700;1,14..144,400..700&family=Inter:wght@400;500;600;700&family=Pinyon+Script&family=Noto+Sans+SC:wght@400;500;600;700&display=swap";

const CAT1 = new Set(["protein", "iron", "vitC", "calcium", "fiber", "omega3"]);
const SAFE_UPPER = { protein: 110, iron: 45, vitC: 2000, calcium: 2000, fiber: 50, omega3: 3000 };

const INITIAL_DATA = [
  {
    date: "2026-04-05", label: "典型日 Typical Day",
    breakfast: "五丁包 Five-ingredient bun + 豆浆 Soy milk + 黑咖啡 Black coffee + 茶 Tea",
    lunch: "Feral Bánh mì 牛肉 Lemongrass beef (黄面包 yellow bread)",
    dinner: "蔬菜汤 Veggie soup (鸡棒腿去半皮 drumstick + 牛肉片 beef + 白菜 cabbage + 青菜 bok choy + 金针菇 enoki + 毛豆 edamame) + 饺子 dumplings ×3-4",
    snacks: "零糖酸奶 Yogurt + Manuka蜂蜜 honey · Heong Peah ×1 · 香蕉蛋糕 Banana cake ×1",
    supplements: "Redoxon (VitC 1000mg+D+Zinc) · BioLife Multi-Vit (Fe 5mg) · 蓝莓护眼 Bilberry ×2",
    calories: 1570, protein: 64, fat: 59, carbs: 185, iron: 12.2, calcium: 250, fiber: 15, vitC: 1000, sugar: 35, omega3: 100,
    exercise: "", burn: 0,
    notes: "基线日 Baseline — 蛋白质刚达标 protein just on target, 铁仍不足 iron still short"
  },
  {
    date: "2026-04-06", label: "高蛋白日 High Protein Day",
    breakfast: "白煮蛋 Eggs ×2 + 五丁包 Bun + 豆浆 Soy milk + 黑醋 Balsamic",
    lunch: "希腊鸡肉卷 Greek chicken wrap + 希腊色拉 Greek salad (feta+橄榄 olives+醋汁 dressing)",
    dinner: "蔬菜汤 Soup + 鸡棒腿 Drumstick (无饺子 no dumplings)",
    snacks: "樱桃 Cherries 150g · 青提 Grapes 100g ·酸奶 Yogurt + 蜂蜜 honey",
    supplements: "Redoxon 半片 (VitC 500mg)",
    calories: 1577, protein: 91, fat: 56, carbs: 175, iron: 7.5, calcium: 220, fiber: 8, vitC: 500, sugar: 28, omega3: 50,
    exercise: "", burn: 0,
    notes: "蛋白质最高纪录 Protein record! 鸡肉卷 Chicken wrap 33g + 鸡蛋 eggs 12g"
  },
  {
    date: "2026-04-07", label: "补偿日 Undereating Day",
    breakfast: "面包 Bread ×2 + 黄油 Butter + Kaya 咖椰 + 白煮蛋 Eggs ×2",
    lunch: "— (跳过 skipped)",
    dinner: "酸奶 Yogurt + 蜂蜜 · 虾饺 Shrimp dumplings ×3-4 · 青菜 Greens 100g · 粉丝 Glass noodles",
    snacks: "樱桃 Cherries 200g · 睡前牛奶 Bedtime milk 250ml",
    supplements: "— (未服用 none)",
    calories: 1110, protein: 40, fat: 40, carbs: 152, iron: 3.5, calcium: 450, fiber: 6, vitC: 0, sugar: 40, omega3: 0,
    exercise: "", burn: 0,
    notes: "⚠️ 热量不足 Too low — 补偿行为 compensatory behavior"
  },
  {
    date: "2026-04-12", label: "姐姐生日 Sister's Birthday",
    breakfast: "半个星巴克牛肉卷 Half Starbucks wrap + 豆浆 Soy milk + 牛奶 Milk 250ml + 蛋 Eggs ×2 + 提拉米苏 Tiramisu (低糖 low sugar ~10g)",
    lunch: "— (合并 merged with brunch)",
    dinner: "半碗黄鱼面 Yellow croaker noodles (黄鱼 100g+蟹黄 roe 25g+蟹肉 crab 20g+面 50g) + 黄鱼饺子 dumpling ×1 + 白灼生菜 Lettuce 100g",
    snacks: "— (无 none)",
    supplements: "Floradix 20ml (Fe 15mg) · Redoxon (VitC 500mg) · BioLife (Fe 5mg) · 鱼油 Fish oil ×2",
    calories: 1490, protein: 76, fat: 52, carbs: 160, iron: 26.5, calcium: 200, fiber: 5, vitC: 500, sugar: 22, omega3: 500,
    exercise: "", burn: 0,
    notes: "✅ 铁首次达标 Iron above target! Floradix 15mg + BioLife 5mg + food 6.5mg"
  },
  {
    date: "2026-04-13", label: "提拉米苏+拉面日 Tiramisu & Ramen Day",
    breakfast: "Kaya咖椰葡萄干吐司 Raisin toast ×2 + 黄油 Butter ~8g + Kaya ~10g + 芝麻菜沙拉 Rocket salad (帕玛火腿 Parma ham ~45g + 白煮蛋 Egg ×1 + 片装奶酪 Sliced cheese ~10g + 涂抹奶酪 Cream cheese ~8g + 黑醋 Balsamic)",
    lunch: "— (与早餐合并 brunch only, no lunch)",
    dinner: "半份一兰拉面拌粉 Half Ichiran ramen + 白灼生菜 Blanched lettuce 100g + 虾丸 Shrimp balls ×2 + 鱼饺子 Fish dumplings ×2 + 香菇 Shiitake ×2-3 + 包菜 Cabbage 80g",
    snacks: "自制提拉米苏 Homemade tiramisu ~100g",
    supplements: "Redoxon 半片 (VitC 500mg+D+Zinc) · BioLife 鱼油 Fish oil ×2 (Ω-3 ~500mg) · Biotin 生物素",
    calories: 1120, protein: 45, fat: 40, carbs: 140, iron: 5.5, calcium: 200, fiber: 6, vitC: 500, sugar: 18, omega3: 500,
    exercise: "", burn: 0,
    notes: "热量偏低 Calories still low (~1120). 蛋白质 45g 比平时好 better than usual but still short of 60g target. 早餐的芝麻菜沙拉配蛋和cheese很好 Brunch salad was a good protein choice. 下次晚餐加个蛋 Add an egg to dinner next time."
  },
  {
    date: "2026-04-14", label: "Otoro日 Otoro Day ★",
    breakfast: "— (跳过 skipped)",
    lunch: "大脂金枪鱼握寿司 Otoro nigiri ×5 + 清酒 Sake 60ml + 五丁包 Five-ingredient bun ×1 + 豆浆 Soy milk",
    dinner: "牛奶 Milk 250ml + 虾肉饺子 Shrimp dumplings ×2 + 鱼肉饺子 Fish dumpling ×1 + 虾丸 Shrimp balls ×2 + 鸡腿 Chicken leg ×1 + 包菜 Cabbage 100g + 平菇 Oyster mushroom 20g",
    snacks: "香蕉蛋糕 Banana cake ×1 + 薄饼干 Thin crackers 15g + 提拉米苏 Tiramisu ~50g (焦虑进食 anxiety eating)",
    supplements: "Redoxon (VitC 1000mg+D+Zinc) · Biotin 生物素 · BioLife Multi-Vit · Floradix 25ml (Fe ~18mg)",
    calories: 1770, protein: 87, fat: 55, carbs: 185, iron: 24.5, calcium: 380, fiber: 8, vitC: 1000, sugar: 35, omega3: 450,
    exercise: "休息 Rest day", burn: 0,
    notes: "🏆 本周最佳日 Best day this week! 蛋白质87g远超目标 Protein 87g far exceeds 60g target. 热量首次充分超过基础代谢 Calories finally well above BMR. Otoro提供优质Ω-3 Otoro = quality Omega-3. 鸡腿+虾饺+鱼饺晚餐蛋白质丰富 Dinner protein-rich. 休息日无运动 Rest day, no exercise. Floradix铁剂注意与清酒隔开 Space Floradix away from sake."
  },
  {
    date: "2026-04-15", label: "寿司日 Sushi Day ✓",
    breakfast: "五丁包 Five-ingredient bun ×1",
    lunch: "金枪鱼泥卷 Negitoro maki ×4 + Engawa 比目鱼鳍边握寿司 flounder fin nigiri ×5",
    dinner: "蔬菜汤 Vegetable soup (煮熟米粉 cooked rice noodles 100g + 蘑菇 mushrooms 30g + 胡萝卜 carrots 30g + 小虾饺 small shrimp dumplings ×4-5 + 小干贝 dried scallops ×6-7) + 牛奶 Milk 250ml",
    snacks: "丹麦酥 Danish pastry 40g + 奶油 cream (烤过 oven-heated)",
    supplements: "Floradix 25ml (Fe ~18mg) · Redoxon (VitC 1000mg+D+Zinc) · BioLife Multi-Vit (Fe 5mg) · 钙片 Calcium tablet",
    calories: 1470, protein: 60, fat: 48, carbs: 175, iron: 26, calcium: 850, fiber: 7, vitC: 1000, sugar: 25, omega3: 1000,
    exercise: "Jazz 爵士舞 1hr (HR mix Zone 1-3, peaks 130-150)", burn: 250,
    notes: "✓ 目标达成 On target! 热量1470 calories in range, 蛋白质60g protein just hits target. 铁充足 iron excellent (26mg). 钙达标 calcium on target. Omega-3 ~1000mg from tuna+engawa sushi. Jazz课强度分布 Zone 1-3, 峰值130-150 BPM, 实际消耗约250kcal (based on mixed-zone heart rate). 净热量 Net 1220kcal 略低于BMR slightly below BMR. 手表因戴了两个手环偶尔没记录上, 心率数据不完整 Watch data incomplete due to wearing two bracelets."
  },
  {
    date: "2026-04-16", label: "基本功日 Foundation Day 🏆",
    breakfast: "黑葡萄 Black grapes 100g + 豆浆 Soy milk 1杯",
    lunch: "Swift 芝士牛肉卷 Cheesy Beef Wrap 整个 whole (280g)",
    dinner: "一兰拉面版蔬菜汤 Ichiran-style veggie soup (半份拉面 half ramen + 鸡腿半去皮 chicken leg half-skinned + 胡萝卜 carrot 50g + 虾丸 shrimp balls ×2 + 菇 mushrooms 30g + 饺子 dumplings ×2-3) 汤没喝 broth not consumed",
    snacks: "有机牛奶 Organic milk 250ml (4.4g pro/100ml) + 黑葡萄 Black grapes 100g + 香蕉蛋糕 Banana cake ×1",
    supplements: "Redoxon (VitC 1000mg) · Floradix 10ml (Fe ~6mg, 已减量 reduced dose) · BioLife Multi-Vit (Fe 5mg) · 钙片 Calcium tablet",
    calories: 1680, protein: 97, fat: 51, carbs: 176, iron: 15, calcium: 620, fiber: 7, vitC: 1000, sugar: 43, omega3: 50,
    exercise: "基本功课 Foundation class 1hr (Apple Watch: 295kcal, avg HR 116, peak 151, Zone 1-3 Moderate)", burn: 295,
    notes: "🏆 蛋白质新高 Protein record (97g)! 牛肉卷42g+鸡腿17g+牛奶11g+虾丸饺子9g+其他. 热量1680含香蕉蛋糕 calories include banana cake. 净热量1385略高于BMR net above BMR. 糖偏高43g(目标<30) sugar over target due to cake+grapes. Floradix已减至10ml good. 提醒: Floradix要跟牛奶和钙片隔开2小时 space from milk/calcium 2hrs. 汤没喝减少钠 skipping broth reduced sodium."
  },
];

const TARGET = {
  calories: [1400, 1550], protein: 60, fat: [45, 55], carbs: [150, 180],
  iron: 18, calcium: 800, fiber: 20, vitC: 500, sugar: [0, 30], omega3: 500
};

function getStatus(val: number, key: string) {
  const target = (TARGET as any)[key];
  const isCat1 = CAT1.has(key as any);
  if (key === "sugar") {
    if (val <= target[1]) return "ok";
    if (val <= target[1] * 1.3) return "high";
    return "excess";
  }
  if (Array.isArray(target)) {
    if (val < target[0] * 0.85) return "low";
    if (val > target[1] * 1.15) return "excess";
    if (val < target[0]) return "warn-low";
    if (val > target[1]) return "high";
    return "ok";
  }
  if (isCat1) {
    const upper = (SAFE_UPPER as any)[key];
    if (val < target * 0.7) return "low";
    if (val < target) return "warn-low";
    if (upper && val >= upper * 0.8) return "near-limit";
    if (val >= target * 1.15) return "excellent";
    return "ok";
  }
  if (val < target * 0.7) return "low";
  if (val < target) return "warn-low";
  if (val > target * 1.15) return "excess";
  if (val > target) return "high";
  return "ok";
}

function isDayPass(d: any) {
  if (d.label.includes("进行中") || d.label.includes("In Progress")) return false;
  const c = getStatus(d.calories, "calories"), p = getStatus(d.protein, "protein"), i = getStatus(d.iron, "iron");
  return (c === "ok" || c === "high") && (p === "ok" || p === "excellent" || p === "near-limit") && (i === "ok" || i === "excellent" || i === "near-limit" || i === "warn-low");
}

const SC = {
  "low":        { color: BRAND.shortText, bg: BRAND.shortBg, label: "不足 Short", icon: "✗" },
  "warn-low":   { color: BRAND.overText, bg: BRAND.overBg, label: "偏低 Low", icon: "⚠" },
  "ok":         { color: BRAND.passText, bg: BRAND.passBg, label: "达标 On Target", icon: "✓" },
  "excellent":  { color: BRAND.passText, bg: BRAND.passBg, label: "优秀 Excellent", icon: "★" },
  "near-limit": { color: BRAND.overText, bg: BRAND.overBg, label: "接近上限 Near Limit", icon: "⚠" },
  "high":       { color: BRAND.overText, bg: BRAND.overBg, label: "偏高 High", icon: "↑" },
  "excess":     { color: BRAND.shortText, bg: BRAND.shortBg, label: "过量 Excess", icon: "↑↑" },
};

function Hero({ avgKcal, avgProtein, passCount, totalCount }: { avgKcal: any; avgProtein: any; passCount: any; totalCount: any }) {
  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      margin: "18px 18px 0",
      borderRadius: 20,
      background: `
        radial-gradient(at 20% 30%, #FFD4A8 0%, transparent 50%),
        radial-gradient(at 80% 20%, #A8D4C4 0%, transparent 55%),
        radial-gradient(at 70% 80%, #F4A896 0%, transparent 50%),
        radial-gradient(at 30% 90%, #E8D4F0 0%, transparent 45%),
        linear-gradient(135deg, #FFF8F0 0%, #F0F8F4 100%)
      `,
    }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35, mixBlendMode: "multiply", pointerEvents: "none" }}>
        <filter id="enjoyEatingGrain">
          <feTurbulence baseFrequency="0.85" numOctaves="3" seed="5" />
          <feColorMatrix values="0 0 0 0 0.3, 0 0 0 0 0.25, 0 0 0 0 0.2, 0 0 0 0.35 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#enjoyEatingGrain)" />
      </svg>

      <div style={{ position: "relative", zIndex: 2, padding: "22px 24px 26px", color: BRAND.ink }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10.5, fontFamily: BRAND.fontBody }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", padding: "4px 10px", borderRadius: 20, color: BRAND.ink, fontWeight: 500 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: BRAND.passText }}></div>
            <span>Active</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", padding: "4px 10px", borderRadius: 20, color: "#5A5040", fontSize: 10, fontWeight: 500 }}>
            V 1.0
          </div>
        </div>

        <div style={{ marginTop: 44 }}>
          <h1 style={{
            fontFamily: BRAND.fontHero,
            fontSize: 58,
            fontWeight: 400,
            lineHeight: 0.78,
            color: BRAND.ink,
            margin: 0,
            letterSpacing: 0,
          }}>
            Enjoy Eating
          </h1>
          <p style={{
            fontFamily: BRAND.fontTagline,
            fontSize: 14,
            fontStyle: "italic",
            color: BRAND.inkTagline,
            marginTop: 18,
            marginBottom: 0,
            fontWeight: 400,
          }}>
            Fuel your everyday better
          </p>
        </div>
      </div>
    </div>
  );
}

function MonthlyView({ data, onDayClick, currentMonth, onMonthChange }: { data: any[]; onDayClick: (s: string) => void; currentMonth: Date; onMonthChange: (d: Date) => void }) {
  // Helper: format local date as YYYY-MM-DD (avoid toISOString UTC shift)
  const toLocalDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toLocalDateStr(today);

  // Build month matrix
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay(); // 0 = Sun
  const daysInMonth = lastDay.getDate();

  // Data lookup
  const dataByDate: { [k: string]: any } = {};
  data.forEach(d => { dataByDate[d.date] = d; });

  // Build 6-week grid (42 cells)
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateStr = toLocalDateStr(date);
    cells.push({ day: d, dateStr, data: dataByDate[dateStr] });
  }
  while (cells.length < 42) cells.push(null);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthCN = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  const getCellStyle = (cell: any) => {
    if (!cell) return { background: "transparent", color: "transparent", border: "none" };
    const isToday = cell.dateStr === todayStr;
    const isFuture = cell.dateStr > todayStr;

    // Future dates are always empty, regardless of data
    if (isFuture) {
      return {
        background: BRAND.calEmpty,
        color: BRAND.inkTertiary,
        fontWeight: 500,
        border: "none",
      };
    }

    if (cell.data) {
      const pass = isDayPass(cell.data);
      if (pass) {
        // Pass day — sage fill, white bold date (LOCKED)
        return {
          background: BRAND.passFill,
          color: "#FFFFFF",
          fontWeight: 700,
          border: isToday ? `1.5px solid ${BRAND.todayBorder}` : "none",
        };
      }
      // Logged day — stronger peach fill, deeper brown date
      return {
        background: BRAND.calLogged,
        color: BRAND.calLoggedText,
        fontWeight: 700,
        border: isToday ? `1.5px solid ${BRAND.todayBorder}` : "none",
      };
    }
    // Empty day — warm cream, visible but calm
    return {
      background: BRAND.calEmpty,
      color: BRAND.inkTertiary,
      fontWeight: 500,
      border: isToday ? `1.5px solid ${BRAND.todayBorder}` : "none",
    };
  };

  // Month navigation
  const prevMonth = () => {
    const d = new Date(year, month - 1, 1);
    onMonthChange(d);
  };
  const nextMonth = () => {
    const d = new Date(year, month + 1, 1);
    onMonthChange(d);
  };

  // Count logged days this month (excludes future)
  const loggedThisMonth = cells.filter(c => c && c.data && c.dateStr <= todayStr).length;
  const passThisMonth = cells.filter(c => c && c.data && c.dateStr <= todayStr && isDayPass(c.data)).length;

  return (
    <div style={{
      background: BRAND.cardBg,
      border: `0.5px solid ${BRAND.cardBorder}`,
      borderRadius: 14,
      padding: "18px 16px 16px",
      marginBottom: 24,
    }}>
      {/* Header with month navigation */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}>
        <button
          onClick={prevMonth}
          style={{
            background: "transparent",
            border: "none",
            fontSize: 18,
            color: BRAND.inkSecondary,
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: 8,
          }}
        >
          ‹
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            color: BRAND.ink,
            letterSpacing: -0.2,
          }}>
            {monthNames[month]} {year}
          </div>
          <div style={{
            fontSize: 11,
            color: BRAND.inkSecondary,
            marginTop: 2,
          }}>
            {monthCN[month]} · {loggedThisMonth} logged · {passThisMonth} passed
          </div>
        </div>
        <button
          onClick={nextMonth}
          style={{
            background: "transparent",
            border: "none",
            fontSize: 18,
            color: BRAND.inkSecondary,
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: 8,
          }}
        >
          ›
        </button>
      </div>

      {/* Weekday headers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 5,
        marginBottom: 6,
      }}>
        {weekdays.map((w, i) => (
          <div key={i} style={{
            textAlign: "center",
            fontSize: 10,
            fontWeight: 600,
            color: BRAND.inkTertiary,
            letterSpacing: "0.05em",
            padding: "4px 0",
          }}>
            {w}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 5,
      }}>
        {cells.map((cell, i) => {
          const style = getCellStyle(cell);
          const isFuture = cell && cell.dateStr > todayStr;
          const clickable = cell && cell.data && !isFuture;
          return (
            <div
              key={i}
              onClick={() => clickable && onDayClick(cell.dateStr)}
              style={{
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                borderRadius: 8,
                cursor: clickable ? "pointer" : "default",
                transition: "transform 0.15s ease",
                ...style,
              }}
            >
              {cell ? cell.day : ""}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 12,
        marginTop: 14,
        paddingTop: 12,
        borderTop: `0.5px solid ${BRAND.divider}`,
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: BRAND.inkSecondary }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: BRAND.passFill }} />
          <span>Passed</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: BRAND.inkSecondary }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: BRAND.calLogged }} />
          <span>Logged</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: BRAND.inkSecondary }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: BRAND.calEmpty }} />
          <span>No log</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: BRAND.inkSecondary }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: BRAND.calEmpty, border: `1.5px solid ${BRAND.todayBorder}` }} />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, unit, targetKey }: { label: string; value: number; unit: string; targetKey: string }) {
  const status = getStatus(value, targetKey);
  const cfg = (SC as any)[status];
  const target = (TARGET as any)[targetKey];
  const tl = Array.isArray(target) ? `${target[0]}-${target[1]}` : `${target}+`;

  const numericDiff = Array.isArray(target)
    ? value < target[0]
      ? value - target[0]
      : value > target[1]
        ? value - target[1]
        : 0
    : value - target;
  const dn = Number.isInteger(numericDiff) ? numericDiff : +numericDiff.toFixed(1);

  // Determine display state
  const isPass = dn === 0 || (Array.isArray(target) ? (value >= target[0] && value <= target[1]) : value >= target);
  const isShort = dn < 0;
  const isOver = !isPass && !isShort;

  const displayColor = isPass ? BRAND.passText : isShort ? BRAND.shortText : BRAND.overText;
  const displayBg = isPass ? BRAND.passBg : isShort ? BRAND.shortBg : BRAND.overBg;
  const displayText = isPass ? "On target · 达标" : isShort ? `Short ${dn}` : `Over +${Math.abs(dn)}`;

  return (
    <div style={{
      background: BRAND.cardBg,
      border: `0.5px solid ${BRAND.cardBorder}`,
      borderRadius: 14,
      padding: "14px 14px 12px",
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 500,
        color: BRAND.inkSecondary,
        letterSpacing: "0.02em",
        marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        display: "flex",
        alignItems: "baseline",
        gap: 3,
        marginBottom: 4,
      }}>
        <span style={{
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: -0.5,
          color: displayColor,
        }}>
          {Number.isInteger(value) ? value : value.toFixed(1)}
        </span>
        <span style={{ fontSize: 11, color: BRAND.inkSecondary }}>{unit}</span>
      </div>
      <div style={{
        fontSize: 10,
        color: BRAND.inkTertiary,
        marginBottom: 8,
      }}>
        target {tl}{unit}
      </div>
      <div style={{
        display: "inline-block",
        fontSize: 10,
        fontWeight: 600,
        color: displayColor,
        background: displayBg,
        padding: "3px 8px",
        borderRadius: 4,
      }}>
        {displayText}
      </div>
    </div>
  );
}

function NutrientBar({ label, value, unit, targetKey }: { label: string; value: number; unit: string; targetKey: string }) {
  const target = (TARGET as any)[targetKey];
  const isRange = Array.isArray(target);
  const tMax = isRange ? target[1] : target;
  const status = getStatus(value, targetKey);
  const numericDiff = isRange
    ? value < target[0]
      ? value - target[0]
      : value > target[1]
        ? value - target[1]
        : 0
    : value - target;
  const dn = Number.isInteger(numericDiff) ? numericDiff : +numericDiff.toFixed(1);

  const isPass = dn === 0 || (isRange ? (value >= target[0] && value <= target[1]) : value >= target);
  const isShort = dn < 0;
  const isOver = !isPass && !isShort;

  // Fill percentage — cap at 125% for visual
  const fillPct = Math.min((value / tMax) * 100, 125);
  const overflowPct = fillPct > 100 ? fillPct - 100 : 0;
  const mainFillWidth = Math.min(fillPct, 100);

  // Bar track color: passed = sage, short = muted peach, over = deeper amber
  const barColor = isPass ? BRAND.passFill : isShort ? BRAND.shortText : BRAND.overText;

  // Target band for range metrics (only show for ranges, subtle)
  const targetLowPct = isRange ? (target[0] / tMax) * 100 : 0;

  // Status label text
  const statusText = isPass
    ? "on target"
    : isShort
      ? `short ${Math.abs(dn)}${unit}`
      : `over ${Math.abs(dn)}${unit}`;

  return (
    <div style={{ marginBottom: 14 }}>
      {/* Label row */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 6,
      }}>
        <span style={{
          fontSize: 12,
          fontWeight: 500,
          color: BRAND.ink,
        }}>
          {label}
        </span>
        <span style={{ fontSize: 11, color: BRAND.inkSecondary }}>
          <span style={{ fontWeight: 600, color: BRAND.ink }}>{value}{unit}</span>
          <span style={{ color: BRAND.inkTertiary, marginLeft: 4 }}>
            / {isRange ? `${target[0]}–${target[1]}` : target}{unit}
          </span>
        </span>
      </div>

      {/* Bar track */}
      <div style={{
        position: "relative",
        height: 6,
        background: BRAND.cardBgAlt,
        borderRadius: 4,
        overflow: "hidden",
      }}>
        {/* Target band (for ranges) */}
        {isRange && (
          <div style={{
            position: "absolute",
            left: `${targetLowPct}%`,
            right: 0,
            top: 0,
            bottom: 0,
            background: BRAND.passBg,
            opacity: 0.4,
          }} />
        )}
        {/* Main fill */}
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${mainFillWidth}%`,
          background: barColor,
          borderRadius: 4,
          transition: "width 0.5s ease",
        }} />
        {/* Overflow indicator (if over) */}
        {overflowPct > 0 && (
          <div style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: `${overflowPct}%`,
            background: BRAND.overText,
            borderRadius: "0 4px 4px 0",
            opacity: 0.85,
          }} />
        )}
      </div>

      {/* Status text beneath */}
      <div style={{
        fontSize: 10,
        color: isPass ? BRAND.passText : isShort ? BRAND.shortText : BRAND.overText,
        marginTop: 4,
        fontWeight: 500,
      }}>
        {statusText}
      </div>
    </div>
  );
}

function MealRow({ label, content, color, colorDeep, icon }: { label: string; content: string; color: string; colorDeep: string; icon: string }) {
  if (!content || content.startsWith("—") || content === "待更新 TBD") return null;
  return (
    <div style={{
      display: "flex",
      gap: 11,
      marginBottom: 14,
      alignItems: "flex-start",
    }}>
      {/* Accent bar on left */}
      <div style={{
        width: 3,
        alignSelf: "stretch",
        minHeight: 40,
        background: color,
        borderRadius: 2,
        flexShrink: 0,
      }} />

      {/* Icon badge */}
      <div style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        background: `linear-gradient(135deg, ${color}, ${color})`,
        opacity: 0.9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 2,
      }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          color: colorDeep,
          letterSpacing: "0.08em",
          marginBottom: 3,
          textTransform: "uppercase",
        }}>
          {label}
        </div>
        <div style={{
          fontSize: 13,
          color: BRAND.ink,
          lineHeight: 1.55,
        }}>
          {content}
        </div>
      </div>
    </div>
  );
}

const NK = [
  { k: "calories", l: "Calories · 热量", u: "kcal" },
  { k: "protein", l: "Protein · 蛋白质", u: "g" },
  { k: "fat", l: "Fat · 脂肪", u: "g" },
  { k: "carbs", l: "Carbs · 碳水", u: "g" },
  { k: "sugar", l: "Sugar · 糖", u: "g" },
  { k: "iron", l: "Iron · 铁", u: "mg" },
  { k: "calcium", l: "Calcium · 钙", u: "mg" },
  { k: "fiber", l: "Fiber · 纤维", u: "g" },
  { k: "vitC", l: "Vitamin C", u: "mg" },
  { k: "omega3", l: "Omega-3", u: "mg" },
];

function getExerciseShortLabel(exercise: string) {
  if (!exercise) return "";
  const e = exercise.toLowerCase();
  if (e.includes("jazz") || e.includes("爵士")) return "爵士 Jazz";
  if (e.includes("foundation") || e.includes("基本功")) return "基本功";
  if (e.includes("shaping") || e.includes("塑形")) return "塑形";
  if (e.includes("hip-hop") || e.includes("街舞")) return "街舞";
  if (e.includes("yoga") || e.includes("瑜伽")) return "瑜伽";
  if (e.includes("elliptical") || e.includes("椭圆")) return "椭圆机";
  if (e.includes("rowing") || e.includes("划船")) return "划船";
  if (e.includes("badminton") || e.includes("羽毛球")) return "羽毛球";
  if (e.includes("swim") || e.includes("游泳")) return "游泳";
  if (e.includes("run") || e.includes("跑步")) return "跑步";
  if (e.includes("pole") || e.includes("钢管")) return "钢管";
  if (e.includes("pilates") || e.includes("普拉提")) return "普拉提";
  if (e.includes("rest") || e.includes("休息")) return "rest 休息";
  return "运动";
}

function DayCard({ day, isExpanded, onToggle }: { day: any; isExpanded: boolean; onToggle: () => void }) {
  const pass = isDayPass(day);
  const inProgress = day.label.includes("进行中") || day.label.includes("In Progress");
  const d = new Date(day.date + "T00:00:00");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const hasExercise = day.exercise && day.burn > 0;
  const exLabel = getExerciseShortLabel(day.exercise);

  // Status summaries
  const cs = getStatus(day.calories, "calories");
  const ps = getStatus(day.protein, "protein");
  const is2 = getStatus(day.iron, "iron");

  return (
    <div
      id={`day-${day.date}`}
      style={{
        background: BRAND.cardBg,
        border: `0.5px solid ${BRAND.cardBorder}`,
        borderLeft: pass
          ? `3px solid ${BRAND.passFill}`
          : inProgress
            ? `3px dashed ${BRAND.overText}`
            : `0.5px solid ${BRAND.cardBorder}`,
        borderRadius: 14,
        marginBottom: 12,
        overflow: "hidden",
      }}>
      {/* Card header */}
      <div
        onClick={onToggle}
        style={{
          padding: "14px 16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
        {/* Date block */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          flexShrink: 0,
        }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: 11,
            background: pass
              ? BRAND.passBg
              : inProgress
                ? BRAND.overBg
                : BRAND.loggedBg,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1.1,
            position: "relative",
          }}>
            <span style={{
              fontSize: 16,
              fontWeight: 700,
              color: pass
                ? BRAND.passText
                : inProgress
                  ? BRAND.overText
                  : BRAND.loggedText,
            }}>
              {d.getDate()}
            </span>
            <span style={{
              fontSize: 9,
              fontWeight: 600,
              color: pass
                ? BRAND.passText
                : inProgress
                  ? BRAND.overText
                  : BRAND.loggedText,
              opacity: 0.75,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              {months[d.getMonth()]}
            </span>
            {pass && (
              <div style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: BRAND.passFill,
                color: "white",
                fontSize: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                border: "1.5px solid white",
              }}>
                ✓
              </div>
            )}
          </div>
          {hasExercise && (
            <div style={{
              background: BRAND.overBg,
              color: BRAND.overText,
              fontSize: 9,
              fontWeight: 600,
              padding: "2px 6px",
              borderRadius: 4,
              whiteSpace: "nowrap",
              lineHeight: 1.2,
            }}>
              🔥 {exLabel}
            </div>
          )}
        </div>

        {/* Title + tags */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 600,
            fontSize: 14,
            color: BRAND.ink,
            lineHeight: 1.3,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}>
            <span>{day.label}</span>
            {pass && (
              <span style={{
                fontSize: 9,
                padding: "2px 7px",
                borderRadius: 4,
                background: BRAND.passBg,
                color: BRAND.passText,
                fontWeight: 600,
                letterSpacing: "0.03em",
              }}>
                PASS
              </span>
            )}
          </div>
          <div style={{
            display: "flex",
            gap: 5,
            marginTop: 6,
            flexWrap: "wrap",
          }}>
            {[
              { v: `${day.calories} kcal`, s: cs },
              { v: `P ${day.protein}g`, s: ps },
              { v: `Fe ${day.iron}mg`, s: is2 },
            ].map((t, i) => (
              <span key={i} style={{
                fontSize: 10,
                padding: "2px 7px",
                borderRadius: 4,
                background: (SC as any)[t.s].bg,
                color: (SC as any)[t.s].color,
                fontWeight: 500,
              }}>
                {t.v}
              </span>
            ))}
            {hasExercise && (
              <span style={{
                fontSize: 10,
                padding: "2px 7px",
                borderRadius: 4,
                background: BRAND.overBg,
                color: BRAND.overText,
                fontWeight: 500,
              }}>
                🏃 -{day.burn}
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <span style={{
          fontSize: 11,
          color: BRAND.inkTertiary,
          transition: "transform 0.25s",
          transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
          flexShrink: 0,
        }}>
          ▼
        </span>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div style={{
          padding: "0 16px 16px",
          borderTop: `0.5px solid ${BRAND.divider}`,
        }}>
          {/* Exercise bar */}
          {day.exercise !== undefined && day.exercise !== "" && (
            <div style={{
              marginTop: 14,
              padding: "10px 12px",
              background: BRAND.cardBgAlt,
              borderRadius: 10,
              fontSize: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}>
              <span style={{ color: BRAND.inkSecondary }}>
                🏃 {day.exercise}
                {day.burn > 0 && (
                  <span style={{ color: BRAND.shortText, fontWeight: 600, marginLeft: 6 }}>
                    -{day.burn} kcal
                  </span>
                )}
              </span>
              <span style={{ color: BRAND.inkSecondary, fontWeight: 600, whiteSpace: "nowrap" }}>
                Net: <span style={{ color: BRAND.passText }}>{day.calories - (day.burn || 0)}</span>
              </span>
            </div>
          )}

          {/* Meals */}
          <div style={{
            marginTop: 14,
            marginBottom: 18,
            background: BRAND.cardBgAlt,
            borderRadius: 12,
            padding: "16px 16px 4px",
          }}>
            <MealRow icon="🌅" label="Breakfast · 早餐" content={day.breakfast} color="#F5C9A8" colorDeep={BRAND.loggedText} />
            <MealRow icon="☀️" label="Lunch · 午餐" content={day.lunch} color="#F2DDB8" colorDeep={BRAND.overText} />
            <MealRow icon="🌙" label="Dinner · 晚餐" content={day.dinner} color="#C5B89A" colorDeep={BRAND.inkTagline} />
            <MealRow icon="🍒" label="Snacks · 零食" content={day.snacks} color="#F8DCC8" colorDeep={BRAND.shortText} />
            <MealRow icon="💊" label="Supplements · 补剂" content={day.supplements} color="#DFE8D0" colorDeep={BRAND.passText} />
          </div>

          {/* Nutrient bars */}
          {NK.map(({ k, l, u }) => (
            <NutrientBar key={k} label={l} value={day[k]} unit={u} targetKey={k} />
          ))}

          {/* Notes */}
          {day.notes && (
            <div style={{
              marginTop: 12,
              padding: "12px 14px",
              background: BRAND.cardBgAlt,
              borderRadius: 10,
              fontSize: 12,
              color: BRAND.inkSecondary,
              lineHeight: 1.65,
              borderLeft: `2px solid ${BRAND.overText}`,
            }}>
              {day.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EnjoyEating() {
  const [data, setData] = useState<any[]>(INITIAL_DATA);
  const [expandedIdx, setExpandedIdx] = useState<number>(INITIAL_DATA.length - 1);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const last = INITIAL_DATA[INITIAL_DATA.length - 1];
    const d = new Date(last.date + "T00:00:00");
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  useEffect(() => {
    // Load Google Fonts
    const existing = document.querySelector('link[href*="Pinyon+Script"]');
    if (!existing) {
      const preconnect1 = document.createElement('link');
      preconnect1.rel = 'preconnect';
      preconnect1.href = 'https://fonts.googleapis.com';
      document.head.appendChild(preconnect1);

      const preconnect2 = document.createElement('link');
      preconnect2.rel = 'preconnect';
      preconnect2.href = 'https://fonts.gstatic.com';
      preconnect2.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect2);

      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = GOOGLE_FONTS_LINK;
      document.head.appendChild(fontLink);
    }

    try {
      const raw = localStorage.getItem("enjoy-eating-v1");
      if (raw) {
        const p = JSON.parse(raw);
        if (p.length > 0) { setData(p); setExpandedIdx(p.length - 1); }
      } else {
        try { localStorage.setItem("enjoy-eating-v1", JSON.stringify(INITIAL_DATA)); } catch (err) {}
      }
    } catch (e) {
      try { localStorage.setItem("enjoy-eating-v1", JSON.stringify(INITIAL_DATA)); } catch (err) {}
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: BRAND.fontBody,
        color: BRAND.inkSecondary,
        fontSize: 13,
        background: BRAND.pageBg,
      }}>
        Loading 加载中...
      </div>
    );
  }

  // Aggregate stats
  const finished = data.filter(d => !d.label.includes("进行中") && !d.label.includes("In Progress"));
  const ac = finished.length ? Math.round(finished.reduce((s, d) => s + d.calories, 0) / finished.length) : 0;
  const ap = finished.length ? Math.round(finished.reduce((s, d) => s + d.protein, 0) / finished.length) : 0;
  const ai = finished.length ? +(finished.reduce((s, d) => s + d.iron, 0) / finished.length).toFixed(1) : 0;
  const af = finished.length ? Math.round(finished.reduce((s, d) => s + d.fat, 0) / finished.length) : 0;
  const passDays = finished.filter(isDayPass).length;

  return (
    <div style={{
      fontFamily: BRAND.fontBody,
      background: BRAND.pageBg,
      minHeight: "100vh",
      color: BRAND.ink,
    }}>
      <Hero avgKcal={ac} avgProtein={ap} passCount={passDays} totalCount={finished.length} />

      <div style={{ padding: "20px 18px 32px", maxWidth: 600, margin: "0 auto" }}>
        {/* Monthly calendar */}
        <MonthlyView
          data={data}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onDayClick={(dateStr) => {
            const idx = data.findIndex(d => d.date === dateStr);
            if (idx >= 0) {
              setExpandedIdx(idx);
              setTimeout(() => {
                const el = document.getElementById(`day-${dateStr}`);
                if (el) {
                  const rect = el.getBoundingClientRect();
                  const offset = window.pageYOffset + rect.top - 16;
                  window.scrollTo({ top: offset, behavior: "smooth" });
                }
              }, 50);
            }
          }}
        />

        {/* Section: April overview */}
        <div style={{ marginBottom: 14, marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 600,
            color: BRAND.ink,
            margin: 0,
            letterSpacing: -0.2,
          }}>
            April overview · 四月概览
          </h2>
          <span style={{ fontSize: 11, color: BRAND.inkSecondary, fontWeight: 500 }}>
            {passDays}/{finished.length} days passed
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <SummaryCard label="Avg Calories · 平均热量" value={ac} unit="kcal" targetKey="calories" />
          <SummaryCard label="Avg Protein · 平均蛋白" value={ap} unit="g" targetKey="protein" />
          <SummaryCard label="Avg Iron · 平均铁" value={ai} unit="mg" targetKey="iron" />
          <SummaryCard label="Avg Fat · 平均脂肪" value={af} unit="g" targetKey="fat" />
        </div>

        {/* Section: Daily log */}
        <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 600,
            color: BRAND.ink,
            margin: 0,
            letterSpacing: -0.2,
          }}>
            Daily log · 每日记录
          </h2>
          <span style={{ fontSize: 11, color: BRAND.inkSecondary, fontWeight: 500 }}>
            {data.length} entries
          </span>
        </div>

        {data.map((day, i) => (
          <DayCard
            key={day.date}
            day={day}
            isExpanded={i === expandedIdx}
            onToggle={() => setExpandedIdx(i === expandedIdx ? -1 : i)}
          />
        ))}

        {/* Footer tagline */}
        <div style={{
          textAlign: "center",
          marginTop: 24,
          paddingTop: 16,
          borderTop: `0.5px solid ${BRAND.divider}`,
          fontFamily: BRAND.fontTagline,
          fontStyle: "italic",
          fontSize: 12,
          color: BRAND.inkSecondary,
        }}>
          Fuel your everyday better
        </div>
      </div>
    </div>
  );
}
