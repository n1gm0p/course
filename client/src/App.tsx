import { useEffect, useMemo, useState } from 'react';
import { isAxiosError } from 'axios';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { api } from './api';

type ThemeMode = 'light' | 'dark';
type PlaceCategory = 'sights' | 'food' | 'parks';
type PlacesTab = 'all' | PlaceCategory;

type PlaceItem = {
  id: number;
  title: string;
  description: string;
  address: string;
  category: PlaceCategory;
  imageUrl: string;
};

const TABS: { value: PlacesTab; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'sights', label: 'Достопримечательности' },
  { value: 'food', label: 'Кафе и рестораны' },
  { value: 'parks', label: 'Парки' },
];

const PLACES: PlaceItem[] = [
  {
    id: 1,
    title: 'Золотая обитель Будды Шакьямуни',
    description: 'Главный хурул Элисты и символ современной Калмыкии.',
    address: 'ул. Ю. Клыкова, 63',
    category: 'sights',
    imageUrl: '/images/elista-temple.jpg',
  },
  {
    id: 2,
    title: 'Пагода Семи Дней',
    description: 'Центральная площадь города с узнаваемой архитектурой.',
    address: 'Площадь Ленина',
    category: 'sights',
    imageUrl: '/images/elista-hero.jpg',
  },
  {
    id: 3,
    title: 'Калмыцкая кухня',
    description: 'Местные блюда, чай и национальная атмосфера.',
    address: 'Центр Элисты',
    category: 'food',
    imageUrl: '/images/elista-hero.jpg',
  },
  {
    id: 4,
    title: 'Городской парк',
    description: 'Спокойные аллеи и комфортное место для прогулок.',
    address: 'ул. Ленина',
    category: 'parks',
    imageUrl: '/images/elista-temple.jpg',
  },
];

