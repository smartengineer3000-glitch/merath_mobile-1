# دليل البناء والاختبار في GitHub Codespaces

## حاسبة المواريث الشرعية (تطبيق جوال)

---

## 🚀 الخطوة 1: التحضير الأولي

### 1.1 التحقق من البيئة

```bash
# التحقق من إصدار Node.js
node --version

# التحقق من إصدار npm
npm --version

# التحقق من إصدار Git
git --version
```

### 1.2 تثبيت المكتبات

```bash
# تثبيت جميع المكتبات المطلوبة
npm install

# تثبيت EAS CLI (إذا لم يكن مثبتاً)
npm install -g eas-cli

# التحقق من تثبيت EAS
eas --version
```

---

## 🔍 الخطوة 2: التحقق من جودة الكود

### 2.1 التحقق من TypeScript

```bash
# التحقق من عدم وجود أخطاء TypeScript
npx tsc --noEmit

# إذا كانت النتيجة "0 errors" - ممتاز! ✅
```

### 2.2 تشغيل الاختبارات

```bash
# تشغيل جميع اختبارات الوحدة
npm run test

# تشغيل الاختبارات مع مراقبة التغييرات (watch mode)
npm run test -- --watch

# تشغيل الاختبارات مع تقرير التغطية
npm run test -- --coverage
```

### 2.3 فحص الثغرات الأمنية

```bash
# فحص الثغرات الأمنية
npm audit

# محاولة إصلاح الثغرات تلقائياً (بحذر)
npm audit fix

# إصلاح الثغرات بقوة (قد يغير الإصدارات)
npm audit fix --force
```

### 2.4 بناء الخادم

```bash
# بناء خادم Node.js
npm run build

# التحقق من ملف البناء
ls -lh dist/index.js
```

---

## 📦 الخطوة 3: التحقق من الملفات المطلوبة

### 3.1 التحقق من ملفات التكوين

```bash
# التحقق من وجود جميع ملفات التكوين
echo "=== ملفات التكوين ===" && \
ls -lh app.config.ts eas.json tsconfig.json vitest.config.ts package.json

# التحقق من محتوى app.config.ts
echo "=== اسم التطبيق ===" && \
grep "appName\|appSlug" app.config.ts
```

### 3.2 التحقق من الأيقونات والصور

```bash
# التحقق من وجود جميع الأيقونات المطلوبة
echo "=== الأيقونات المطلوبة ===" && \
ls -lh assets/images/icon.png \
       assets/images/splash-icon.png \
       assets/images/favicon.png \
       assets/images/android-icon-*.png

# عرض حجم الأيقونات
du -sh assets/images/
```

### 3.3 التحقق من الملفات الأساسية

```bash
# التحقق من وجود محرك الحساب
echo "=== ملفات المشروع الأساسية ===" && \
ls -lh lib/inheritance-calculator.ts \
       lib/logger.ts \
       lib/error-handler.ts \
       __tests__/inheritance-calculator.test.ts
```

---

## 🧪 الخطوة 4: اختبارات شاملة

### 4.1 اختبار البناء الكامل

```bash
# بناء المشروع بالكامل
npm run build

# التحقق من نجاح البناء
echo "✅ البناء نجح!" || echo "❌ البناء فشل!"
```

### 4.2 اختبار التطبيق محلياً

```bash
# بدء خادم التطوير (Metro Bundler)
npm run dev:metro

# في نافذة طرفية أخرى، بدء خادم الويب
npm run dev:web

# في نافذة طرفية ثالثة، بدء خادم Node.js
npm run dev:server
```

### 4.3 فحص الأداء

```bash
# التحقق من حجم node_modules
du -sh node_modules/

# عرض حجم الملفات الكبيرة
du -sh node_modules/* | sort -rh | head -20

# التحقق من حجم المشروع
du -sh .
```

---

## 🔐 الخطوة 5: التحقق من الأمان

### 5.1 فحص console statements

```bash
# البحث عن console statements في الكود الإنتاجي
echo "=== console statements ===" && \
grep -r "console\." app/ lib/ components/ hooks/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l

# عرض مواقع console statements
grep -r "console\." app/ lib/ components/ hooks/ --include="*.tsx" --include="*.ts" 2>/dev/null | head -20
```

### 5.2 فحص استخدام any في TypeScript

```bash
# البحث عن استخدام any
echo "=== استخدام any في TypeScript ===" && \
grep -r ": any\|as any" app/ lib/ components/ hooks/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l
```

### 5.3 فحص الثغرات المعروفة

```bash
# فحص شامل للثغرات
npm audit --json | jq '.vulnerabilities'

# عرض الثغرات بصيغة مقروءة
npm audit
```

---

## 📊 الخطوة 6: إحصائيات المشروع

### 6.1 عد أسطر الكود

