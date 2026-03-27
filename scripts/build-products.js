const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_DIR = 'C:/Users/sherow/Desktop/جملة المخازن السعودية';
const OUTPUT = path.join(__dirname, '../data/jomla-ksa-products.json');

const CATEGORY_MAP = {
  'احهزه المساج.xlsx': 'أجهزة المساج',
  'ادوات التخييم.xlsx': 'أدوات التخييم',
  'ادوات الصيانة.xlsx': 'أدوات الصيانة',
  'ادوات المطبخ.xlsx': 'أدوات المطبخ',
  'ادوات تخرين وارفف.xlsx': 'أدوات التخزين والأرفف',
  'اكسسوار الجوال.xlsx': 'اكسسوار الجوال',
  'الادوات الرياضية.xlsx': 'الأدوات الرياضية',
  'الساعات الذكية.xlsx': 'الساعات الذكية',
  'العناية الشخصية.xlsx': 'العناية الشخصية',
  'العنايه بالشعر رجالى.xlsx': 'العناية بالشعر رجالي',
  'العنايه بالشعر نسائى.xlsx': 'العناية بالشعر نسائي',
  'باور بنك.xlsx': 'باور بنك',
  'توصيلات كهربائيه.xlsx': 'توصيلات كهربائية',
  'خلاطات.xlsx': 'خلاطات',
  'ديكورات وإضاءة للمنزل.xlsx': 'ديكورات وإضاءة',
  'سكوترات.xlsx': 'سكوترات',
  'سماعات الأذن.xlsx': 'سماعات الأذن',
  'سماعات الرأس.xlsx': 'سماعات الرأس',
  'شنط.xlsx': 'شنط',
  'صاعق حشرات.xlsx': 'صاعق حشرات',
  'غلايات.xlsx': 'غلايات',
  'فديو جيم.xlsx': 'فيديو جيم',
  'فواحات الكترونية.xlsx': 'فواحات إلكترونية',
  'قطاعات الخضار.xlsx': 'قطاعات الخضار',
  'قلايات هوائية.xlsx': 'قلايات هوائية',
  'كاميرات مراقبه واجهزه عرض.xlsx': 'كاميرات مراقبة',
  'كشافات طاقه شمسيه.xlsx': 'كشافات طاقة شمسية',
  'مبردات الهواء.xlsx': 'مبردات الهواء',
  'مستلزمات الاطفال.xlsx': 'مستلزمات الأطفال',
  'مستلزمات الترتيب والنظافة.xlsx': 'مستلزمات النظافة',
  'مستلزمات السياره.xlsx': 'مستلزمات السيارة',
  'مطاحن.xlsx': 'مطاحن',
  'مفارم.xlsx': 'مفارم',
  'مفروشات.xlsx': 'مفروشات',
  'مكبرات الصوت.xlsx': 'مكبرات الصوت',
  'ملحقات القهوه.xlsx': 'ملحقات القهوة',
  'ملحقات الكمبيوتر.xlsx': 'ملحقات الكمبيوتر',
  'موازين.xlsx': 'موازين',
  'مواقد.xlsx': 'مواقد',
};

let allProducts = [];
let globalId = 1;

const files = fs.readdirSync(EXCEL_DIR).filter(f => f.endsWith('.xlsx'));

for (const file of files) {
  const category = CATEGORY_MAP[file] || file.replace('.xlsx', '');
  const wb = XLSX.readFile(path.join(EXCEL_DIR, file));
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws);

  // تجميع الصور لكل منتج حسب رابط المنتج
  const grouped = {};
  for (const row of rows) {
    if (!row.name || !row['main_image-src']) continue;
    const key = row['product_link-href'] || row.name;
    if (!grouped[key]) {
      grouped[key] = {
        name: row.name,
        code: row.code || '',
        price: parseFloat((row.price || '0').toString().replace(/[^\d.]/g, '')) || 0,
        main_image: row['main_image-src'],
        sub_images: [],
        description: row.description || '',
        category,
        link: row['product_link-href'] || '',
      };
    }
    if (row['sub_images-src'] && !grouped[key].sub_images.includes(row['sub_images-src'])) {
      grouped[key].sub_images.push(row['sub_images-src']);
    }
  }

  for (const p of Object.values(grouped)) {
    const images = [p.main_image, ...p.sub_images.filter(s => s !== p.main_image)];
    
    let finalPrice = p.price;
    let availability = 'in stock';
    let availability_ar = 'متوفر';

    if (p.price === 0) {
      availability = 'out of stock';
      availability_ar = 'غير متوفر';
    } else if (p.price <= 50) {
      finalPrice = p.price + 120;
    } else {
      finalPrice = p.price + 145;
    }

    allProducts.push({
      id: globalId++,
      name: p.name,
      code: p.code,
      price: finalPrice,
      regular_price: finalPrice,
      sale_price: 0,
      image: p.main_image,
      images,
      description: p.description,
      category: p.category,
      availability,
      availability_ar,
      link: p.link,
    });
  }
}

fs.writeFileSync(OUTPUT, JSON.stringify(allProducts, null, 2), 'utf8');
console.log(`✅ تم بناء ${allProducts.length} منتج`);
const withMultiImages = allProducts.filter(p => p.images.length > 1);
console.log(`📸 منتجات بأكثر من صورة: ${withMultiImages.length}`);
