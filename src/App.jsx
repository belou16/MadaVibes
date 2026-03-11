import React from "react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  Compass,
  Download,
  Eye,
  EyeOff,
  Heart,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Search,
  Send,
  Star,
  Trash2,
  UserCircle,
  Users,
  Wallet,
  WifiOff,
  X
} from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
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
  { name: "Tiana Rakoto", base: "Antananarivo", reviews: 482, score: 4.9, focus: "Culture + RN7", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80", whatsapp: "261340000001" },
  { name: "Fara Noro", base: "Nosy Be", reviews: 339, score: 4.9, focus: "Marine + whale routes", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80", whatsapp: "261340000002" },
  { name: "Mamy Rasoanaivo", base: "Ranomafana", reviews: 291, score: 4.8, focus: "Lemur night walks", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80", whatsapp: "261340000003" }
];

const TOP_REGIONS = [
  "Nosy Be: Beach paradise",
  "RN7: Adventure road 1000km",
  "Tsingy de Bemaraha: UNESCO limestone forest",
  "Isalo: Canyon + lemurs",
  "Sainte-Marie: Pirate island + whales"
];

const month = new Date().getMonth() + 1;
const REGIONS = ["All", ...new Set(DESTINATIONS.map((d) => d.region))];

function seasonalSummary() {
  if (month >= 4 && month <= 6) return "Perfect for lemurs in April-June. Clear trails, fewer crowds.";
  if (month >= 7 && month <= 10) return "Whale season is live in Sainte-Marie (July-October).";
  return "Rainy season? BEST time for chameleons and lush rainforest photography.";
}

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function MapFlyTo({ destination }) {
  const map = useMap();

  useEffect(() => {
    if (!destination) return;
    map.flyTo([destination.lat, destination.lng], 8, { duration: 0.8 });
  }, [destination, map]);

  return null;
}

function AuthModal({ mode, onClose, onSwitch, onAuth }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) { setError("Remplis tous les champs."); return; }
    if (!isLogin && !name) { setError("Ton nom est requis."); return; }
    if (password.length < 6) { setError("Mot de passe : 6 caractères minimum."); return; }

    setLoading(true);

    setTimeout(() => {
      const users = safeJsonParse(localStorage.getItem("mada-users"), []);

      if (isLogin) {
        const found = users.find((u) => u.email === email && u.password === password);
        if (!found) { setError("Email ou mot de passe incorrect."); setLoading(false); return; }
        onAuth(found);
      } else {
        if (users.some((u) => u.email === email)) { setError("Cet email est déjà utilisé."); setLoading(false); return; }
        const newUser = { name, email, password, createdAt: new Date().toISOString() };
        localStorage.setItem("mada-users", JSON.stringify([...users, newUser]));
        onAuth(newUser);
      }

      setLoading(false);
    }, 600);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl border border-white/15 bg-gradient-to-b from-slate-800/95 to-mada-midnight/98 p-8 shadow-2xl backdrop-blur-xl"
      >
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white">
          <X size={20} />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-mada-gold to-amber-600">
            <LogIn size={24} className="text-mada-midnight" />
          </div>
          <h2 className="font-display text-2xl font-semibold">{isLogin ? "Bon retour !" : "Créer un compte"}</h2>
          <p className="mt-1 text-sm text-slate-400">{isLogin ? "Connecte-toi pour retrouver ton itinéraire." : "Rejoins MadaVibes et planifie ton aventure."}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <UserCircle size={18} className="text-slate-400" />
              <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" placeholder="Ton nom" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <Mail size={18} className="text-slate-400" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <Lock size={18} className="text-slate-400" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" type={showPw ? "text" : "password"} placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-400 hover:text-white">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-mada-gold to-amber-500 py-3 text-sm font-semibold text-mada-midnight transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Chargement..." : isLogin ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <button onClick={onSwitch} className="font-medium text-mada-gold hover:underline">
            {isLogin ? "S'inscrire" : "Se connecter"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

function App() {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [minRating, setMinRating] = useState(4.6);
  const [activeDestination, setActiveDestination] = useState(DESTINATIONS[0]);

  const [user, setUser] = useState(() => safeJsonParse(localStorage.getItem("mada-current-user"), null));
  const [authModal, setAuthModal] = useState(null);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const [fromMga, setFromMga] = useState(500000);
  const [rates, setRates] = useState({ EUR: 0.0002, USD: 0.00022, updatedAt: "fallback" });

  const [downloaded, setDownloaded] = useState(() =>
    safeJsonParse(localStorage.getItem("mada-offline-regions"), [])
  );
  const [favoriteIds, setFavoriteIds] = useState(() =>
    safeJsonParse(localStorage.getItem("mada-favorites"), [])
  );
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dayPlans, setDayPlans] = useState(() =>
    safeJsonParse(localStorage.getItem("mada-day-plans"), Array.from({ length: 7 }, () => []))
  );

  const [weather, setWeather] = useState({ loading: false, temp: null, wind: null, code: null });

  const filtered = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      const textMatch = d.name.toLowerCase().includes(search.toLowerCase()) || d.region.toLowerCase().includes(search.toLowerCase());
      const regionMatch = selectedRegion === "All" || d.region === selectedRegion;
      const ratingMatch = d.rating >= minRating;
      return textMatch && regionMatch && ratingMatch;
    });
  }, [search, selectedRegion, minRating]);

  const itineraryCount = useMemo(
    () => dayPlans.reduce((acc, day) => acc + day.length, 0),
    [dayPlans]
  );

  useEffect(() => {
    async function getRates() {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/MGA");
        const data = await response.json();
        if (data?.rates?.EUR && data?.rates?.USD) {
          setRates({
            EUR: data.rates.EUR,
            USD: data.rates.USD,
            updatedAt: data.time_last_update_utc || "live"
          });
        }
      } catch {
        // Keep fallback values if live conversion fails.
      }
    }

    getRates();
  }, []);

  useEffect(() => {
    async function getWeather() {
      if (!activeDestination) return;
      setWeather({ loading: true, temp: null, wind: null, code: null });

      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${activeDestination.lat}&longitude=${activeDestination.lng}&current=temperature_2m,wind_speed_10m,weather_code`;
        const response = await fetch(url);
        const data = await response.json();
        const current = data?.current;

        if (current) {
          setWeather({
            loading: false,
            temp: current.temperature_2m,
            wind: current.wind_speed_10m,
            code: current.weather_code
          });
          return;
        }
      } catch {
        // If weather API fails, leave graceful fallback values.
      }

      setWeather({ loading: false, temp: null, wind: null, code: null });
    }

    getWeather();
  }, [activeDestination]);

  useEffect(() => {
    localStorage.setItem("mada-offline-regions", JSON.stringify(downloaded));
  }, [downloaded]);

  useEffect(() => {
    localStorage.setItem("mada-favorites", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    localStorage.setItem("mada-day-plans", JSON.stringify(dayPlans));
  }, [dayPlans]);

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

  useEffect(() => {
    if (!filtered.length) return;
    if (!filtered.some((item) => item.name === activeDestination?.name)) {
      setActiveDestination(filtered[0]);
    }
  }, [filtered, activeDestination]);

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

  function toggleFavorite(name) {
    setFavoriteIds((prev) =>
      prev.includes(name) ? prev.filter((id) => id !== name) : [...prev, name]
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

  function removeFromDay(dayIndex, place) {
    setDayPlans((prev) => {
      const next = [...prev];
      next[dayIndex] = next[dayIndex].filter((item) => item !== place);
      return next;
    });
  }

  function clearItinerary() {
    setDayPlans(Array.from({ length: 7 }, () => []));
  }

  function createBookingLink(destinationName, guideName) {
    const message = `Salama! I want to book a Madagascar trip. Destination: ${destinationName}. Preferred guide: ${guideName}.`;
    return `https://wa.me/261340000000?text=${encodeURIComponent(message)}`;
  }

  function handleAuth(userData) {
    setUser(userData);
    localStorage.setItem("mada-current-user", JSON.stringify(userData));
    setAuthModal(null);
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("mada-current-user");
  }

  function handleBooking() {
    if (!user) { setAuthModal("login"); return; }
    setBookingSubmitted(true);
    setTimeout(() => setBookingSubmitted(false), 4000);
  }

  return (
    <div className="min-h-screen bg-mada-gradient font-body text-mada-text">
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={() => setAuthModal(authModal === "login" ? "register" : "login")}
          onAuth={handleAuth}
        />
      )}

      {!isOnline && (
        <div className="fixed inset-x-0 top-0 z-50 mx-auto mt-3 flex w-fit items-center gap-2 rounded-full border border-amber-300/40 bg-mada-midnight/90 px-4 py-2 text-sm">
          <WifiOff size={15} /> Offline mode active. Saved regions and itinerary available.
        </div>
      )}

      <nav className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-mada-midnight/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <span className="font-display text-lg font-semibold">🦎 MadaVibes</span>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm">
                  <UserCircle size={16} className="text-mada-gold" /> {user.name}
                </span>
                <button onClick={handleLogout} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20">
                  <LogOut size={14} /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setAuthModal("login")} className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-sm hover:bg-white/20">
                  <LogIn size={14} /> Connexion
                </button>
                <button onClick={() => setAuthModal("register")} className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-mada-gold to-amber-500 px-4 py-1.5 text-sm font-semibold text-mada-midnight hover:brightness-110">
                  S'inscrire
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

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
            Plan and book with confidence: real routes, seasonal insights, live conversion, and local guide booking.
          </p>

          <div className="mt-8 grid w-full max-w-4xl gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl md:grid-cols-4">
            <div className="col-span-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3">
              <Search className="text-mada-gold" size={18} />
              <input
                className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-slate-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Nosy Be, RN7, Tsingy..."
              />
            </div>

            <select
              className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {REGIONS.map((region) => (
                <option key={region} value={region} className="bg-mada-midnight text-mada-text">
                  {region}
                </option>
              ))}
            </select>

            <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm">
              <p className="text-xs text-slate-300">Min rating: {minRating.toFixed(1)}</p>
              <input
                type="range"
                min="4.5"
                max="5"
                step="0.1"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-16 px-6 pb-16">
        <section className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Compass, title: "Filtered Destinations", value: `${filtered.length} of ${DESTINATIONS.length}` },
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
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-3xl">Destinations carousel</h2>
            <p className="text-sm text-slate-300">Tap a card to focus map + weather</p>
          </div>

          <div className="hide-scrollbar flex snap-x gap-4 overflow-x-auto pb-4">
            {filtered.slice(0, 18).map((d) => (
              <motion.article
                key={d.name}
                whileHover={{ rotateX: 6, rotateY: -6, y: -5 }}
                transition={{ type: "spring", stiffness: 180, damping: 16 }}
                className="group min-w-[260px] snap-center overflow-hidden rounded-3xl border border-white/10 bg-mada-midnight/70"
              >
                <button type="button" onClick={() => setActiveDestination(d)} className="w-full text-left">
                  <img src={d.image} alt={d.name} className="h-44 w-full object-cover" loading="lazy" />
                </button>

                <div className="space-y-2 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-xl">{d.name}</h3>
                    <span className="inline-flex items-center gap-1 text-sm text-amber-300">
                      <Star size={14} /> {d.rating}
                    </span>
                  </div>

                  <p className="text-sm text-slate-300">{d.drive}</p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => addToDay(0, d.name)}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs"
                    >
                      Add to Day 1
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(d.name)}
                      className={`rounded-full px-3 py-1 text-xs ${favoriteIds.includes(d.name) ? "bg-rose-500/90" : "bg-white/10"}`}
                    >
                      <span className="inline-flex items-center gap-1"><Heart size={12} /> Save</span>
                    </button>
                  </div>
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
                <MapFlyTo destination={activeDestination} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filtered.map((d) => (
                  <Marker key={d.name} position={[d.lat, d.lng]} eventHandlers={{ click: () => setActiveDestination(d) }}>
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
              <h3 className="mb-2 font-display text-2xl">Live Weather + Best Time</h3>
              <p className="text-sm text-slate-300">Focus: {activeDestination?.name}</p>
              {weather.loading ? (
                <p className="mt-2 text-sm">Loading weather...</p>
              ) : (
                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded-lg bg-black/20 p-2">Temp: <strong>{weather.temp ?? "--"}C</strong></div>
                  <div className="rounded-lg bg-black/20 p-2">Wind: <strong>{weather.wind ?? "--"} km/h</strong></div>
                  <div className="rounded-lg bg-black/20 p-2">Code: <strong>{weather.code ?? "--"}</strong></div>
                </div>
              )}
              <p className="mt-3 text-sm text-mada-emerald">{seasonalSummary()}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <h3 className="mb-3 flex items-center gap-2 font-display text-2xl">
                <CalendarDays className="text-mada-gold" /> Real-time activities
              </h3>
              <div className="space-y-2 text-sm">
                <p>Whale watching (July-Oct): <span className="text-mada-emerald">{activityStatus.whale}</span></p>
                <p>Lemur treks: <span className="text-mada-emerald">{activityStatus.lemur}</span></p>
                <p>Night walks: <span className="text-mada-emerald">{activityStatus.night}</span></p>
              </div>
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
              <p className="mt-2 text-xs text-slate-400">Rates source: open.er-api.com ({rates.updatedAt})</p>
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

        <section className="grid gap-6 md:grid-cols-3">
          {GUIDE_SPOTLIGHT.map((g) => (
            <article key={g.name} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
              <img src={g.photo} alt={g.name} className="mb-3 h-52 w-full rounded-xl object-cover" loading="lazy" />
              <h3 className="font-display text-xl">{g.name}</h3>
              <p className="text-sm text-slate-300">{g.base} • {g.focus}</p>
              <p className="mt-2 text-sm">⭐ {g.score} ({g.reviews} reviews)</p>
              <div className="mt-4 flex gap-2">
                <a
                  href={`https://wa.me/${g.whatsapp}?text=${encodeURIComponent("Salama! I need your help for a Madagascar trip.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-full bg-mada-gold px-4 py-2 text-sm font-semibold text-mada-midnight"
                >
                  Guide WhatsApp
                </a>
                <a
                  href={createBookingLink(activeDestination?.name || "TBD", g.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-full bg-mada-emerald px-4 py-2 text-sm font-semibold text-mada-midnight"
                >
                  Book This Plan
                </a>
              </div>
            </article>
          ))}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-3xl">7-day itinerary builder</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">{itineraryCount} activities saved</span>
              <button type="button" onClick={clearItinerary} className="rounded-full bg-white/10 px-3 py-1 text-xs">
                Clear all
              </button>
            </div>
          </div>
          <p className="mb-4 text-sm text-slate-300">Drag a destination card title into a day slot. Click an item to remove it.</p>

          <div className="mb-4 flex snap-x gap-2 overflow-x-auto">
            {filtered.slice(0, 14).map((d) => (
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
                {day.length ? (
                  day.map((place) => (
                    <button
                      key={`${i}-${place}`}
                      type="button"
                      onClick={() => removeFromDay(i, place)}
                      className="mb-1 block rounded bg-black/20 px-2 py-1 text-left text-xs text-slate-200"
                    >
                      {place}
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Drop places here</p>
                )}
              </div>
            ))}
          </div>

          {itineraryCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-3xl border border-mada-emerald/30 bg-gradient-to-r from-mada-emerald/10 to-mada-gold/10 p-6 backdrop-blur-xl"
            >
              <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
                <div>
                  <h3 className="font-display text-2xl font-semibold">Prêt à réserver ?</h3>
                  <p className="mt-1 text-sm text-slate-300">
                    {itineraryCount} activité{itineraryCount > 1 ? "s" : ""} sur {dayPlans.filter((d) => d.length > 0).length} jour{dayPlans.filter((d) => d.length > 0).length > 1 ? "s" : ""} — {user ? `Connecté en tant que ${user.name}` : "Connecte-toi pour réserver"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleBooking}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-mada-emerald to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
                  >
                    <Send size={16} /> Réserver mon voyage
                  </button>
                  <a
                    href={createBookingLink(
                      dayPlans.flat().join(", ") || activeDestination?.name || "Madagascar",
                      "Best matched guide"
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full bg-mada-gold px-6 py-3 text-sm font-semibold text-mada-midnight transition hover:brightness-110"
                  >
                    <MapPin size={16} /> Réserver via WhatsApp
                  </a>
                </div>
              </div>
              {bookingSubmitted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-mada-emerald/20 px-4 py-3 text-sm text-mada-emerald"
                >
                  <Check size={18} /> Demande envoyée ! Un guide MadaVibes te contactera sous 24h.
                </motion.div>
              )}
            </motion.div>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
          <h2 className="font-display text-3xl">Saved favorites + quick booking</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {favoriteIds.length ? favoriteIds.map((place) => (
              <span key={place} className="inline-flex items-center gap-1 rounded-full bg-rose-500/90 px-3 py-1 text-xs text-white">
                <Heart size={12} /> {place}
              </span>
            )) : <p className="text-sm text-slate-300">No saved places yet.</p>}
          </div>

          <a
            href={createBookingLink(activeDestination?.name || "TBD", "Best matched guide")}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-mada-gold px-4 py-2 text-sm font-semibold text-mada-midnight"
          >
            <MapPin size={14} /> Book current destination on WhatsApp
          </a>

          <p className="mt-3 text-xs text-slate-400">This link includes the destination and preferred guide context for faster confirmations.</p>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-300">
        Made for Madagascar with love • madavibes.mg
      </footer>
    </div>
  );
}

export default App;
