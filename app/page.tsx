/**
 * page.tsx — 「去哪玩」主頁面
 *
 * Next.js App Router 慣例：
 *  - app/page.tsx 對應的路由是網站首頁 "/"
 *  - "use client" 告訴 Next.js 此元件需要在瀏覽器端執行，
 *    才能使用 useState、useRef、動畫等瀏覽器功能。
 */
"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MapPin, UtensilsCrossed, Camera, RefreshCcw, Plane } from "lucide-react";

gsap.registerPlugin(useGSAP);

// ============================================================
// 型別定義
// ============================================================
type City = {
  id: string;
  name: string;
  x: number; // SVG viewBox="0 0 400 600" 內的 X 座標
  y: number; // SVG viewBox="0 0 400 600" 內的 Y 座標
  description: string; // 城市一句話簡介
  spots: string[];     // 必訪景點
  food: string[];      // 在地美食
  emoji: string;       // 代表 Emoji
};

// ============================================================
// 台灣城市資料（包含景點、美食介紹）
// ============================================================
const CITIES: City[] = [
  {
    id: "taipei", name: "台北", x: 250, y: 100, emoji: "🏙️",
    description: "台灣的政治與文化中心，摩天樓與傳統廟宇並立。",
    spots: ["台北 101", "故宮博物院", "象山步道"],
    food: ["鼎泰豐小籠包", "公館臭豆腐", "士林夜市"],
  },
  {
    id: "keelung", name: "基隆", x: 270, y: 70, emoji: "⛵",
    description: "雨都之名遠近馳名，港灣夜市是旅人必訪之地。",
    spots: ["和平島公園", "基隆嶼", "正濱漁港"],
    food: ["廟口夜市", "鼎邊銼", "一口吃香腸"],
  },
  {
    id: "newtaipei", name: "新北", x: 235, y: 115, emoji: "🌿",
    description: "環繞台北盆地的生態寶庫，老街、山海一次收齊。",
    spots: ["九份老街", "十分瀑布", "淡水老街"],
    food: ["淡水魚丸", "九份芋圓", "三峽金牛角"],
  },
  {
    id: "taoyuan", name: "桃園", x: 205, y: 130, emoji: "✈️",
    description: "台灣的航空門戶，藏有豐富的客家文化與古蹟。",
    spots: ["大溪老街", "石門水庫", "虎頭山公園"],
    food: ["大溪豆干", "客家粿食", "蘆竹米干"],
  },
  {
    id: "hsinchu", name: "新竹", x: 180, y: 160, emoji: "💨",
    description: "科技之城，也是貢丸與九降風的故鄉。",
    spots: ["十八尖山", "玻璃工藝博物館", "新竹城隍廟"],
    food: ["新竹貢丸湯", "米粉炒", "柿餅"],
  },
  {
    id: "yilan", name: "宜蘭", x: 280, y: 140, emoji: "🌧️",
    description: "蘭陽平原上的慢活天堂，處處是綠意與溫泉。",
    spots: ["礁溪溫泉", "冬山河親水公園", "蘇澳冷泉"],
    food: ["牛舌餅", "鴨賞", "糕渣"],
  },
  {
    id: "miaoli", name: "苗栗", x: 160, y: 200, emoji: "🏔️",
    description: "以客家文化著稱，三義木雕與薰衣草森林令人流連。",
    spots: ["三義木雕街", "西湖渡假村", "獅潭老街"],
    food: ["客家粄條", "薑絲大腸", "草莓"],
  },
  {
    id: "taichung", name: "台中", x: 145, y: 250, emoji: "🌈",
    description: "台灣最宜居城市之一，彩虹眷村與夜市文化超精彩。",
    spots: ["彩虹眷村", "高美濕地", "國家歌劇院"],
    food: ["逢甲夜市", "太陽餅", "珍珠奶茶（發源地）"],
  },
  {
    id: "changhua", name: "彰化", x: 125, y: 280, emoji: "🙏",
    description: "百年古城，以八卦山大佛與扇形車庫聞名全台。",
    spots: ["八卦山大佛", "鹿港老街", "彰化扇形車庫"],
    food: ["肉圓", "蚵仔煎", "貓鼠麵"],
  },
  {
    id: "nantou", name: "南投", x: 175, y: 290, emoji: "🏞️",
    description: "台灣唯一不靠海的縣，日月潭與清境農場是代名詞。",
    spots: ["日月潭", "清境農場", "溪頭自然教育園區"],
    food: ["紅茶奶凍捲", "竹筒飯", "愛玉冰"],
  },
  {
    id: "hualien", name: "花蓮", x: 250, y: 280, emoji: "🗿",
    description: "太魯閣峽谷壯麗無比，是台灣東部的自然奇蹟。",
    spots: ["太魯閣國家公園", "七星潭", "鯉魚潭"],
    food: ["公正包子", "薯條伯伯", "花蓮麻糬"],
  },
  {
    id: "yunlin", name: "雲林", x: 105, y: 340, emoji: "🎭",
    description: "布袋戲的故鄉，也是台灣農業的重要根基。",
    spots: ["北港朝天宮", "劍湖山世界", "古坑咖啡街"],
    food: ["虎尾糖廠冰淇淋", "古坑咖啡", "雲林干貝醬"],
  },
  {
    id: "chiayi", name: "嘉義", x: 115, y: 380, emoji: "🌲",
    description: "阿里山日出雲海萬人朝聖，火雞肉飯香遍全台。",
    spots: ["阿里山國家森林", "奮起湖", "嘉義城隍廟"],
    food: ["火雞肉飯", "方塊酥", "阿里山茶葉"],
  },
  {
    id: "tainan", name: "台南", x: 90, y: 430, emoji: "🏯",
    description: "台灣的古都，古蹟林立、小吃密度是全台最高。",
    spots: ["赤崁樓", "安平古堡", "神農街"],
    food: ["擔仔麵", "虱目魚粥", "古早味豆花"],
  },
  {
    id: "kaohsiung", name: "高雄", x: 100, y: 490, emoji: "🚢",
    description: "南台灣最大港都，駁二藝術特區讓老港灣煥發新生。",
    spots: ["駁二藝術特區", "蓮池潭", "旗津海岸"],
    food: ["旗津海鮮", "肉燥飯", "木瓜牛乳"],
  },
  {
    id: "pingtung", name: "屏東", x: 130, y: 530, emoji: "🌊",
    description: "台灣最南端，墾丁碧海藍天與原住民文化交織。",
    spots: ["墾丁國家公園", "小琉球", "三地門文化村"],
    food: ["黑鮪魚生魚片", "萬巒豬腳", "恆春洋蔥"],
  },
  {
    id: "taitung", name: "台東", x: 200, y: 450, emoji: "🌅",
    description: "台灣的慢活後山，伯朗大道與熱氣球嘉年華令人心醉。",
    spots: ["伯朗大道", "三仙台", "知本溫泉"],
    food: ["池上控肉飯包", "旗魚黑輪", "釋迦冰"],
  },
  {
    id: "penghu", name: "澎湖", x: 40, y: 300, emoji: "🏝️",
    description: "玄武岩絕景與清澈海水，令人流連忘返的度假勝地。",
    spots: ["雙心石滬", "奎壁山摩西分海", "跨海大橋"],
    food: ["仙人掌冰", "黑糖糕", "小管麵線"],
  },
  {
    id: "kinmen", name: "金門", x: 20, y: 150, emoji: "⚔️",
    description: "戰地風光與傳統閩南古厝交織，金門高粱香醇。",
    spots: ["翟山坑道", "莒光樓", "水頭聚落"],
    food: ["廣東粥", "炒泡麵", "貢糖"],
  },
  {
    id: "matsu", name: "馬祖", x: 100, y: 30, emoji: "✨",
    description: "藍眼淚的夢幻故鄉，芹壁聚落彷彿置身地中海。",
    spots: ["八八坑道", "芹壁聚落", "北海坑道"],
    food: ["老酒麵線", "繼光餅", "淡菜"],
  },
  {
    id: "xiaoliuqiu", name: "小琉球", x: 110, y: 550, emoji: "🐢",
    description: "不受東北季風影響的珊瑚礁島，與海龜共游的潛水聖地。",
    spots: ["花瓶岩", "蛤板灣", "烏鬼洞"],
    food: ["麻花捲", "相思麵", "起司捲"],
  },
  {
    id: "greenisland", name: "綠島", x: 240, y: 470, emoji: "♨️",
    description: "擁有世界級海底溫泉與豐富的熱帶珊瑚礁生態。",
    spots: ["朝日溫泉", "綠島燈塔", "哈巴狗與睡美人岩"],
    food: ["海草冰", "鹿肉炒麵", "花生鮮奶茶"],
  },
  {
    id: "lanyu", name: "蘭嶼", x: 270, y: 530, emoji: "🛶",
    description: "達悟族傳統文化保留地，保留最原始純粹的自然美景。",
    spots: ["八代灣", "情人洞", "青青草原"],
    food: ["飛魚餐", "芋頭冰", "林投果汁"],
  },
];

