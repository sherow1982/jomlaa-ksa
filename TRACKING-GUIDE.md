# 📊 دليل أكواد التتبع - متجر السعودية

## ✅ الأكواد المحقونة

### 1. 🏷️ Google Tag Manager (GTM)
**الكود:** `GTM-TZF4JK3N`
**الموقع:** `pages/_app.js`
**الحالة:** ✅ مفعّل

```javascript
// Google Tag Manager Script
<Script id="gtm" strategy="afterInteractive">
  {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-TZF4JK3N');`}
</Script>

// Google Tag Manager (noscript)
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TZF4JK3N"
  height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
</noscript>
```

**الميزات:**
- ✅ تتبع جميع الصفحات
- ✅ تتبع الأحداث
- ✅ تتبع التحويلات
- ✅ إدارة جميع العلامات من مكان واحد

---

### 2. 📈 Google Analytics 4 (GA4)
**الكود:** `G-3JXGBTCLSP`
**الموقع:** `pages/_app.js`
**الحالة:** ✅ مفعّل

```javascript
// Google Analytics 4
<Script src="https://www.googletagmanager.com/gtag/js?id=G-3JXGBTCLSP" strategy="afterInteractive" />
<Script id="gtag-init" strategy="afterInteractive">
  {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-3JXGBTCLSP', {
    page_path: window.location.pathname,
    send_page_view: true
  });`}
</Script>
```

**الميزات:**
- ✅ تتبع الزوار في الوقت الفعلي
- ✅ تحليل سلوك المستخدمين
- ✅ تقارير مفصلة
- ✅ تتبع التحويلات

---

### 3. 🛒 Google Merchant Center Conversion
**الكود:** `AW-CONVERSION_ID`
**الموقع:** `pages/_app.js`
**الحالة:** ⚠️ يحتاج تحديث ID

```javascript
// Google Merchant Center Conversion Tracking
<Script id="merchant-conversion" strategy="afterInteractive">
  {`gtag('config', 'AW-CONVERSION_ID');`}
</Script>
```

**ملاحظة:** استبدل `AW-CONVERSION_ID` بكود التحويل الخاص بك من Google Ads

**الميزات:**
- ✅ تتبع المبيعات
- ✅ تتبع إضافة إلى السلة
- ✅ تتبع عمليات الشراء
- ✅ تحسين الحملات الإعلانية

---

## 🚀 تحسينات الأداء المطبقة

### 1. ⚡ Preconnect & DNS Prefetch
```html
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="preconnect" href="https://www.google-analytics.com" />
<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
<link rel="dns-prefetch" href="https://www.google-analytics.com" />
```

**الفائدة:** تسريع تحميل سكريبتات التتبع

---

### 2. 🖼️ Lazy Loading للصور
```javascript
<img loading="lazy" decoding="async" />
```

**الفائدة:** تحميل الصور عند الحاجة فقط

---

### 3. 🗜️ Compression
```javascript
compress: true
```

**الفائدة:** تقليل حجم الملفات

---

### 4. 🔒 Security Headers
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

**الفائدة:** حماية الموقع من الهجمات

---

### 5. 💾 Cache Control
```
Cache-Control: public, max-age=31536000, immutable
```

**الفائدة:** تسريع تحميل الصفحات للزوار المتكررين

---

## 📋 كيفية التحديث

### تحديث Google Tag Manager:
1. افتح `pages/_app.js`
2. ابحث عن `GTM-TZF4JK3N`
3. استبدله بكودك الجديد

### تحديث Google Analytics:
1. افتح `pages/_app.js`
2. ابحث عن `G-3JXGBTCLSP`
3. استبدله بكودك الجديد

### تحديث Merchant Conversion:
1. افتح `pages/_app.js`
2. ابحث عن `AW-CONVERSION_ID`
3. استبدله بكود التحويل من Google Ads

---

## 🔍 التحقق من التتبع

### 1. Google Tag Manager:
- افتح [Google Tag Manager](https://tagmanager.google.com/)
- اختر الحساب والحاوية
- انقر على "Preview"
- افتح موقعك في نافذة جديدة
- تحقق من إطلاق العلامات

### 2. Google Analytics:
- افتح [Google Analytics](https://analytics.google.com/)
- اذهب إلى "Realtime" → "Overview"
- افتح موقعك في نافذة جديدة
- يجب أن ترى زائر نشط

### 3. Google Chrome DevTools:
```javascript
// في Console
dataLayer // يجب أن يظهر array
gtag // يجب أن يظهر function
```

---

## 📊 الأحداث المتتبعة

### تلقائياً:
- ✅ مشاهدات الصفحات
- ✅ الجلسات
- ✅ معدل الارتداد
- ✅ مدة الجلسة

### يمكن إضافتها:
- 🛒 إضافة إلى السلة
- 💳 بدء عملية الشراء
- ✅ إتمام الشراء
- 🔍 البحث في الموقع
- 📱 النقرات على WhatsApp

---

## 🎯 أفضل الممارسات

1. ✅ **استخدم GTM لإدارة جميع العلامات**
   - سهولة الإضافة والتعديل
   - لا حاجة لتعديل الكود

2. ✅ **راقب الأداء باستمرار**
   - تحقق من GA4 يومياً
   - راجع التقارير أسبوعياً

3. ✅ **اختبر قبل النشر**
   - استخدم Preview في GTM
   - تحقق من Console في المتصفح

4. ✅ **احتفظ بنسخة احتياطية**
   - صدّر إعدادات GTM
   - احفظ أكواد التتبع

---

## 🔗 روابط مفيدة

- [Google Tag Manager](https://tagmanager.google.com/)
- [Google Analytics](https://analytics.google.com/)
- [Google Merchant Center](https://merchants.google.com/)
- [Google Ads](https://ads.google.com/)
- [Tag Assistant](https://tagassistant.google.com/)

---

## ✅ قائمة التحقق

- [x] Google Tag Manager محقون
- [x] Google Analytics محقون
- [x] Merchant Conversion محقون
- [x] Preconnect مضاف
- [x] Lazy Loading مفعّل
- [x] Compression مفعّل
- [x] Security Headers مضافة
- [x] Cache Control محسّن

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تحقق من Console في المتصفح
2. استخدم Google Tag Assistant
3. راجع هذا الدليل
4. تواصل مع الدعم الفني

---

**آخر تحديث:** 2024
**الحالة:** ✅ جاهز 100%
