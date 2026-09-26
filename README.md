# FRIDA — دعوات رقمية فاخرة لكل لحظة تستحق أن تُروى

> منصة عربية لإنشاء دعوات إلكترونية تفاعلية للأفراح والخطوبة والمناسبات، بتصاميم جاهزة قابلة للتخصيص الكامل، ومشاركة فورية عبر واتساب ورابط مباشر.

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%7C%20Auth%20%7C%20Functions-FFCA28?logo=firebase&logoColor=black)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-Private-lightgrey)

---

## 📖 نظرة عامة

**FRIDA** منصة SaaS بتسمح لأي حد يصمم دعوة إلكترونية احترافية لمناسبته (فرح، خطوبة، عيد ميلاد، تخرج، مناسبات شركات) في دقائق، بدون أي خبرة تقنية. الضيف بيستقبل رابط دعوة تفاعلي كامل بدل الصورة أو الفيديو التقليدي — فيه عدّاد تنازلي، موسيقى، خريطة، تأكيد حضور (RSVP)، وحتى إمكانية ترك أمنية للعروسين.

بُنيت المنصة بالكامل بالعربية أولًا (RTL) مع دعم كامل للإنجليزية.

---

## ✨ أهم المزايا

- 🎨 **أكثر من 40 قالب تصميم** جاهز عبر فئات متعددة (فخم، عصري، بوهيمي، سينمائي، زهور، مرح...)، كل تصميم له شاشة "فتح ظرف" وصوت افتتاح مخصص.
- 💌 **دعوة تفاعلية بالكامل**: عدّاد تنازلي، برنامج زمني للمناسبة، معرض صور، موسيقى خلفية، خرائط جوجل.
- ✅ **تأكيد حضور (RSVP)** وحائط أمنيات للضيوف.
- 💳 **نظام طلبات وباقات** بالدفع اليدوي (فودافون كاش/تحويل بنكي) مع لوحة أدمن للمراجعة والموافقة.
- 🖼️ **كرت دعوة مصور** قابل للطباعة والمشاركة، مع رمز QR يُولَّد محليًا (بدون أي اعتماد على خدمة خارجية).
- 🌐 **متعدد اللغة بالكامل** (عربي/إنجليزي) مع دعم RTL أصيل.
- 📱 **PWA** — قابل للتثبيت كتطبيق على الموبايل.
- 🔐 **لوحة تحكم أدمن** لإدارة الطلبات، الدعوات، القوالب، الإعدادات، والمراجعات.
- 🏠 **بوابة مضيف (Host Portal)** لصاحب الدعوة لمتابعة الحضور والردود بعد النشر مباشرة.

---

## 🛠️ التقنيات المستخدمة

| الطبقة | التقنية |
|---|---|
| الواجهة الأمامية | React 19 + TypeScript + Vite 8 |
| التصميم | Tailwind CSS v4 |
| الحركة والرسوم | GSAP، Framer Motion |
| قاعدة البيانات والمصادقة | Firebase (Firestore، Authentication، Cloud Functions، Storage) |
| الاستضافة | Cloudflare Workers |
| اختبارات قواعد الأمان | Vitest + @firebase/rules-unit-testing |
| أدوات إضافية | qrcode (توليد QR محلي)، lamejs (ضغط صوتي)، browser-image-compression (ضغط صور من المتصفح) |

---

## 📂 هيكل المشروع (مختصر)

```
Vowly-main/
├── src/
│   ├── components/
│   │   ├── InvitationLayouts/     # كل تصميم دعوة = ملف مستقل
│   │   ├── InvitationBuilder/     # واجهة إنشاء وتخصيص الدعوة
│   │   ├── admin/                 # مكونات لوحة الأدمن
│   │   └── ...
│   ├── data/
│   │   ├── templates.ts           # بيانات القوالب الجاهزة
│   │   └── translations.ts        # نصوص الترجمة عربي/إنجليزي
│   ├── lib/
│   │   ├── firebase.ts            # تهيئة Firebase
│   │   ├── firestoreService.ts    # التعامل مع Firestore
│   │   ├── security.ts            # منطق مصادقة الأدمن
│   │   └── qrHelper.ts            # توليد QR محلي
│   ├── types.ts                   # كل الأنواع (TypeScript types)
│   └── worker.ts                  # منطق Cloudflare Worker (توجيه /i/*, /portal/*)
├── functions/src/index.ts         # Cloud Functions (تسجيل دخول الأدمن، الموافقة على الطلبات...)
├── firestore.rules                # قواعد أمان Firestore
├── storage.rules                  # قواعد أمان Firebase Storage
├── tests/firestore.rules.test.ts  # اختبارات آلية لقواعد الأمان
├── scripts/                       # سكريبتات صيانة (تعيين صلاحية الأدمن، الترحيل...)
├── SECURITY.md                    # توثيق سياسات الأمان الكاملة
└── wrangler.jsonc                 # إعداد النشر على Cloudflare Workers
```

