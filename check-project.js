const fs = require('fs');
const path = require('path');

console.log('🔍 بدء فحص شامل للمشروع...\n');

const checks = {
  passed: [],
  warnings: [],
  errors: []
};

// 1. فحص ملفات التتبع
console.log('📊 فحص أكواد التتبع...');
const appJsPath = path.join(__dirname, 'pages', '_app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

if (appJsContent.includes('GTM-TZF4JK3N')) {
  checks.passed.push('✅ Google Tag Manager موجود');
} else {
  checks.errors.push('❌ Google Tag Manager غير موجود');
}

if (appJsContent.includes('G-3JXGBTCLSP')) {
  checks.passed.push('✅ Google Analytics موجود');
} else {
  checks.errors.push('❌ Google Analytics غير موجود');
}

if (appJsContent.includes('AW-CONVERSION_ID')) {
  checks.passed.push('✅ Google Merchant Conversion موجود');
} else {
  checks.warnings.push('⚠️ Google Merchant Conversion يحتاج تحديث ID');
}

// 2. فحص ملفات SEO
console.log('🔍 فحص ملفات SEO...');
const seoFiles = ['sitemap.xml', 'robots.txt', 'feed.xml', 'manifest.json'];
seoFiles.forEach(file => {
  const filePath = path.join(__dirname, 'public', file);
  if (fs.existsSync(filePath)) {
    checks.passed.push(`✅ ${file} موجود`);
  } else {
    checks.errors.push(`❌ ${file} غير موجود`);
  }
});

// 3. فحص المكونات
console.log('🧩 فحص المكونات...');
const components = ['Layout.js', 'ProductCard.js', 'ProductImage.js', 'Chatbot.js', 'SearchBox.js', 'FloatingButtons.js'];
components.forEach(comp => {
  const compPath = path.join(__dirname, 'components', comp);
  if (fs.existsSync(compPath)) {
    checks.passed.push(`✅ ${comp} موجود`);
  } else {
    checks.errors.push(`❌ ${comp} غير موجود`);
  }
});

// 4. فحص الصفحات
console.log('📄 فحص الصفحات...');
const pages = ['index.js', 'about.js', 'contact.js', 'cart.js', 'shipping.js', 'returns.js', 'privacy.js'];
pages.forEach(page => {
  const pagePath = path.join(__dirname, 'pages', page);
  if (fs.existsSync(pagePath)) {
    checks.passed.push(`✅ ${page} موجود`);
  } else {
    checks.errors.push(`❌ ${page} غير موجود`);
  }
});

// 5. فحص البيانات
console.log('📦 فحص البيانات...');
const dataPath = path.join(__dirname, 'data', 'jomla-ksa-products.json');
if (fs.existsSync(dataPath)) {
  const products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  checks.passed.push(`✅ ملف المنتجات موجود (${products.length} منتج)`);
  
  if (products.length >= 156) {
    checks.passed.push('✅ عدد المنتجات كامل');
  } else {
    checks.warnings.push(`⚠️ عدد المنتجات: ${products.length} (المتوقع: 156)`);
  }
} else {
  checks.errors.push('❌ ملف المنتجات غير موجود');
}

// 6. فحص التكوينات
console.log('⚙️ فحص التكوينات...');
const configs = ['next.config.js', 'package.json'];
configs.forEach(config => {
  const configPath = path.join(__dirname, config);
  if (fs.existsSync(configPath)) {
    checks.passed.push(`✅ ${config} موجود`);
  } else {
    checks.errors.push(`❌ ${config} غير موجود`);
  }
});

// 7. فحص سكريبتات البناء
console.log('🔨 فحص سكريبتات البناء...');
const buildScripts = ['build-github.js', 'build-cloudflare.js', 'build-gitlab.js', 'generate-seo.js'];
buildScripts.forEach(script => {
  const scriptPath = path.join(__dirname, script);
  if (fs.existsSync(scriptPath)) {
    checks.passed.push(`✅ ${script} موجود`);
  } else {
    checks.errors.push(`❌ ${script} غير موجود`);
  }
});

// 8. فحص الأداء
console.log('⚡ فحص تحسينات الأداء...');
const nextConfigPath = path.join(__dirname, 'next.config.js');
const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');

if (nextConfigContent.includes('compress: true')) {
  checks.passed.push('✅ Compression مفعّل');
} else {
  checks.warnings.push('⚠️ Compression غير مفعّل');
}

if (nextConfigContent.includes('swcMinify: true')) {
  checks.passed.push('✅ SWC Minify مفعّل');
} else {
  checks.warnings.push('⚠️ SWC Minify غير مفعّل');
}

// 9. فحص ProductImage
const productImagePath = path.join(__dirname, 'components', 'ProductImage.js');
const productImageContent = fs.readFileSync(productImagePath, 'utf8');

if (productImageContent.includes('loading="lazy"')) {
  checks.passed.push('✅ Lazy Loading مفعّل');
} else {
  checks.warnings.push('⚠️ Lazy Loading غير مفعّل');
}

// طباعة النتائج
console.log('\n' + '='.repeat(60));
console.log('📊 نتائج الفحص الشامل');
console.log('='.repeat(60) + '\n');

console.log('✅ النجاحات (' + checks.passed.length + '):');
checks.passed.forEach(item => console.log('  ' + item));

if (checks.warnings.length > 0) {
  console.log('\n⚠️ التحذيرات (' + checks.warnings.length + '):');
  checks.warnings.forEach(item => console.log('  ' + item));
}

if (checks.errors.length > 0) {
  console.log('\n❌ الأخطاء (' + checks.errors.length + '):');
  checks.errors.forEach(item => console.log('  ' + item));
}

console.log('\n' + '='.repeat(60));
console.log('📈 الإحصائيات:');
console.log('  ✅ نجح: ' + checks.passed.length);
console.log('  ⚠️ تحذيرات: ' + checks.warnings.length);
console.log('  ❌ أخطاء: ' + checks.errors.length);
console.log('='.repeat(60) + '\n');

if (checks.errors.length === 0) {
  console.log('🎉 المشروع جاهز 100%!\n');
} else {
  console.log('⚠️ يرجى إصلاح الأخطاء أولاً\n');
  process.exit(1);
}