```bash
# عد إجمالي أسطر الكود
echo "=== إحصائيات الكود ===" && \
find app lib components hooks __tests__ -name "*.ts" -o -name "*.tsx" | xargs wc -l | tail -1

# عد أسطر الكود في كل مجلد
echo "=== أسطر الكود حسب المجلد ===" && \
for dir in app lib components hooks __tests__; do
  count=$(find $dir -name "*.ts" -o -name "*.tsx" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')
  echo "$dir: $count سطر"
done
```

### 6.2 عد الملفات

```bash
# عد ملفات TypeScript
echo "=== عدد الملفات ===" && \
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | wc -l

# عرض توزيع الملفات
echo "=== توزيع الملفات ===" && \
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | cut -d'/' -f2 | sort | uniq -c | sort -rn
```

---

## 🏗️ الخطوة 7: بناء APK

### 7.1 تسجيل الدخول إلى Expo

```bash
# تسجيل الدخول إلى Expo (إذا لم تكن مسجل دخول)
eas login

# التحقق من تسجيل الدخول
eas whoami
```

### 7.2 بناء APK للتطوير

```bash
# بناء APK للتطوير (سريع، بدون توقيع)
eas build --platform android --profile development

# متابعة حالة البناء
eas build --status

# تحميل APK المبني
# سيتم إعطاؤك رابط لتحميل APK
```

### 7.3 بناء APK للإنتاج

```bash
# بناء APK للإنتاج (موقع، جاهز للنشر)
eas build --platform android --profile production

# متابعة حالة البناء
eas build --status

# تحميل APK المبني
# سيتم إعطاؤك رابط لتحميل APK
```

### 7.4 بناء APK محلياً (اختياري)

```bash
# بناء APK محلياً باستخدام Expo
expo build:android

# ملاحظة: قد يتطلب هذا وقتاً طويلاً وموارد كبيرة
```

---

## ✅ الخطوة 8: قائمة التحقق النهائية

### 8.1 قبل البناء

```bash
# تشغيل جميع الفحوصات
echo "=== فحص TypeScript ===" && npx tsc --noEmit && echo "✅ TypeScript OK" || echo "❌ TypeScript FAILED"

echo "=== فحص الاختبارات ===" && npm run test && echo "✅ Tests OK" || echo "❌ Tests FAILED"

echo "=== فحص البناء ===" && npm run build && echo "✅ Build OK" || echo "❌ Build FAILED"

echo "=== فحص الأمان ===" && npm audit && echo "✅ Security OK" || echo "⚠️ Security Issues Found"
```

### 8.2 بعد البناء

```bash
# التحقق من وجود ملف APK
ls -lh *.apk 2>/dev/null || echo "لم يتم العثور على ملف APK محلي"

# التحقق من حجم APK
echo "=== حجم APK ===" && du -sh *.apk 2>/dev/null || echo "لم يتم العثور على ملف APK"
```

---

## 🔧 أوامر مساعدة

### تنظيف وإعادة تعيين

```bash
# حذف node_modules وإعادة تثبيت
rm -rf node_modules package-lock.json && npm install

# حذف ملفات البناء
rm -rf dist build .expo

# تنظيف الـ cache
npm cache clean --force

# إعادة تعيين كاملة
git clean -fd && git reset --hard HEAD
```

### معلومات مفيدة

```bash
# عرض معلومات المشروع
cat package.json | jq '.name, .version, .description'

# عرض إصدارات المكتبات الرئيسية
npm ls react react-native expo @trpc/server

# عرض آخر تحديثات
git log --oneline -10

# عرض حالة Git
git status
```

---

## 📝 ملاحظات مهمة

1. **تأكد من الاتصال بالإنترنت**: جميع الأوامر تتطلب اتصالاً مستقراً بالإنترنت
2. **استخدم Node.js 18+**: تأكد من أن لديك إصدار حديث من Node.js
3. **احفظ بيانات اعتماد Expo**: احفظ بيانات اعتماد Expo في مكان آمن
4. **راقب حالة البناء**: يمكنك متابعة حالة البناء عبر `eas build --status`
5. **تحقق من المتطلبات**: تأكد من استيفاء جميع المتطلبات قبل البناء

---

## 🆘 استكشاف الأخطاء

### إذا فشل البناء

```bash
# حذف cache وإعادة محاولة
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

### إذا فشلت الاختبارات

```bash
# تشغيل الاختبارات مع التفاصيل
npm run test -- --reporter=verbose

# تشغيل اختبار واحد فقط
npm run test -- inheritance-calculator
```

### إذا حدثت مشاكل في TypeScript

```bash
# إعادة تشغيل خادم TypeScript
pkill -f "typescript" || true

# إعادة بناء TypeScript
npx tsc --noEmit --listFiles
```

---

**تم الإعداد:** 7 يناير 2026
**الحالة:** ✅ جاهز للبناء والاختبار