// ── 工具函式 ──────────────────────────────────────────────────

/** 計算從 (x1,y1) 到 (x2,y2) 的角度（度數，供 GSAP rotation 使用） */
function calcAngle(x1: number, y1: number, x2: number, y2: number): number {
  return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
}

/** 從陣列中隨機取一個元素 */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** 在 (cx, cy) 附近產生一個隨機中繼 waypoint，spread 控制散佈幅度 */
function randomWaypoint(cx: number, cy: number, spread: number) {
  return {
    x: cx + (Math.random() - 0.5) * spread * 2,
    y: cy + (Math.random() - 0.5) * spread * 2,
  };
}

// ============================================================
// 主元件
// ============================================================
export default function Home() {

  // status：控制畫面的三種主要狀態
  const [status, setStatus] = useState<"idle" | "flying" | "result">("idle");
  // selectedCity：本次抽到的城市資料
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  // flashingCityId：飛行中正在閃爍的城市 id
  const [flashingCityId, setFlashingCityId] = useState<string | null>(null);

  // DOM 元素參考（供 GSAP 動畫使用）
  const containerRef = useRef<HTMLDivElement>(null);
  const planeGroupRef = useRef<SVGGElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  // setInterval 計時器 ID（不需觸發重渲染，用 useRef 儲存）
  const flashIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  // ── 城市閃爍效果：飛行期間啟動，落地後停止 ──────────────
  useEffect(() => {
    if (status === "flying") {
      // 每 130ms 隨機換一個城市閃爍（只改顏色，不改大小）
      flashIntervalRef.current = setInterval(() => {
        setFlashingCityId(pickRandom(CITIES).id);
      }, 130);
    } else {
      // 停止計時器
      if (flashIntervalRef.current) {
        clearInterval(flashIntervalRef.current);
        flashIntervalRef.current = null;
      }
      if (status !== "result") setFlashingCityId(null);
    }
    return () => {
      if (flashIntervalRef.current) {
        clearInterval(flashIntervalRef.current);
        flashIntervalRef.current = null;
      }
    };
  }, [status]);

  // ── 點擊「去哪玩」按鈕 ───────────────────────────────────
  const handlePlay = contextSafe(() => {
    const city = pickRandom(CITIES);
    setSelectedCity(city);
    // 停止按鈕上跳動的動畫，然後淡出縮小
    gsap.killTweensOf(buttonRef.current);
    gsap.to(buttonRef.current, {
      opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.in",
      onComplete: () => setStatus("flying"),
    });
  });

  // ── 飛行動畫 ─────────────────────────────────────────────
  useGSAP(() => {
    if (status === "flying" && selectedCity) {
      const { x: targetX, y: targetY } = selectedCity;
      const startX = -60;
      const startY = 660;

      // 產生 2 個隨機中繼點，讓飛機繞來繞去
      const wp1 = randomWaypoint(290, 130, 80); // 右上角附近
      const wp2 = randomWaypoint(110, 350, 70); // 左中附近

      // 補正量：飛機 SVG 機頭朝向右下方，需補正 +30°
      const OFFSET = 30;
      const a1 = calcAngle(startX, startY, wp1.x, wp1.y) + OFFSET;
      const a2 = calcAngle(wp1.x, wp1.y, wp2.x, wp2.y) + OFFSET;
      const a3 = calcAngle(wp2.x, wp2.y, targetX, targetY) + OFFSET;

      // 初始化飛機位置
      gsap.set(planeGroupRef.current, {
        x: startX, y: startY, opacity: 0, scale: 0.6,
        rotation: a1, transformOrigin: "center center",
      });

      // 建立動畫時間軸
      const tl = gsap.timeline({
        onComplete: () => {
          setStatus("result");
          setFlashingCityId(selectedCity.id); // 鎖定目標城市保持亮色
        },
      });

      tl
        // 淡入出現（0.25s）
        .to(planeGroupRef.current, { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out" })
        // 第 1 段：起點 → 中繼點1 右上（0.9s）
        .to(planeGroupRef.current, { x: wp1.x, y: wp1.y, rotation: a1, ease: "sine.inOut", duration: 0.9 })
        // 第 2 段：中繼點1 → 中繼點2 左中（1.1s）
        .to(planeGroupRef.current, { x: wp2.x, y: wp2.y, rotation: a2, ease: "sine.inOut", duration: 1.1 })
        // 第 3 段：中繼點2 → 目標城市（1.0s）
        .to(planeGroupRef.current, { x: targetX, y: targetY, rotation: a3, ease: "power2.inOut", duration: 1.0 })
        // 降落特效：放大一下（0.25s）
        .to(planeGroupRef.current, { scale: 1.4, rotation: a3 - 10, ease: "power2.out", duration: 0.25 })
        // 消失（0.35s）
        .to(planeGroupRef.current, { scale: 0, opacity: 0, y: targetY - 25, ease: "back.in(2)", duration: 0.35 });

      // 目的地 Marker（飛機快降落時彈出）
      // 總飛行時間 ≈ 0.25 + 0.9 + 1.1 + 1.0 = 3.25s
      gsap.fromTo(markerRef.current,
        { autoAlpha: 0, x: targetX, y: targetY, scale: 0 },
        { autoAlpha: 1, x: targetX, y: targetY, scale: 1, delay: 3.2, duration: 0.5, ease: "back.out(2)" }
      );
    }

    // 結果卡進場動畫
    if (status === "result") {
      gsap.fromTo(resultRef.current,
        { opacity: 0, scale: 0.88, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.5)" }
      );
    }
  }, [status, selectedCity]);

  // ── 再抽一次（重置）──────────────────────────────────────
  const handleReset = contextSafe(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setStatus("idle");
        setSelectedCity(null);
        setFlashingCityId(null);
      },
    });
    tl.to(resultRef.current, { opacity: 0, y: -20, duration: 0.3 })
      .to(markerRef.current, { opacity: 0, scale: 0, duration: 0.2 }, "<");
  });

  // ── 按鈕進場動畫 ────────────────────────────────────────
  useGSAP(() => {
    if (status === "idle" && buttonRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(buttonRef.current,
        { opacity: 0, scale: 0.8, y: 20, rotation: 0 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)", delay: 0.2 }
      )
      // 第一步：先往右側倒至 30 度
      .to(buttonRef.current, {
        rotation: 30,
        duration: 0.15,
        ease: "sine.inOut"
      })
      // 第二步：像蹺蹺板一樣在 30 度到 -30 度之間劇烈搖擺 3 秒鐘
      .to(buttonRef.current, {
        rotation: -30,
        duration: 0.3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 9 // 共 10 次搖擺（3 秒）
      })
      // 第三步：自動收回正中央
      .to(buttonRef.current, {
        rotation: 0,
        duration: 0.15,
        ease: "sine.inOut"
      });
    }
  }, [status]);

  // ============================================================
  // JSX 渲染
  // ============================================================
  return (
    <main
      ref={containerRef}
      className="relative flex h-screen w-full flex-col md:flex-row items-center justify-center overflow-hidden bg-sky-100 text-slate-800"
    >

      {/* ── 左側：地圖區塊 ─────────────────────────────────── */}
      <div className="relative w-full md:w-1/2 h-[55vh] md:h-screen flex items-center justify-center z-0">
        <div className="relative w-full max-w-[420px] aspect-[2/3] drop-shadow-2xl rounded-[2rem] overflow-hidden bg-sky-200">

          {/* 水彩插畫風格台灣地圖底圖 */}
          <img
            src="/taiwan_map.png"
            alt="台灣地圖"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
            style={{ filter: status === "flying" ? "brightness(0.75)" : "brightness(1)" }}
          />

          {/* SVG 互動覆蓋層：城市標記、飛機、Marker */}
          <svg viewBox="0 0 400 600" className="absolute inset-0 w-full h-full overflow-visible z-10">

            {/* 城市標記與名稱 */}
            {CITIES.map(city => {
              const isTarget = selectedCity?.id === city.id;
              // 飛行中：隨機閃爍城市；結果後：只有目標亮紅
              const isFlashing = status === "flying"
                ? flashingCityId === city.id
                : status === "result" && isTarget;
              const isDimmed = status === "result" && !isTarget;

              return (
                <g
                  key={city.id}
                  style={{ opacity: isDimmed ? 0.25 : 1, transition: "opacity 0.6s ease" }}
                >
                  {/* 城市圓點 */}
                  <circle
                    cx={city.x} cy={city.y}
                    r={isTarget && status === "result" ? 7 : 4}
                    fill={isFlashing ? "#ef4444" : "#475569"}
                    stroke="#ffffff" strokeWidth="1.5"
                    style={{ transition: "fill 0.08s ease" }}
                  />
                  {/* 城市中文名稱（白邊黑字 Google Maps 風格）
                      字體大小固定，僅顏色隨閃爍變化 */}
                  <text
                    x={city.x + 11} y={city.y + 6}
                    fontSize="14" fontWeight="800"
                    fill={isFlashing ? "#ef4444" : "#1e293b"}
                    stroke={isFlashing ? "#ffffff" : "#f1f5f9"}
                    strokeWidth="3.5" strokeLinejoin="round" paintOrder="stroke"
                    className="select-none pointer-events-none"
                    style={{ transition: "fill 0.08s ease" }}
                  >
                    {city.name}
                  </text>
                </g>
              );
            })}

            {/* 目的地 Marker（降落後出現） */}
            <g ref={markerRef} className="pointer-events-none" style={{ opacity: 0, transformOrigin: "0 0" }}>
              <circle cx="0" cy="0" r="18" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5 4"
                style={{ animation: "spin 3s linear infinite" }} />
              <MapPin x="-13" y="-27" width="26" height="26" fill="#fca5a5" className="text-red-600 drop-shadow-lg" />
            </g>

            {/* 紙飛機（純白，全白顯眼設計）
                transform="translate(-16,-16) scale(0.32)" 讓飛機以自身中心為基準，
                縮放至適當大小（100×100 的 viewBox → 約 32px）。 */}
            <g ref={planeGroupRef} className="pointer-events-none" style={{ opacity: 0 }}>
              <g transform="translate(-16, -16) scale(0.32)">
                {/* 主機身：純白填色 + 淡藍陰影描邊，讓飛機在任何背景上都清晰可見 */}
                <polygon points="10,65 92,18 48,55" fill="white" stroke="#93c5fd" strokeWidth="4" strokeLinejoin="round" />
                <polygon points="48,55 92,18 68,82" fill="white" stroke="#93c5fd" strokeWidth="4" strokeLinejoin="round" />
                <polygon points="48,55 92,18 52,92" fill="white" stroke="#93c5fd" strokeWidth="4" strokeLinejoin="round" />
                {/* 機身中間的折線細節 */}
                <line x1="48" y1="55" x2="92" y2="18" stroke="#bfdbfe" strokeWidth="2" />
              </g>
            </g>

          </svg>
        </div>
      </div>

      {/* ── 右側：互動區塊 ─────────────────────────────────── */}
      <div className="relative w-full md:w-1/2 h-[45vh] md:h-screen flex flex-col items-center justify-center z-10 px-6">

        {/* 初始按鈕 - 高質感 3D 擬真按鈕設計 */}
        {status === "idle" && (
          <button
            ref={buttonRef}
            onClick={handlePlay}
            className="group relative flex items-center justify-center rounded-full bg-gradient-to-b from-sky-400 to-blue-600 px-16 py-6 text-4xl font-black tracking-[0.1EM] text-white shadow-[0_20px_50px_-10px_rgba(37,99,235,0.7),inset_0_4px_0_rgba(255,255,255,0.4)] border-b-[8px] border-blue-800 transition-all hover:brightness-110 active:border-b-0 active:mt-[8px] active:shadow-[0_10px_20px_-10px_rgba(37,99,235,0.8)]"
          >
            <span className="drop-shadow-lg">去哪玩</span>
            
            {/* 右上角的飛機小徽章設計提升 */}
            <span className="absolute -right-4 -top-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-300 to-amber-500 rotate-12 text-yellow-950 shadow-[0_10px_20px_-5px_rgba(245,158,11,0.6),inset_0_3px_0_rgba(255,255,255,0.7)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[24deg]">
              <Plane className="w-7 h-7 fill-current drop-shadow-sm" />
            </span>
          </button>
        )}

        {/* 飛行中提示 */}
        {status === "flying" && (
          <p className="text-sky-600 text-xl font-bold tracking-widest animate-pulse">
            正在尋找目的地 ✈︎
          </p>
        )}

        {/* ── 結果卡片 ────────────────────────────────────── */}
        {status === "result" && selectedCity && (
          <div
            ref={resultRef}
            className="w-full max-w-md opacity-0 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-slate-300/60 border border-white p-7 pb-[100px] flex flex-col gap-5"
          >
            {/* 標題 */}
            <div className="text-center">
              <p className="text-slate-500 text-base font-medium tracking-widest mb-1">🎉 抽到囉！出發去</p>
              <h1 className="text-6xl font-black tracking-[0.15em] text-slate-800">
                {selectedCity.emoji} {selectedCity.name}
              </h1>
              <p className="mt-3 text-slate-500 text-sm leading-relaxed">{selectedCity.description}</p>
            </div>

            <hr className="border-slate-100" />

            {/* 必訪景點 */}
            <div>
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-700 mb-2">
                <Camera className="w-4 h-4 text-sky-500" /> 必訪景點
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedCity.spots.map(spot => (
                  <span key={spot} className="rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-sm font-medium px-3 py-1">
                    {spot}
                  </span>
                ))}
              </div>
            </div>

            {/* 在地美食 */}
            <div>
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-700 mb-2">
                <UtensilsCrossed className="w-4 h-4 text-orange-400" /> 在地美食
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedCity.food.map(item => (
                  <span key={item} className="rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium px-3 py-1">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 再抽一次按鈕 */}
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 w-full rounded-2xl bg-slate-800 py-4 text-lg font-bold tracking-wider text-white transition-all hover:bg-slate-700 active:scale-95 shadow-md"
            >
              <RefreshCcw className="w-5 h-5" />
              再抽一次
            </button>
          </div>
        )}
      </div>

      {/* CSS Keyframe for SVG spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
