const fs = require('fs');
const https = require('https');
const path = require('path');

const codePath = 'src/App.tsx';
let code = fs.readFileSync(codePath, 'utf8');

const regex = /https:\/\/images\.unsplash\.com\/([^'"\s?]+)\??[^'"\s]*/g;
let match;
const urls = new Set();
const replacements = [];

while ((match = regex.exec(code)) !== null) {
  urls.add(match[0]);
}

let downloadPromises = Array.from(urls).map((url, index) => {
  return new Promise((resolve, reject) => {
    const filename = `image_${index + 1}.jpg`;
    const filepath = path.join('public', 'images', filename);
    
    // Check if the file exists to skip downloading again
    if (fs.existsSync(filepath)) {
      code = code.split(url).join(`/images/${filename}`);
      resolve();
      return;
    }
    
    fetch(url).then(res => {
        if (!res.ok) {
           console.log(`Failed to fetch ${url}, replacing with placeholder`);
           return fetch('https://via.placeholder.com/1200x800').then(r => r.arrayBuffer());
        }
        return res.arrayBuffer();
    }).then(buffer => {
        fs.writeFileSync(filepath, Buffer.from(buffer));
        console.log(`Downloaded ${url} to ${filepath}`);
        
        code = code.split(url).join(`/images/${filename}`);
        resolve();
    }).catch(err => {
        console.error(err);
        resolve(); // resolve anyway
    });
  });
});

Promise.all(downloadPromises).then(() => {
  fs.writeFileSync(codePath, code);
  console.log('All images downloaded and code updated.');
}).catch(err => {
  console.error('Error downloading images:', err);
});
