const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const footerRegex = /\{\/\* Footer \*\/\}.*?(?=\<\/div>\s+\<\/div>\s+\<\/div>\s+\<\/footer>\s+\<\/div>\s+\);\s+\})/s;
const footerOld = `      {/* Footer */}
      <footer className="bg-surface-container-lowest w-full py-8 px-margin-mobile md:px-margin-desktop border-t border-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-3xl mx-auto mb-8">
          <div className="md:col-span-4 flex flex-col">
            <div className="font-display-lg text-headline-md text-primary mb-4">AURA EVENTS</div>
            <p className="font-body-md text-on-surface-variant mb-6 max-w-sm leading-relaxed font-light tracking-wide">
              Эксклюзивное агентство по организации мероприятий премиум-класса. Создаем события, которые становятся легендами.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors" title="ВКонтакте">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 7.82c.16-.54 0-.94-.8-.94H19.8c-.64 0-.94.34-1.1.72 0 0-1.24 3-2.96 4.96-.56.56-.8.74-1.12.74-.16 0-.4-.18-.4-.72V7.82c0-.64-.18-.94-.72-.94H10.1c-.4 0-.64.3-.64.58 0 .62.94.76 1.04 2.5v3.78c0 .8-.14.96-.46.96-.86 0-2.94-3.04-4.2-6.52-.24-.68-.48-.94-1.12-.94H2.32C1.6 6.88 1.46 7.22 1.46 7.58c0 .66.86 4 4.02 8.42 2.1 2.98 5.04 4.6 7.74 4.6 1.94 0 2.26-.4 2.26-1.1v-2.52c0-.74.16-.88.5-.88.26 0 .72.14 1.76 1.14 2.38 2.38 2.78 3.36 3.72 3.36h2.4c.72 0 1.08-.36.88-1.08-.24-.76-1.12-1.88-2.28-3.22-.64-.78-1.6-1.58-1.9-1.98-.4-.52-.28-.74 0-1.22.02 0 3.34-4.72 3.6-6.4z"/>
                </svg>
              </a>
`;
// Let's replace the whole footer up to the end
