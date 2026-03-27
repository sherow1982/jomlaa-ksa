process.env.DIST_DIR = 'out-github';
process.env.BASE_PATH = '';
process.env.SITE_URL = 'https://jomla-ksa-pro.github.io/jomla-ksa-store';
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Skip deletion - handled by npm clean script

execSync('node generate-seo.js', { stdio: 'inherit' });
execSync('next build', { stdio: 'inherit' });

// Copy feed.xml
const feedSource = path.join(__dirname, 'public', 'feed.xml');
const feedDest = path.join(__dirname, 'out-github', 'feed.xml');
if (fs.existsSync(feedSource)) {
  fs.copyFileSync(feedSource, feedDest);
  console.log('✅ feed.xml copied');
}

// Copy GitHub verification files from verification-files/github/
const githubVerificationDir = path.join(__dirname, 'verification-files', 'github');
if (fs.existsSync(githubVerificationDir)) {
  const files = fs.readdirSync(githubVerificationDir);
  files.forEach(file => {
    const src = path.join(githubVerificationDir, file);
    const dest = path.join(__dirname, 'out-github', file);
    fs.copyFileSync(src, dest);
    console.log(`✅ ${file} copied to out-github`);
  });
}
