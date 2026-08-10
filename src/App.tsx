import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const stepsWrapperRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  // —— Форма заявки ——
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', format: '' });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const setField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};

    if (!form.name.trim()) next.name = 'Укажите ваше имя';
    else if (form.name.trim().length < 2) next.name = 'Имя слишком короткое';

    const digits = form.phone.replace(/[^0-9]/g, '');
    if (!form.phone.trim()) next.phone = 'Укажите телефон';
    else if (digits.length < 10) next.phone = 'Неполный номер телефона';

    if (!form.email.trim()) next.email = 'Укажите email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = 'Неверный формат email';

    if (!form.date) next.date = 'Выберите дату';
    if (!form.format) next.format = 'Выберите формат';
    if (!agree) next.agree = 'Нужно согласие на обработку данных';

    setErrors(next);

    if (Object.keys(next).length > 0) {
      setSent(false);
      window.setTimeout(() => {
        const first = document.querySelector('[data-invalid="true"]') as HTMLElement | null;
        if (first) {
          first.scrollIntoView({ behavior: 'smooth', block: 'center' });
          first.focus({ preventScroll: true });
        }
      }, 0);
      return;
    }

    setSent(true);
    setForm({ name: '', phone: '', email: '', date: '', format: '' });
    setAgree(false);
  };

  const fieldClass = (invalid: boolean) =>
    `w-full min-w-0 max-w-full appearance-none bg-surface-container/50 border rounded-full px-5 sm:px-6 py-3.5 sm:py-4 text-base text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 transition-all ${
      invalid
        ? 'border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-outline/30 focus:border-primary focus:ring-primary'
    }`;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          let counters = entry.target.querySelectorAll('.counter');
          if (entry.target.classList.contains('counter')) {
            counters = [entry.target] as any;
          }
          
          counters.forEach((counter: any) => {
            if (!counter.classList.contains('counted')) {
              counter.classList.add('counted');
              const target = +(counter.getAttribute('data-target') || 0);
              const duration = 2000;
              const step = target / (duration / 16);
              let current = 0;
              const updateCounter = () => {
                current += step;
                if (current < target) {
                  counter.innerText = 'До ' + Math.ceil(current);
                  requestAnimationFrame(updateCounter);
                } else {
                  counter.innerText = 'До ' + target;
                }
              };
              updateCounter();
            }
          });
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up, .counter').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!stickyContainerRef.current || !stepsWrapperRef.current) return;
      
      const numSteps = 5;
      const rect = stickyContainerRef.current.getBoundingClientRect();
      const containerTop = rect.top;
      const containerHeight = rect.height - window.innerHeight;
      
      if (containerTop <= 0 && containerTop >= -containerHeight) {
        const scrollProgress = Math.abs(containerTop) / containerHeight;
        stepsWrapperRef.current.style.transform = `translateX(-${scrollProgress * 80}%)`;

        const activeIndex = Math.min(Math.floor(scrollProgress * numSteps), numSteps - 1);
        setActiveStep(activeIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="top" className="text-on-surface antialiased overflow-x-hidden  selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-md border-b border-white/5 transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 w-full max-w-container-max mx-auto">
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); }}
            aria-label="Наверх страницы"
            className="font-display-lg text-headline-sm tracking-tighter text-primary hover:text-primary-fixed transition-colors cursor-pointer select-none"
          >
            [ВАШ БРЕНД]
          </a>
          <nav className="hidden md:flex gap-8">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-lg text-body-lg" href="#services">Услуги</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-lg text-body-lg" href="#cases">Кейсы</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-lg text-body-lg" href="#process">Процесс</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-lg text-body-lg" href="#about">О нас</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-lg text-body-lg" href="#contacts">Контакты</a>
          </nav>
          <a href="#contacts" className="hidden md:flex items-center bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-caps text-label-caps uppercase tracking-wider hover:bg-primary-fixed transition-colors btn-hover-effect">
            Рассчитать стоимость
          </a>
          <button className="md:hidden text-primary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg pt-24 px-6 flex flex-col gap-8 md:hidden text-center">
            <a href="#services" className="text-2xl font-display-lg text-white" onClick={() => setIsMenuOpen(false)}>Услуги</a>
            <a href="#cases" className="text-2xl font-display-lg text-white" onClick={() => setIsMenuOpen(false)}>Кейсы</a>
            <a href="#process" className="text-2xl font-display-lg text-white" onClick={() => setIsMenuOpen(false)}>Процесс</a>
            <a href="#about" className="text-2xl font-display-lg text-white" onClick={() => setIsMenuOpen(false)}>О нас</a>
            <a href="#contacts" className="text-2xl font-display-lg text-white" onClick={() => setIsMenuOpen(false)}>Контакты</a>
        </div>
      )}

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-32 pb-20 px-margin-mobile md:px-margin-desktop overflow-hidden">
          <div className="absolute inset-0 z-0">
            <picture>
              <source media="(max-width: 767px)" type="image/webp" srcSet="./images/hero-mobile-720.webp 720w, ./images/hero-mobile-1080.webp 1080w" sizes="100vw" />
              <source type="image/webp" srcSet="./images/hero-1280.webp 1280w, ./images/hero-1920.webp 1920w, ./images/hero-2560.webp 2560w" sizes="100vw" />
              <img src="./images/hero-fallback.jpg" alt="Праздничный вечер с гостями" fetchPriority="high" decoding="async" className="w-full h-full object-cover object-center opacity-90" />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/35 md:bg-gradient-to-r md:from-background md:via-background/90 md:to-background/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>
          
          <div className="relative z-10 w-full flex flex-col justify-center text-left items-start mt-12">
            <div className="w-full max-w-4xl relative">
              
              <h1 className="text-[2.1rem] sm:text-5xl md:text-7xl lg:text-[5.5rem] font-display-lg text-on-surface mb-6 sm:mb-8 leading-[1.12] tracking-tight text-balance animate-fade-up" style={{ animationDelay: '0.1s' }}>
                Создаём события, <br/><span className="text-gold-gradient italic pr-2 sm:pr-4">вне времени</span> и ожиданий
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl font-body-lg text-on-surface-variant mb-10 sm:mb-12 max-w-2xl leading-relaxed text-pretty animate-fade-up" style={{ animationDelay: '0.2s' }}>
                Мы трансформируем ваши амбиции в безупречную реальность, создавая иммерсивные пространства и незабываемые впечатления для самой взыскательной аудитории.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-14 sm:mb-20 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <a href="#contacts" className="bg-primary text-on-primary px-8 py-4 rounded-full font-label-caps text-sm uppercase tracking-wider hover:bg-primary-fixed transition-all hover:scale-105 btn-hover-effect flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(237,192,110,0.3)]">
                  Обсудить проект
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </a>
                <button className="border border-primary/50 text-primary px-8 py-4 rounded-full font-label-caps text-sm uppercase tracking-wider hover:bg-primary/10 transition-colors btn-hover-effect flex items-center justify-center gap-3 group">
                  <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  Смотреть шоурил
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:flex sm:flex-wrap sm:gap-x-16 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex flex-col gap-2">
                  <div className="font-body-lg font-medium text-2xl sm:text-4xl text-primary drop-shadow-[0_0_10px_rgba(237,192,110,0.5)] tracking-tight">500+</div>
                  <div className="font-label-caps text-[10px] sm:text-xs tracking-widest text-on-surface-variant opacity-80 uppercase">Реализованных проектов</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="font-body-lg font-medium text-2xl sm:text-4xl text-primary drop-shadow-[0_0_10px_rgba(237,192,110,0.5)] tracking-tight">12 лет</div>
                  <div className="font-label-caps text-[10px] sm:text-xs tracking-widest text-on-surface-variant opacity-80 uppercase">Безупречной репутации</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="font-body-lg font-medium text-2xl sm:text-4xl text-primary drop-shadow-[0_0_10px_rgba(237,192,110,0.5)] tracking-tight">98%</div>
                  <div className="font-label-caps text-[10px] sm:text-xs tracking-widest text-on-surface-variant opacity-80 uppercase">Постоянных клиентов</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Services Section */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop relative overflow-hidden" id="services">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-cover bg-center opacity-20" style={{ backgroundImage: "url('./images/services-bg.webp')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background"></div>
          </div>
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] bg-primary/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
          <div className="max-w-container-max mx-auto relative z-10">
            <div className="mb-14 md:mb-20 max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-10 bg-primary/60"></span>
                <span className="font-label-caps text-label-caps uppercase tracking-[0.2em] text-primary text-xs">Направления</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Искусство создания идеальных моментов</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-6 max-w-2xl">Полный цикл — от концепции и сметы до технического продакшна и работы с гостями в день события.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                { img: './images/srv-wedding.webp', alt: 'Свадебная арка с орхидеями и свечами в сумерках', title: 'Свадьбы', desc: 'Эксклюзивные торжества под ключ: выездная регистрация, декор, банкет и шоу-программа.', meta: 'от 40 до 400 гостей' },
                { img: './images/srv-anniversary.webp', alt: 'Праздничный торт и бокалы шампанского при свечах', title: 'Юбилеи и торжества', desc: 'Семейные даты с драматургией вечера, живой музыкой и личными смыслами.', meta: 'сценарий под семью' },
                { img: './images/srv-corporate.webp', alt: 'Гости корпоративного вечера в современном зале', title: 'Корпоративы', desc: 'Премиальные корпоративные события, отражающие статус и философию вашего бренда.', meta: 'под ключ' },
                { img: './images/srv-conference.webp', alt: 'Конференц-зал с подсвеченной сценой', title: 'Конференции', desc: 'Деловые форумы с безукоризненной логистикой, регистрацией и техническим оснащением.', meta: 'до 2000 участников' },
                { img: './images/srv-decor.webp', alt: 'Флорист собирает композицию из белых роз', title: 'Флористика и декор', desc: 'Авторские флоральные инсталляции, световое оформление и сервировка столов.', meta: 'собственная мастерская' },
                { img: './images/srv-production.webp', alt: 'Сценические прожекторы и световой пульт', title: 'Технический продакшн', desc: 'Свет, звук, сцена и медиа: от расчёта схем до монтажа и сопровождения.', meta: 'своё оборудование' }
              ].map((service, idx) => (
                <a
                  key={idx}
                  href="#contacts"
                  className="group relative flex flex-col rounded-[28px] p-[1px] bg-gradient-to-b from-outline/25 via-outline/10 to-transparent hover:from-primary/60 hover:via-primary/20 transition-all duration-500 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[27px] bg-surface/90 backdrop-blur-md shadow-[0_2px_20px_-8px_rgba(0,0,0,0.6)] group-hover:shadow-[0_24px_60px_-24px_rgba(237,192,110,0.35)] transition-shadow duration-500">

                    <div className="relative h-48 lg:h-52 shrink-0 overflow-hidden">
                      <img
                        src={service.img}
                        alt={service.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
                    </div>

                    <div className="flex flex-1 flex-col p-8 lg:p-9">
                      <h3 className="font-headline-md text-2xl lg:text-[26px] leading-snug text-on-surface mb-4 group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-8">
                        {service.desc}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-outline/15 group-hover:border-primary/25 transition-colors duration-500">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 font-label-caps text-[11px] uppercase tracking-[0.14em] text-primary/90 group-hover:bg-primary/20 transition-colors duration-500">
                          {service.meta}
                        </span>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-outline/30 text-on-surface-variant group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary group-hover:rotate-45 transition-all duration-500 motion-reduce:transition-none">
                          <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>


            <div className="mt-10 sm:mt-14 lg:mt-16 relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] via-surface/60 to-transparent px-5 py-6 sm:px-8 sm:py-9 lg:px-12 lg:py-11">
              <div className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-primary/10 blur-[90px]"></div>
              <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-8">
                <div className="max-w-xl">
                  <h3 className="font-headline-md text-xl sm:text-2xl lg:text-3xl text-on-surface mb-2 sm:mb-3 text-balance">Не нашли свой формат?</h3>
                  <p className="font-body-lg text-sm sm:text-lg lg:text-xl text-on-surface/90 leading-relaxed text-pretty">
                    Опишите задачу — предложим решение и смету за <span className="text-primary font-medium whitespace-nowrap">2 дня</span>.
                  </p>
                </div>
                <a
                  href="#contacts"
                  className="btn-hover-effect group inline-flex w-full lg:w-auto shrink-0 items-center justify-center gap-3 sm:gap-4 rounded-full bg-primary px-6 py-4 sm:px-10 sm:py-5 lg:px-12 lg:py-6 font-label-caps text-sm sm:text-base lg:text-lg font-semibold uppercase whitespace-nowrap tracking-[0.08em] sm:tracking-[0.12em] text-on-primary shadow-[0_16px_40px_-14px_rgba(237,192,110,0.6)] hover:bg-primary-fixed hover:shadow-[0_22px_60px_-14px_rgba(237,192,110,0.8)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background transition-all duration-300 motion-reduce:transition-none"
                >
                  Подобрать формат
                  <span className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-on-primary/15 group-hover:bg-on-primary/25 group-hover:translate-x-1 transition-all duration-300">
                    <span className="material-symbols-outlined text-[18px] sm:text-[22px]">arrow_forward</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Cases Gallery Section */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop" id="cases">
          <div className="max-w-container-max mx-auto">
            <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Избранные проекты</h2>
              </div>
              <a className="inline-flex items-center gap-2 text-primary hover:text-primary-fixed transition-colors font-label-caps text-label-caps uppercase tracking-wider group" href="#">
                Все кейсы
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { img: "./images/case-wedding.webp", tag: "Свадьбы", title: "Свадьба в загородной резиденции" },
                { img: "./images/case-anniversary.webp", tag: "Юбилеи", title: "Юбилей 50 лет в бальном зале" },
                { img: "./images/case-corporate.webp", tag: "Корпоративы", title: "Новогодний корпоратив компании" },
                { img: "./images/case-conference.webp", tag: "Конференции", title: "Деловой форум на 1200 гостей" },
                { img: "./images/case-banquet.webp", tag: "Банкеты", title: "Семейный банкет в саду" },
                { img: "./images/case-decor.webp", tag: "Оформление", title: "Флористика и декор торжества" }
              ].map((item, idx) => (
                <div key={idx} className="relative group overflow-hidden rounded-2xl aspect-[4/3]">
                  <img alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" src={item.img} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <div className="font-label-caps text-label-caps text-primary mb-2">{item.tag}</div>
                    <h3 className="font-headline-md text-2xl text-on-surface">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section (Sticky Scroll) */}
        <section className="relative bg-surface" id="process">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-cover bg-center opacity-40" style={{ backgroundImage: "url('./images/case-banquet.webp')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background"></div>
          </div>
          <div className="process-heading relative z-30 pt-5 pb-4 md:pt-14 md:pb-8 px-margin-mobile md:px-margin-desktop text-center pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-transparent"></div>
            <h2 className="relative font-headline-lg text-[1.6rem] leading-tight sm:text-3xl md:text-headline-lg text-on-surface text-balance drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">Как мы создаем легенды?</h2>
          </div>
          <div className="sticky-container" id="process-sticky-container" ref={stickyContainerRef}>
            <div className="sticky-content">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
              
              <div className="steps-wrapper relative z-10" id="process-steps-wrapper" ref={stepsWrapperRef}>
                {[
                  { num: '01', title: 'Бриф', desc: 'Глубокое погружение в цели и философию. Мы анализируем каждую деталь, чтобы понять истинную суть вашего бренда или личного запроса.', img: './images/step-1-brief.webp' },
                  { num: '02', title: 'Концепция', desc: 'Разработка креативной идеи и визуального стиля. Мы создаем мудборды, скетчи и 3D-визуализации будущего пространства.', img: './images/step-2-concept.webp' },
                  { num: '03', title: 'Планирование', desc: 'Детальная смета, логистика и тайминг. Ювелирная точность в расчетах и подборе подрядчиков высочайшего уровня.', img: './images/step-3-planning.webp' },
                  { num: '04', title: 'Реализация', desc: 'Безупречный монтаж и контроль на площадке. Наша команда управляет сотнями процессов одновременно для идеального результата.', img: './images/step-4-production.webp' },
                ].map((step, idx) => (
                  <div key={idx} className={`step-panel px-margin-mobile md:px-margin-desktop transition-all duration-1000 ease-out`}>
                    <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
                      <div className="w-32 h-32 sm:w-44 sm:h-44 md:w-64 md:h-64 mb-5 md:mb-10 relative flex items-center justify-center rounded-full p-2 group shadow-[0_0_40px_rgba(237,192,110,0.1)]">
                        <div className="absolute inset-0 border border-primary/40 border-dashed rounded-full animate-[spin_20s_linear_infinite] group-hover:border-primary transition-colors duration-700"></div>
                        <div className="absolute inset-[-10px] border border-primary/10 rounded-full animate-[spin_30s_linear_infinite_reverse]"></div>
                        
                        <div className="w-full h-full rounded-full overflow-hidden relative border border-primary/20">
                            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-700"></div>
                            <img src={step.img} alt={step.title} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-1000 ease-out" />
                        </div>
                      </div>
                      <div className="font-display-lg text-primary mb-2 md:mb-4 text-3xl sm:text-4xl md:text-6xl drop-shadow-[0_0_15px_rgba(237,192,110,0.3)]">{step.num}</div>
                      <h3 className="font-headline-md text-xl sm:text-2xl md:text-4xl text-on-surface mb-2 md:mb-6">{step.title}</h3>
                      <p className="font-body-lg text-sm sm:text-base text-on-surface-variant max-w-lg mx-auto leading-relaxed text-pretty">{step.desc}</p>
                    </div>
                  </div>
                ))}
                
                {/* Step 5 */}
                <div className={`step-panel px-margin-mobile md:px-margin-desktop transition-all duration-1000 ease-out`}>
                  <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-12 items-center">
                    <div>
                      <div className="font-display-lg text-primary mb-2 md:mb-4 text-3xl sm:text-4xl md:text-7xl drop-shadow-[0_0_15px_rgba(237,192,110,0.3)]">05</div>
                      <h3 className="font-headline-lg text-xl sm:text-2xl md:text-5xl text-on-surface mb-2 md:mb-6">Событие</h3>
                      <p className="font-body-lg text-sm sm:text-base text-on-surface-variant mb-3 md:mb-6 leading-relaxed text-pretty">Момент, когда магия становится реальностью. Идеальное исполнение, где каждая секунда срежиссирована, а гости погружаются в атмосферу абсолютной роскоши и комфорта.</p>
                      <p className="hidden sm:block font-body-lg text-sm sm:text-base text-on-surface-variant leading-relaxed text-pretty">Мы берем на себя все заботы, чтобы вы могли наслаждаться своим триумфом.</p>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(237,192,110,0.2)] border border-primary/20 relative group max-h-[34vh] lg:max-h-none">
                      <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-700"></div>
                      <img alt="Первый танец молодожёнов" loading="lazy" className="w-full h-full max-h-[34vh] lg:max-h-none lg:h-auto object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" src="./images/about.webp" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Navigation dots */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                {[0, 1, 2, 3, 4].map(idx => (
                  <div key={idx} className={`w-3 h-3 rounded-full transition-all duration-300 step-dot ${activeStep === idx ? 'bg-primary' : 'bg-primary/30'}`}></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Combined Why Us & Scales Section with Shared Background */}
        <div className="relative overflow-hidden mt-12">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-cover md:bg-fixed bg-center opacity-25 blur-[6px] scale-105" style={{ backgroundImage: "url('./images/cta-bg.webp')" }}></div>
            <div className="absolute inset-0 bg-background/70"></div>
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
          </div>
          
          <div className="relative z-10">
            {/* Why Us Section */}
            <section className="py-section-gap px-margin-mobile md:px-margin-desktop" id="about">
              <div className="max-w-5xl mx-auto text-center fade-in-up" id="about-content">
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8 leading-tight">Создаем наследие, <br/><span className="text-gold-gradient italic">не подвластное времени</span></h2>
                <p className="font-body-lg text-on-surface-variant mb-16 leading-relaxed max-w-3xl mx-auto">Наш подход основан на бескомпромиссном внимании к деталям и глубоком понимании эстетики люкса. Мы не просто организуем мероприятия — мы режиссируем эмоции.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12 text-left">
                  {[
                    { num: '01', title: 'Индивидуальность', text: 'Уникальная архитектура каждого события без использования шаблонных паттернов.' },
                    { num: '02', title: 'Безупречность', text: 'Швейцарский стандарт в планировании логистики и синхронизации таймингов.' },
                    { num: '03', title: 'Инновации', text: 'Синтез передовых мультимедийных технологий и высокого искусства.' },
                    { num: '04', title: 'Приватность', text: 'Абсолютная конфиденциальность и протоколы безопасности закрытых торжеств.' }
                  ].map((item, idx) => (
                    <div key={idx} className="relative pl-8 border-l border-primary/30 hover:border-primary transition-colors duration-500 group">
                      <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors duration-500"></div>
                      <div className="font-display-lg text-primary/70 group-hover:text-primary transition-colors duration-500 mb-3 text-5xl">{item.num}</div>
                      <h4 className="font-headline-md text-xl text-on-surface mb-2">{item.title}</h4>
                      <p className="font-body-md text-on-surface-variant text-sm">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Scales Section */}
            <section className="py-section-gap px-margin-mobile md:px-margin-desktop relative overflow-hidden">
              <div className="max-w-container-max mx-auto relative z-10">
                <div className="text-center mb-16">
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Решения для любых задач</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-panel p-10 rounded-2xl border-t-4 border-t-primary/30 hover:border-t-primary hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(237,192,110,0.2)] cursor-pointer relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="font-display-lg text-4xl text-primary mb-4 counter relative z-10 group-hover:scale-110 transition-transform duration-500 origin-left" data-target="100">0</div>
                    <h3 className="font-body-lg text-on-surface mb-4 font-semibold text-xl relative z-10 group-hover:text-primary transition-colors">Камерные события</h3>
                    <p className="font-body-md text-on-surface-variant relative z-10">Закрытые ужины, советы директоров, эксклюзивные презентации для VIP-клиентов.</p>
                  </div>
                  <div className="glass-panel p-10 rounded-2xl border-t-4 border-t-primary/60 hover:border-t-primary hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(237,192,110,0.2)] cursor-pointer relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="font-display-lg text-4xl text-primary mb-4 counter relative z-10 group-hover:scale-110 transition-transform duration-500 origin-left" data-target="1000">0</div>
                    <h3 className="font-body-lg text-on-surface mb-4 font-semibold text-xl relative z-10 group-hover:text-primary transition-colors">Масштабные проекты</h3>
                    <p className="font-body-md text-on-surface-variant relative z-10">Корпоративные форумы, гала-ужины, церемонии награждения, светские приемы.</p>
                  </div>
                  <div className="glass-panel p-10 rounded-2xl border-t-4 border-t-primary hover:border-t-primary hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(237,192,110,0.2)] cursor-pointer relative overflow-hidden group bg-gradient-to-b from-primary/10 to-transparent">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="font-display-lg text-4xl text-primary mb-4 relative z-10 group-hover:scale-110 transition-transform duration-500 origin-left">1000+</div>
                    <h3 className="font-body-lg text-on-surface mb-4 font-semibold text-xl relative z-10 group-hover:text-primary transition-colors">Грандиозные шоу</h3>
                    <p className="font-body-md text-on-surface-variant relative z-10">Городские фестивали, стадионные концерты, масштабные выставки и конгрессы.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-16 sm:py-24 px-margin-mobile md:px-margin-desktop relative overflow-hidden" id="contacts">
              <div className="max-w-container-max mx-auto relative z-10 glass-panel p-5 sm:p-8 md:p-16 rounded-3xl border border-primary/20 shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Готовы создать легенду?</h2>
              <p className="font-body-lg text-on-surface-variant">Оставьте заявку, и наш продюсер свяжется с вами для обсуждения деталей.</p>
            </div>
            <form className="max-w-3xl mx-auto" onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col md:flex-row gap-4 mb-4 md:items-start">
                <div className="flex-1 min-w-0">
                  <input
                    className={fieldClass(!!errors.name)}
                    placeholder="Имя *"
                    type="text"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    aria-invalid={!!errors.name}
                    data-invalid={errors.name ? 'true' : undefined}
                  />
                  {errors.name && <p className="font-body-md text-xs text-red-400 mt-2 pl-6">{errors.name}</p>}
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    className={fieldClass(!!errors.phone)}
                    placeholder="Телефон *"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    aria-invalid={!!errors.phone}
                    data-invalid={errors.phone ? 'true' : undefined}
                  />
                  {errors.phone && <p className="font-body-md text-xs text-red-400 mt-2 pl-6">{errors.phone}</p>}
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    className={fieldClass(!!errors.email)}
                    placeholder="Email *"
                    type="email"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    aria-invalid={!!errors.email}
                    data-invalid={errors.email ? 'true' : undefined}
                  />
                  {errors.email && <p className="font-body-md text-xs text-red-400 mt-2 pl-6">{errors.email}</p>}
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mb-6 md:items-end">
                <div className="flex-1 min-w-0">
                  <label htmlFor="event-date" className="block font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant mb-2 pl-5 sm:pl-6">
                    Дата мероприятия <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="event-date"
                      className={`${fieldClass(!!errors.date)} pr-12 [color-scheme:dark]`}
                      type="date"
                      value={form.date}
                      onChange={(e) => setField('date', e.target.value)}
                      aria-invalid={!!errors.date}
                      data-invalid={errors.date ? 'true' : undefined}
                    />
                    <span aria-hidden="true" className="material-symbols-outlined pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-primary/70">calendar_month</span>
                  </div>
                  {errors.date && <p className="font-body-md text-xs text-red-400 mt-2 pl-6">{errors.date}</p>}
                </div>
                <div className="flex-1 min-w-0">
                  <label htmlFor="event-format" className="block font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant mb-2 pl-5 sm:pl-6">
                    Формат мероприятия <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                  <select
                    id="event-format"
                    className={`${fieldClass(!!errors.format)} pr-12 ${form.format ? 'text-on-surface' : 'text-on-surface-variant'}`}
                    value={form.format}
                    onChange={(e) => setField('format', e.target.value)}
                    aria-invalid={!!errors.format}
                    data-invalid={errors.format ? 'true' : undefined}
                  >
                    <option value="">Выберите формат</option>
                    <option value="corporate">Корпоратив</option>
                    <option value="wedding">Свадьба</option>
                    <option value="anniversary">Юбилей</option>
                    <option value="conference">Конференция</option>
                    <option value="other">Другое</option>
                  </select>
                  <span aria-hidden="true" className="material-symbols-outlined pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-primary/70">expand_more</span>
                  </div>
                  {errors.format && <p className="font-body-md text-xs text-red-400 mt-2 pl-5 sm:pl-6">{errors.format}</p>}
                </div>
                <div className="flex-1 min-w-0">
                  <button className="w-full bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-wider rounded-full px-6 sm:px-8 py-4 hover:bg-primary-fixed transition-colors btn-hover-effect" type="submit">
                    Отправить запрос
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="privacy"
                  className={`group flex items-start gap-3 sm:gap-4 cursor-pointer select-none rounded-2xl border px-4 py-3.5 sm:px-5 sm:py-4 transition-all duration-200 ${
                    errors.agree
                      ? 'border-red-500/70 bg-red-500/5'
                      : agree
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-outline/25 bg-surface-container/30 hover:border-outline/50 hover:bg-surface-container/50'
                  }`}
                >
                  <input
                    className="peer sr-only"
                    id="privacy"
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => {
                      setAgree(e.target.checked);
                      if (e.target.checked) setErrors(prev => { const n = { ...prev }; delete n.agree; return n; });
                    }}
                    aria-describedby="privacy-error"
                    aria-invalid={!!errors.agree}
                    data-invalid={errors.agree ? 'true' : undefined}
                  />
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background ${
                      agree
                        ? 'border-primary bg-primary scale-100'
                        : errors.agree
                          ? 'border-red-500 bg-transparent'
                          : 'border-outline/50 bg-transparent group-hover:border-primary/70'
                    }`}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 text-on-primary transition-all duration-200 motion-reduce:transition-none ${
                        agree ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                      }`}
                    >
                      <path d="M4 10.5 8 14.5 16 6" />
                    </svg>
                  </span>
                  <span className="flex flex-col gap-1 text-left">
                    <span className={`font-body-md text-sm leading-relaxed transition-colors duration-200 ${errors.agree ? 'text-red-400' : 'text-on-surface'}`}>
                      Я согласен с обработкой персональных данных
                      <span className="text-primary"> *</span>
                    </span>
                    <span className="font-body-md text-xs text-on-surface-variant/80 leading-relaxed">
                      Мы используем данные только для связи по вашей заявке и не передаём их третьим лицам.
                    </span>
                  </span>
                </label>
                {errors.agree && (
                  <p id="privacy-error" role="alert" className="font-body-md text-xs text-red-400 flex items-center gap-1.5 pl-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {errors.agree}
                  </p>
                )}

                {Object.keys(errors).length > 0 && (
                  <div className="mt-4 w-full rounded-2xl border border-red-500/40 bg-red-500/10 px-6 py-3 text-center">
                    <p className="font-body-md text-sm text-red-400">
                      Заполните поля, отмеченные красным — осталось {Object.keys(errors).length} шт.
                    </p>
                  </div>
                )}

                {sent && (
                  <div className="mt-4 w-full rounded-2xl border border-primary/40 bg-primary/10 px-6 py-3 text-center">
                    <p className="font-body-md text-sm text-primary">
                      Заявка отправлена. Наш продюсер свяжется с вами в течение рабочего дня.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </section>
        </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest w-full py-14 px-margin-mobile md:px-margin-desktop xl:px-20 2xl:px-28 border-t border-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-x-12 md:gap-y-12 lg:gap-x-16 xl:gap-x-24 w-full mb-12">
          <div className="md:col-span-12 lg:col-span-3 flex flex-col">
            <div className="font-display-lg text-headline-md text-primary mb-4">[ВАШ БРЕНД]</div>
            <p className="font-body-md text-on-surface-variant mb-6 max-w-sm leading-relaxed font-light tracking-wide">
              Эксклюзивное агентство по организации мероприятий премиум-класса. Создаем события, которые становятся легендами.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors" title="ВКонтакте">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.79 7.3H4.05c.13 6.24 3.25 9.99 8.72 9.99h.31v-3.57c2.01.2 3.53 1.67 4.14 3.57h2.84c-.78-2.84-2.83-4.41-4.11-5.01 1.28-.74 3.08-2.54 3.51-4.98h-2.58c-.56 1.98-2.22 3.78-3.8 3.95V7.3H10.5v6.92c-1.6-.4-3.62-2.34-3.71-6.92Z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors" title="Telegram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.906 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors" title="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.88z"/>
                </svg>
              </a>
              <a href="tel:+74950000000" className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors" title="Позвонить">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="md:col-span-4 lg:col-span-2 flex flex-col gap-4">
              <span className="font-label-caps text-label-caps text-on-surface mb-2 text-primary">Навигация</span>
              <a className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors tracking-wide font-medium" href="#services">Услуги</a>
              <a className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors tracking-wide font-medium" href="#cases">Портфолио</a>
              <a className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors tracking-wide font-medium" href="#about">О нас</a>
              <a className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors tracking-wide font-medium" href="#contacts">Контакты</a>
          </div>
          <div className="md:col-span-4 lg:col-span-2 flex flex-col gap-4">
            <span className="font-label-caps text-label-caps text-on-surface mb-2 text-primary">Контакты</span>
            <a className="font-body-md text-sm text-primary hover:text-primary-fixed transition-colors tracking-wide font-medium" href="mailto:hello@auraevents.ru">hello@auraevents.ru</a>
            <a className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors tracking-wide font-medium" href="tel:+74950000000">+7 495 000 00 00</a>
            <span className="font-body-md text-sm text-on-surface-variant font-light tracking-wide">Москва, Пресненская наб., 12</span>
          </div>
          <div className="md:col-span-4 lg:col-span-5 rounded-2xl overflow-hidden h-72 md:h-full min-h-[18rem] lg:min-h-[22rem] relative border border-primary/20 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-0 bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-primary/40 text-6xl">map</span>
              <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent flex items-end p-6">
                <span className="font-label-caps text-primary text-xs tracking-widest">Показать на карте</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full border-t border-white/5 pt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div className="font-body-md text-sm text-on-surface-variant">
            © 2026 [ВАШ БРЕНД]. ВСЕ ПРАВА ЗАЩИЩЕНЫ.
          </div>
          <div className="flex gap-6">
            <a className="font-body-lg text-base text-on-surface-variant hover:text-primary transition-colors" href="#">Политика конфиденциальности</a>
            <a className="font-body-lg text-base text-on-surface-variant hover:text-primary transition-colors" href="#">Условия использования</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
