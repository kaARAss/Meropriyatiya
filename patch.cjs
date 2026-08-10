const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const heroRegex = /\{\/\* Hero Section \*\/\}.*?(?=\{\/\* Services Section \*\/\})/s;

const newHero = `{/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-32 pb-20 px-margin-mobile md:px-margin-desktop overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-cover bg-center opacity-40 scale-105 animate-[pulse_10s_ease-in-out_infinite_alternate]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=2400&auto=format&fit=crop')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center text-left items-start mt-12">
            <div className="w-full max-w-4xl relative">
              <div className="absolute -left-12 -top-12 w-40 h-40 bg-primary/20 rounded-full blur-[60px] animate-pulse pointer-events-none"></div>
              
              <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm animate-fade-up">
                 <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                 <span className="font-label-caps text-xs tracking-[0.2em] text-primary uppercase">Эксклюзивный production</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display-lg text-on-surface mb-8 leading-[1.1] tracking-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
                Создаём события, <br/><span className="text-gold-gradient italic pr-4">вне времени</span> и ожиданий
              </h1>
              
              <p className="text-lg md:text-xl font-body-lg text-on-surface-variant mb-12 max-w-2xl leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
                Мы трансформируем ваши амбиции в безупречную реальность, создавая иммерсивные пространства и незабываемые впечатления для самой взыскательной аудитории.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-20 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <a href="#contacts" className="bg-primary text-on-primary px-8 py-4 rounded-full font-label-caps text-sm uppercase tracking-wider hover:bg-primary-fixed transition-all hover:scale-105 btn-hover-effect flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(237,192,110,0.3)]">
                  Обсудить проект
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </a>
                <button className="border border-primary/50 text-primary px-8 py-4 rounded-full font-label-caps text-sm uppercase tracking-wider hover:bg-primary/10 transition-colors btn-hover-effect flex items-center justify-center gap-3 group">
                  <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  Смотреть шоурил
                </button>
              </div>
              
              <div className="flex flex-wrap gap-x-16 gap-y-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex flex-col gap-2">
                  <div className="font-headline-md text-4xl text-primary drop-shadow-[0_0_10px_rgba(237,192,110,0.5)]">500+</div>
                  <div className="font-label-caps text-xs tracking-widest text-on-surface-variant opacity-80 uppercase">Реализованных проектов</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="font-headline-md text-4xl text-primary drop-shadow-[0_0_10px_rgba(237,192,110,0.5)]">12 лет</div>
                  <div className="font-label-caps text-xs tracking-widest text-on-surface-variant opacity-80 uppercase">Безупречной репутации</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="font-headline-md text-4xl text-primary drop-shadow-[0_0_10px_rgba(237,192,110,0.5)]">98%</div>
                  <div className="font-label-caps text-xs tracking-widest text-on-surface-variant opacity-80 uppercase">Постоянных клиентов</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        `;

code = code.replace(heroRegex, newHero);
fs.writeFileSync('src/App.tsx', code);
