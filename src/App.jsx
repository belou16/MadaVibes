import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Compass,
  Download,
  MapPin,
  Search,
  Star,
  Users,
  Wallet,
  WifiOff
} from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const DESTINATIONS = [
  { name: "Nosy Be", region: "Northwest", drive: "1h flight from Tana", rating: 4.9, lat: -13.312, lng: 48.258, image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=80" },
  { name: "RN7", region: "South Axis", drive: "Road trip 1000km", rating: 4.8, lat: -20.745, lng: 47.167, image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80" },
  { name: "Tsingy de Bemaraha", region: "West", drive: "2h flight + 4x4", rating: 4.9, lat: -18.677, lng: 44.75, image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80" },
  { name: "Isalo", region: "Southwest", drive: "10h from Tana", rating: 4.8, lat: -22.593, lng: 45.395, image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80" },
  { name: "Ile Sainte-Marie", region: "East Coast", drive: "1.5h flight", rating: 4.9, lat: -17.084, lng: 49.817, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80" },
  { name: "Andasibe", region: "East", drive: "3h from Tana", rating: 4.8, lat: -18.924, lng: 48.419, image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=900&q=80" },
  { name: "Avenue of Baobabs", region: "West", drive: "8h from Tana", rating: 4.9, lat: -20.25, lng: 44.419, image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&q=80" },
  { name: "Ifaty", region: "Southwest", drive: "1h from Tulear", rating: 4.7, lat: -23.12, lng: 43.61, image: "https://images.unsplash.com/photo-1501959915551-4e8d30928317?auto=format&fit=crop&w=900&q=80" },
  { name: "Anakao", region: "Southwest", drive: "Boat transfer", rating: 4.8, lat: -23.672, lng: 43.648, image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80" },
  { name: "Ranomafana", region: "Highlands", drive: "7h from Tana", rating: 4.8, lat: -21.26, lng: 47.419, image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80" },
  { name: "Masoala", region: "Northeast", drive: "Flight + boat", rating: 4.9, lat: -15.648, lng: 50.118, image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=80" },
  { name: "Diego Suarez", region: "North", drive: "2h flight", rating: 4.7, lat: -12.278, lng: 49.291, image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80" },
  { name: "Amber Mountain", region: "North", drive: "45m from Diego", rating: 4.7, lat: -12.53, lng: 49.17, image: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=900&q=80" },
  { name: "Ankarana", region: "North", drive: "2h from Diego", rating: 4.8, lat: -12.949, lng: 49.132, image: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=900&q=80" },
  { name: "Morondava", region: "West", drive: "1h flight", rating: 4.7, lat: -20.288, lng: 44.317, image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80" },
  { name: "Manakara", region: "Southeast", drive: "Train + road", rating: 4.6, lat: -22.148, lng: 48.015, image: "https://images.unsplash.com/photo-1493589976221-c2357c31ad77?auto=format&fit=crop&w=900&q=80" },
  { name: "Fort Dauphin", region: "South", drive: "2h flight", rating: 4.7, lat: -25.033, lng: 46.997, image: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=900&q=80" },
  { name: "Antsirabe", region: "Highlands", drive: "3h from Tana", rating: 4.6, lat: -19.865, lng: 47.033, image: "https://images.unsplash.com/photo-1506197061617-7f5c0b093236?auto=format&fit=crop&w=900&q=80" },
  { name: "Fianarantsoa", region: "Highlands", drive: "8h from Tana", rating: 4.6, lat: -21.453, lng: 47.086, image: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=900&q=80" },
  { name: "Toamasina", region: "East", drive: "6h from Tana", rating: 4.5, lat: -18.149, lng: 49.402, image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80" },
  { name: "Mahajanga", region: "Northwest", drive: "1.5h flight", rating: 4.6, lat: -15.716, lng: 46.317, image: "https://images.unsplash.com/photo-1457269449834-928af64c684d?auto=format&fit=crop&w=900&q=80" },
  { name: "Ankarafantsika", region: "Northwest", drive: "2h from Mahajanga", rating: 4.7, lat: -16.317, lng: 46.814, image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=900&q=80" },
  { name: "Maroantsetra", region: "Northeast", drive: "Flight + boat", rating: 4.7, lat: -15.435, lng: 49.739, image: "https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=900&q=80" },
  { name: "Antananarivo", region: "Capital", drive: "Base city", rating: 4.5, lat: -18.879, lng: 47.507, image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80" },
  { name: "Mantadia", region: "East", drive: "4h from Tana", rating: 4.8, lat: -18.87, lng: 48.43, image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=80" },
  { name: "Kirindy", region: "West", drive: "Road from Morondava", rating: 4.7, lat: -20.057, lng: 44.65, image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=900&q=80" },
  { name: "Zafimaniry Villages", region: "Highlands", drive: "Hike + 4x4", rating: 4.6, lat: -20.15, lng: 47.1, image: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=900&q=80" },
  { name: "Marojejy", region: "Northeast", drive: "Flight + trek", rating: 4.9, lat: -14.437, lng: 49.79, image: "https://images.unsplash.com/photo-1544216717-3bbf52512659?auto=format&fit=crop&w=900&q=80" },
  { name: "Lokobe", region: "Nosy Be", drive: "Boat from Hell-Ville", rating: 4.8, lat: -13.419, lng: 48.332, image: "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?auto=format&fit=crop&w=900&q=80" },
  { name: "Nosy Iranja", region: "Nosy Be", drive: "Boat day trip", rating: 4.9, lat: -13.584, lng: 47.996, image: "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=900&q=80" },
  { name: "Andavadoaka", region: "Southwest", drive: "Remote coastal road", rating: 4.8, lat: -22.117, lng: 43.491, image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=900&q=80" },
  { name: "Nosy Komba", region: "Nosy Be", drive: "15m by boat", rating: 4.7, lat: -13.43, lng: 48.35, image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=900&q=80" }
];

const GUIDE_SPOTLIGHT = [
  { name: "Tiana Rakoto", base: "Antananarivo", reviews: 482, score: 4.9, focus: "Culture + RN7", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80" },
  { name: "Fara Noro", base: "Nosy Be", reviews: 339, score: 4.9, focus: "Marine + whale routes", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80" },
  { name: "Mamy Rasoanaivo", base: "Ranomafana", reviews: 291, score: 4.8, focus: "Lemur night walks", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80" }
];

const TOP_REGIONS = [
  "Nosy Be: Beach paradise ⭐⭐⭐⭐⭐",
  "RN7: Adventure road 1000km",
  "Tsingy de Bemaraha: UNESCO limestone forest",
  "Isalo: Canyon + lemurs",
  "Sainte-Marie: Pirate island + whales"
];

const month = new Date().getMonth() + 1;

function seasonalSummary() {
  if (month >= 4 && month <= 6) return "Perfect for lemurs in April-June. Clear trails, fewer crowds.";
  if (month >= 7 && month <= 10) return "Whale season is live in Sainte-Marie (July-October).";
  return "Rainy season? BEST time for chameleons and lush rainforest photography.";
}

function App() {
  const [search, setSearch] = useState("");
  const [fromMga, setFromMga] = useState(500000);
  const [rates, setRates] = useState({ EUR: 0.0002, USD: 0.00022 });
  const [downloaded, setDownloaded] = useState(() => {
    const saved = localStorage.getItem("mada-offline-regions");
    return saved ? JSON.parse(saved) : [];
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dayPlans, setDayPlans] = useState(Array.from({ length: 7 }, () => []));

  const filtered = useMemo(() => {
    return DESTINATIONS.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.region.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  useEffect(() => {
    async function getRates() {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/MGA");
        const data = await response.json();
        if (data?.rates?.EUR && data?.rates?.USD) {
          setRates({ EUR: data.rates.EUR, USD: data.rates.USD });
        }
      } catch {
        // Keep fallback values if live conversion fails.
      }
    }
    getRates();
  }, []);

  useEffect(() => {
    localStorage.setItem("mada-offline-regions", JSON.stringify(downloaded));
  }, [downloaded]);

  useEffect(() => {
    const onConnect = () => setIsOnline(true);
    const onDisconnect = () => setIsOnline(false);
    window.addEventListener("online", onConnect);
    window.addEventListener("offline", onDisconnect);
    return () => {
      window.removeEventListener("online", onConnect);
      window.removeEventListener("offline", onDisconnect);
    };
  }, []);

  const activityStatus = {
    whale: month >= 7 && month <= 10 ? "Live now" : "Opens in July",
    lemur: month >= 4 && month <= 6 ? "Peak season" : "Available year-round",
    night: month >= 11 || month <= 3 ? "Best for chameleons" : "Excellent visibility"
  };

  function toggleOffline(region) {
    setDownloaded((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  }

  function addToDay(dayIndex, destinationName) {
    setDayPlans((prev) => {
      const next = [...prev];
      if (!next[dayIndex].includes(destinationName)) {
        next[dayIndex] = [...next[dayIndex], destinationName];
      }
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-mada-gradient font-body text-mada-text">
      {!isOnline && (
        <div className="fixed inset-x-0 top-0 z-50 mx-auto mt-3 flex w-fit items-center gap-2 rounded-full border border-amber-300/40 bg-mada-midnight/90 px-4 py-2 text-sm">
          <WifiOff size={15} /> Offline mode active. Saved regions available.
        </div>
      )}

      <header className="relative h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          src="https://cdn.coverr.co/videos/coverr-palm-trees-on-a-sunny-day-1579/1080p.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-mada-midnight/50 to-mada-midnight" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6">
          <p className="mb-4 inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm backdrop-blur">
            🇲🇬 MadaVibes • Madagascar. Unfiltered.
          </p>
          <h1 className="font-display text-5xl font-semibold leading-tight md:text-7xl">Madagascar awaits</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            Premium, local-first trips built with verified Malagasy guides, live season intelligence, and offline-ready route maps.
          </p>
          <div className="mt-8 flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl">
            <Search className="text-mada-gold" />
            <input
              className="w-full bg-transparent text-base outline-none placeholder:text-slate-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Nosy Be, RN7, Tsingy..."
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-16 px-6 pb-16">
        <section className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Compass, title: "30+ Destinations", value: `${DESTINATIONS.length} mapped spots` },
            { icon: Users, title: "Local Guides", value: "216 verified Malagasy experts" },
            { icon: CalendarDays, title: "Best Time Engine", value: seasonalSummary() }
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <item.icon className="mb-3 text-mada-emerald" />
              <p className="text-sm uppercase tracking-wide text-slate-300">{item.title}</p>
              <p className="mt-1 text-lg font-medium">{item.value}</p>
            </div>
          ))}
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-3xl">Top regions</h2>
            <p className="text-sm text-slate-300">Avoid July-Aug crowds, April-June is perfect.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {TOP_REGIONS.map((text) => (
              <div key={text} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                {text}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-5 font-display text-3xl">Destinations carousel</h2>
          <div className="hide-scrollbar flex snap-x gap-4 overflow-x-auto pb-4">
            {filtered.slice(0, 16).map((d) => (
              <motion.article
                key={d.name}
                whileHover={{ rotateX: 6, rotateY: -6, y: -5 }}
                transition={{ type: "spring", stiffness: 180, damping: 16 }}
                className="group min-w-[260px] snap-center overflow-hidden rounded-3xl border border-white/10 bg-mada-midnight/70"
              >
                <img src={d.image} alt={d.name} className="h-44 w-full object-cover" loading="lazy" />
                <div className="space-y-2 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl">{d.name}</h3>
                    <span className="inline-flex items-center gap-1 text-sm text-amber-300">
                      <Star size={14} /> {d.rating}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{d.drive}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 font-display text-3xl">Interactive Madagascar map</h2>
            <div className="overflow-hidden rounded-3xl border border-white/10">
              <MapContainer center={[-19.5, 46.5]} zoom={5.5} className="h-[420px] w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filtered.map((d) => (
                  <Marker key={d.name} position={[d.lat, d.lng]}>
                    <Popup>
                      <strong>{d.name}</strong>
                      <br />
                      {d.region} • {d.drive}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <h3 className="mb-3 flex items-center gap-2 font-display text-2xl">
                <CalendarDays className="text-mada-gold" /> Real-time activities
              </h3>
              <div className="space-y-2 text-sm">
                <p>Whale watching (July-Oct): <span className="text-mada-emerald">{activityStatus.whale}</span></p>
                <p>Lemur treks: <span className="text-mada-emerald">{activityStatus.lemur}</span></p>
                <p>Night walks: <span className="text-mada-emerald">{activityStatus.night}</span></p>
              </div>
              <p className="mt-3 text-sm text-slate-300">Malagasy guide = 10x better experience in remote parks.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <h3 className="mb-3 flex items-center gap-2 font-display text-2xl">
                <Wallet className="text-mada-emerald" /> Price converter (MGA)
              </h3>
              <input
                type="number"
                className="w-full rounded-lg border border-white/10 bg-mada-midnight/60 p-2"
                value={fromMga}
                onChange={(e) => setFromMga(Number(e.target.value || 0))}
              />
              <p className="mt-3 text-sm">EUR: <strong>{(fromMga * rates.EUR).toFixed(2)}</strong></p>
              <p className="text-sm">USD: <strong>{(fromMga * rates.USD).toFixed(2)}</strong></p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <h3 className="mb-3 flex items-center gap-2 font-display text-2xl">
                <Download className="text-mada-gold" /> Offline maps
              </h3>
              <div className="flex flex-wrap gap-2">
                {["RN7", "Nosy Be", "Sainte-Marie", "Tsingy"].map((region) => (
                  <button
                    key={region}
                    onClick={() => toggleOffline(region)}
                    className={`rounded-full px-3 py-1 text-sm ${downloaded.includes(region) ? "bg-mada-emerald text-mada-midnight" : "bg-white/10"}`}
                  >
                    {downloaded.includes(region) ? `Downloaded: ${region}` : `Download ${region}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-5 font-display text-3xl">4-column destination mosaic</h2>
          <div className="columns-1 gap-4 space-y-4 md:columns-2 xl:columns-4">
            {filtered.map((d) => (
              <div key={`${d.name}-mosaic`} className="break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="relative">
                  <img src={d.image} alt={d.name} loading="lazy" className="h-48 w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 p-3 backdrop-blur-sm">
                    <p className="font-medium">{d.name}</p>
                    <p className="text-xs text-slate-200">{d.region} • {d.drive}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {GUIDE_SPOTLIGHT.map((g) => (
            <article key={g.name} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
              <img src={g.photo} alt={g.name} className="mb-3 h-52 w-full rounded-xl object-cover" loading="lazy" />
              <h3 className="font-display text-xl">{g.name}</h3>
              <p className="text-sm text-slate-300">{g.base} • {g.focus}</p>
              <p className="mt-2 text-sm">⭐ {g.score} ({g.reviews} reviews)</p>
              <a
                href={`https://wa.me/261340000000?text=Hi%20${encodeURIComponent(g.name)},%20I%20want%20to%20book%20a%20Madagascar%20trip.`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block rounded-full bg-mada-gold px-4 py-2 text-sm font-semibold text-mada-midnight"
              >
                Book on WhatsApp
              </a>
            </article>
          ))}
        </section>

        <section>
          <h2 className="mb-4 font-display text-3xl">7-day itinerary builder</h2>
          <p className="mb-4 text-sm text-slate-300">Drag a destination card title into a day slot.</p>
          <div className="mb-4 flex snap-x gap-2 overflow-x-auto">
            {filtered.slice(0, 12).map((d) => (
              <button
                key={`${d.name}-drag`}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", d.name)}
                className="shrink-0 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm"
              >
                {d.name}
              </button>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {dayPlans.map((day, i) => (
              <div
                key={`day-${i + 1}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => addToDay(i, e.dataTransfer.getData("text/plain"))}
                className="min-h-24 rounded-xl border border-dashed border-white/20 bg-white/5 p-3"
              >
                <p className="mb-2 text-sm font-semibold">Day {i + 1}</p>
                {day.length ? day.map((place) => <p key={`${i}-${place}`} className="text-sm text-slate-200">• {place}</p>) : <p className="text-xs text-slate-400">Drop places here</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
          <h2 className="font-display text-3xl">Mobile-first flow</h2>
          <p className="mt-2 text-slate-200">Swipe cities below on iPhone 16 Pro width for quick discovery.</p>
          <div className="hide-scrollbar mt-4 flex gap-3 overflow-x-auto pb-3">
            {filtered.slice(0, 10).map((city) => (
              <div key={`${city.name}-swipe`} className="min-w-[180px] snap-center rounded-2xl border border-white/10 bg-mada-midnight/70 p-3">
                <MapPin size={14} className="text-mada-gold" />
                <p className="mt-1 text-sm font-medium">{city.name}</p>
                <p className="text-xs text-slate-300">{city.region}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-300">
        Made for Madagascar with love • madavibes.mg
      </footer>
    </div>
  );
}

export default App;