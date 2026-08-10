const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const scalesRegex = /<div className="grid grid-cols-1 md:grid-cols-3 gap-6">.*?<\/section>/s;

const newScales = `<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </section>`;

code = code.replace(scalesRegex, newScales);
fs.writeFileSync('src/App.tsx', code);