function Navbar({
  theme,
  onToggleTheme,
}: {
  theme: ThemeMode;
  onToggleTheme: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">
          <img src="/images/elista-logo.svg" alt="Элиста места" className="logo-img" />
        </Link>
      </div>

      <button
        type="button"
        className="nav-burger"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={menuOpen}
      >
        <svg className="nav-burger-icon" viewBox="0 0 24 24" aria-hidden>
          {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      <div className="nav-center">
        <Link to="/">Главная</Link>
        <Link to="/places">Места</Link>
      </div>

      <div className="nav-right">
        <button type="button" className="theme-toggle" onClick={onToggleTheme}>
          {theme === 'dark' ? 'Светлая' : 'Тёмная'}
        </button>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="nav-mobile-overlay"
          onClick={() => setMenuOpen(false)}
          aria-label="Закрыть меню"
        />
      )}
      <div className={`nav-mobile-sheet ${menuOpen ? 'open' : ''}`}>
        <div className="nav-mobile-links">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Главная
          </Link>
          <Link to="/places" onClick={() => setMenuOpen(false)}>
            Места
          </Link>
        </div>
        <div className="nav-mobile-actions">
          <div className="nav-mobile-row">
            <button type="button" className="theme-toggle" onClick={onToggleTheme}>
              {theme === 'dark' ? 'Светлая' : 'Тёмная'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function HomePage({
  contact,
  setContact,
  submitContact,
  sending,
  contactInfo,
  contactError,
}: {
  contact: { name: string; email: string; message: string };
  setContact: React.Dispatch<React.SetStateAction<{ name: string; email: string; message: string }>>;
  submitContact: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  sending: boolean;
  contactInfo: string;
  contactError: string;
}) {
  return (
    <div className="page">
      <section className="hero hero-with-image hero-full">
        <div className="hero-overlay" />
        <div className="hero-text hero-text-center">
          <div className="hero-kicker">EXPLORE</div>
          <h1 className="hero-display">Elista</h1>
          <p className="hero-lead">
            Откройте для себя главные символы города, уютные дворы и любимые места горожан.
          </p>
        </div>
      </section>

      <div className="page-container">
        <section className="section">
          <div className="section-content">
            <h2 className="section-title">Добро пожаловать в Калмыкию - землю бескрайних степей и уникальной культуры!</h2>
            <p className="section-text">
              Калмыкия - это удивительный уголок России, где гармонично сочетаются древние традиции и современный ритм жизни.
              Эта республика - идеальное место для тех, кто хочет прикоснуться к настоящему восточному гостеприимству,
              познакомиться с уникальной природой и погрузиться в мир буддийской культуры.
            </p>
            <p className="section-text">
              Здесь вас ждут величественные степи, неповторимые ландшафты и мирный климат, создающий атмосферу умиротворения.
              Можно увидеть удивительные озера и уединенные оазисы, отправиться в путешествие по песчаным дюнам
              и встретить редких животных, включая диких лошадей и антилоп.
            </p>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Калмыкия: что посмотреть и чем заняться
          </h2>
          <div className="history-content">
            <p className="history-text">
              <strong>Культурное наследие.</strong> Калмыкия - родина буддизма в России. Здесь находится множество храмов и
              монастырей, в том числе знаменитый Элистинский Хурул - один из крупнейших буддийских храмов в Европе.
              <br />
              <br />
              <strong>Активный отдых для молодежи.</strong> Регион подойдет не только для спокойного отдыха, но и для приключений:
              экотропы, веломаршруты, степные сафари, сезонные поездки на квадроциклах и джип-экскурсии.
              <br />
              <br />
              <strong>Гастрономия.</strong> Здесь можно попробовать калмыцкий чай, традиционные блюда из мяса и другие местные
              деликатесы, приготовленные по старинным рецептам.
              <br />
              <br />
              Путешествие по Калмыкии - это возможность открыть для себя уникальное сочетание природы, истории и буддийской
              культуры. Приезжайте за впечатлениями, которые запомнятся надолго.
            </p>
            <div className="history-image">
              <img src="/images/elista-temple.jpg" alt="Хурул и главная площадь Элисты" />
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Каталог мест</h2>
          <p className="section-subtitle">
            Вся подборка мест находится на отдельной странице, чтобы главная оставалась презентационной.
          </p>
          <div>
            <Link to="/places" className="nav-mobile-pill">
              Перейти к местам
            </Link>
          </div>
        </section>

        <section id="contact" className="section">
          <h2 className="section-title">Форма обращения</h2>
          <div className="card contact-card">
            <form className="form" onSubmit={submitContact}>
              <label>
                Имя
                <input
                  value={contact.name}
                  onChange={(event) => setContact((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={contact.email}
                  onChange={(event) => setContact((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </label>
              <label>
                Сообщение
                <textarea
                  value={contact.message}
                  onChange={(event) => setContact((prev) => ({ ...prev, message: event.target.value }))}
                  required
                />
              </label>
              <button type="submit" disabled={sending}>
                {sending ? 'Отправка...' : 'Отправить'}
              </button>
              {contactInfo && <p className="success">{contactInfo}</p>}
              {contactError && <p className="error">{contactError}</p>}
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

function PlacesPage({
  activeTab,
  setActiveTab,
  places,
  setSelectedPlace,
}: {
  activeTab: PlacesTab;
  setActiveTab: React.Dispatch<React.SetStateAction<PlacesTab>>;
  places: PlaceItem[];
  setSelectedPlace: React.Dispatch<React.SetStateAction<PlaceItem | null>>;
}) {
  return (
    <div className="page">
      <div className="page-container">
        <section className="section" id="places">
          <h2 className="section-title">Места</h2>
          <p className="section-subtitle">
            Вкладки и карточки ниже полностью задаются в коде и не хранятся в базе данных.
          </p>
          <div className="catalog-tabs">
            {TABS.map((tab) => (
              <button
                type="button"
                key={tab.value}
                className={activeTab === tab.value ? 'active' : ''}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="grid">
            {places.map((place) => (
              <div
                key={place.id}
                className="card place-card"
                onClick={() => setSelectedPlace(place)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedPlace(place);
                  }
                }}
              >
                <div className="place-card-photo-wrap">
                  <img className="card-photo" src={place.imageUrl} alt={place.title} />
                </div>
                <div className="card-content">
                  <div className="card-title-row">
                    <h3>{place.title}</h3>
                    <span className="place-badge">{TABS.find((item) => item.value === place.category)?.label}</span>
                  </div>
                  <p className="card-desc">{place.description}</p>
                </div>
                <div className="card-actions">
                  <button
                    className="primary-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedPlace(place);
                    }}
                  >
                    Открыть
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('kb_theme') as ThemeMode | null;
    if (saved === 'light' || saved === 'dark') return saved;
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });
  const [activeTab, setActiveTab] = useState<PlacesTab>('all');
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [contactError, setContactError] = useState('');

  useEffect(() => {
    const isHome = location.pathname === '/';
    const isPlaces = location.pathname === '/places';
    document.body.classList.remove('home', 'places-page');
    if (isHome) {
      document.body.classList.add('home');
    }
    if (isPlaces) {
      document.body.classList.add('places-page');
    }
    return () => document.body.classList.remove('home', 'places-page');
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('kb_theme', theme);
  }, [theme]);

  const places = useMemo(
    () => (activeTab === 'all' ? PLACES : PLACES.filter((place) => place.category === activeTab)),
    [activeTab],
  );

  async function submitContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setContactError('');
    setContactInfo('');
    setSending(true);
    try {
      await api.post('/contact', contact);
      setContact({ name: '', email: '', message: '' });
      setContactInfo('Спасибо, ваше сообщение отправлено!');
    } catch (err) {
      if (isAxiosError(err)) {
        const serverMsg = err.response?.data && typeof err.response.data === 'object' && 'message' in err.response.data
          ? String((err.response.data as { message?: unknown }).message ?? '')
          : '';
        if (serverMsg) {
          setContactError(serverMsg);
        } else if (!err.response) {
          setContactError(
            'Сервер не отвечает. Запустите API: в папке server выполните npm start (порт 4000) и откройте сайт с localhost.',
          );
        } else {
          setContactError('Не удалось отправить форму. Попробуйте позже.');
        }
      } else {
        setContactError('Не удалось отправить форму. Попробуйте позже.');
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="app">
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />
      <main className="content">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                contact={contact}
                setContact={setContact}
                submitContact={submitContact}
                sending={sending}
                contactInfo={contactInfo}
                contactError={contactError}
              />
            }
          />
          <Route
            path="/places"
            element={
              <PlacesPage
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                places={places}
                setSelectedPlace={setSelectedPlace}
              />
            }
          />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>Kalmbuddha - путеводитель по Элисте</p>
          <p className="muted">© {new Date().getFullYear()} Все права защищены</p>
        </div>
      </footer>

      {selectedPlace && (
        <div className="modal-overlay" onClick={() => setSelectedPlace(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPlace(null)} aria-label="Закрыть">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="modal-scroll-wrap">
              <div className="place-modal-hero">
                <div className="place-modal-hero-media">
                  <img src={selectedPlace.imageUrl} alt={selectedPlace.title} />
                </div>
              </div>
              <div className="modal-body">
                <h2 className="place-modal-title">{selectedPlace.title}</h2>
                <div className="place-modal-meta">
                  <span className="place-modal-chip">{TABS.find((item) => item.value === selectedPlace.category)?.label}</span>
                  <span className="place-modal-chip muted-chip">{selectedPlace.address}</span>
                </div>
                <p className="place-modal-description">{selectedPlace.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