---

## 🚀 التشغيل محليًا

### المتطلبات
- Node.js 20 أو أحدث
- حساب Firebase (خطة Blaze مفعّلة، لأن المشروع يستخدم Cloud Functions من الجيل الثاني)
- Wrangler CLI لو هتنشر على Cloudflare

### الخطوات

```bash
# 1. استنساخ المشروع
git clone <رابط-المستودع>
cd Vowly-main

# 2. تثبيت الحزم
npm install

# 3. انسخ ملف البيئة واملأ القيم الحقيقية
cp .env.example .env
# افتح .env واملأ متغيرات Firebase الخاصة بمشروعك

# 4. شغّل بيئة التطوير
npm run dev
```

الموقع هيفتح على `http://localhost:3000`.

---

## 📜 الأوامر المتاحة (Scripts)

| الأمر | الوظيفة |
|---|---|
| `npm run dev` | تشغيل خادم التطوير المحلي |
| `npm run build` | بناء نسخة الإنتاج (`dist/`) |
| `npm run test` | تشغيل كل الاختبارات (Vitest) |
| `npm run test:rules` | تشغيل اختبارات قواعد Firestore فقط |
| `npm run lint` | فحص الأنواع بـ TypeScript بدون بناء |
| `npm run ci` | فحص شامل (lint + build) قبل أي نشر |
| `npm run deploy` | بناء ونشر على Cloudflare Workers مباشرة |
| `npm run preview` | معاينة نسخة الإنتاج محليًا عبر Wrangler |
| `npm run clean` | حذف مخرجات البناء |

---

## 🔑 متغيرات البيئة

راجع `.env.example` للقائمة الكاملة. أهمها:

| المتغير | الوصف |
|---|---|
| `VITE_ADMIN_PASSWORD` | **لا يُستخدم في الإنتاج** — الأدمن الحقيقي يُدار عبر Firebase Auth + Custom Claims (راجع `SECURITY.md`) |
| Firebase config (`apiKey`, `projectId`...) | من `firebase-applet-config.json` أو لوحة تحكم Firebase مباشرة |

---

## ☁️ النشر (Deployment)

الترتيب مهم — راجع `SECURITY.md` للتفاصيل الكاملة، لكن باختصار:

```bash
# 1. نشر الدوال الخلفية
cd functions && npm install && firebase deploy --only functions

# 2. نشر قواعد الأمان (Firestore + Storage) والفهارس
firebase deploy --only firestore:rules,firestore:indexes,storage:rules

# 3. بناء ونشر الواجهة الأمامية على Cloudflare Workers
npm run deploy

# 4. تعيين صلاحية الأدمن الحقيقي (مرة واحدة فقط، بعد إنشاء الحساب)
npx tsx scripts/set-admin-claim.ts
```

> ⚠️ لا تنشر أبدًا بدون تشغيل `npm run test:rules` أولًا للتأكد من سلامة قواعد الأمان.

---

## 🔐 الأمان

المشروع بيتبع نموذج **Zero-Trust ABAC** في قواعد Firestore/Storage:
- كل عملية كتابة بتتحقق من الحقول والقيم المسموحة (`hasOnly`).
- الأدمن بيتحقق من هويته عبر Firebase Auth + Custom Claims، مش عبر أي باسورد مكتوب في الكود.
- كلمات المرور (لأصحاب الدعوات) بتتشفر بـ scrypt مع مقارنة زمنية آمنة (timing-safe).
- تفاصيل كاملة وسياسة الإبلاغ عن ثغرات في [`SECURITY.md`](./SECURITY.md).

---

## 🤝 المساهمة

المشروع حاليًا خاص (Private). لو عندك صلاحية وصول وحابب تساهم:
1. اعمل فرع جديد (`git checkout -b feature/اسم-الميزة`)
2. تأكد إن `npm run ci` بينجح قبل أي Pull Request
3. أي تعديل على `firestore.rules` أو `storage.rules` **لازم** يترفق باختبار جديد في `tests/`

---

## 📄 الرخصة

كل الحقوق محفوظة © FRIDA. هذا مستودع خاص وغير مرخّص للاستخدام العام حاليًا.

---

<div align="center">
صُنع في مصر 🇪🇬 — وصُمم للحظات التي لا تُنسى.
</div>
