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
    const file = fs.createWriteStream(filepath);
    
    // Some unsplash urls might redirect, so we need to handle that if using http, but fetch is easier if available
    // Node.js 18+ has fetch
    fetch(url).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch ${url}`);
        return res.arrayBuffer();
    }).then(buffer => {
        fs.writeFileSync(filepath, Buffer.from(buffer));
        console.log(`Downloaded ${url} to ${filepath}`);
        
        code = code.split(url).join(`/images/${filename}`);
        resolve();
    }).catch(err => {
        console.error(err);
        reject(err);
    });
  });
});

Promise.all(downloadPromises).then(() => {
  fs.writeFileSync(codePath, code);
  console.log('All images downloaded and code updated.');
}).catch(err => {
  console.error('Error downloading images:', err);
});
