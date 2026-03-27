const fs = require('fs');
const path = require('path');

// تصحيح التاريخ
const currentDate = new Date().toISOString();

// المجلدات التي تحتوي على ملفات XML
const folders = ['public', 'out-github', 'out-cloudflare', 'out-gitlab'];

folders.forEach(folder => {
  const folderPath = path.join(__dirname, '..', folder);
  
  if (!fs.existsSync(folderPath)) {
    console.log(`⚠️  المجلد ${folder} غير موجود`);
    return;
  }

  // قراءة جميع ملفات XML
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.xml'));
  
  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // تصحيح التاريخ (2026 -> التاريخ الحالي)
    if (content.includes('2026-')) {
      content = content.replace(/2026-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g, currentDate);
      modified = true;
    }

    // تصحيح sale_price الفارغة في feed.xml
    if (file === 'feed.xml') {
      // إضافة sale_price للمنتجات التي ليس لها
      content = content.replace(
        /<g:price>(\d+\.\d+) OMR<\/g:price>\s*\n\s*<g:brand>/g,
        '<g:price>$1 OMR</g:price>\n      <g:sale_price>$1 OMR</g:sale_price>\n      <g:brand>'
      );
      modified = true;
    }

    // حفظ الملف إذا تم التعديل
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ تم تصحيح: ${folder}/${file}`);
    }
  });
});

console.log('\n✨ تم تصحيح جميع ملفات XML بنجاح!');
