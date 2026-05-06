# পরিকল্পনা: Atom-এর জায়গায় "Helpful Resources & Tips"

সাইডবারের **Atom** ট্যাব সরিয়ে ওখানে একটি নতুন বিভাগ আসবে — **"হেল্পফুল রিসোর্স ও টিপস"** (আইকন: Lightbulb, লেবেল: `Tips`, বাংলায় `টিপস ও রিসোর্স`)। সব ব্যবহারকারী পোস্টগুলো পড়তে পারবে, কিন্তু **শুধু আপনি (অ্যাপ মালিক)** নতুন পোস্ট/টিপ যোগ, এডিট, ডিলিট করতে পারবেন।

## ফিচার

- পোস্ট কার্ডের মতো ফিড (নতুন আগে): প্রতিটিতে **শিরোনাম, বাংলা বিবরণ, অপশনাল রিসোর্স লিংক (ক্লিকেবল), ক্যাটেগরি ট্যাগ, তারিখ**।
- ক্যাটেগরি ফিল্টার: পড়াশোনা, মোটিভেশন, টুলস, পরীক্ষা প্রস্তুতি, অন্যান্য।
- শুধু মালিকের জন্য:
  - উপরে "+ নতুন টিপ যোগ করুন" বাটন → ডায়লগ (শিরোনাম, বিবরণ Textarea, লিংক URL ঐচ্ছিক, ক্যাটেগরি)।
  - প্রতিটি কার্ডে hover-এ এডিট/ডিলিট আইকন।
- লিংক সম্বলিত পোস্টে ছোট লিংক প্রিভিউ চিপ (ডোমেইন + ExternalLink আইকন)।
- পুরোপুরি বাংলা UI।

## অ্যাডমিন (মালিক) সুরক্ষা

নিরাপদভাবে role-based অ্যাক্সেস:

1. নতুন enum `app_role` (`admin`, `user`)।
2. নতুন টেবিল `user_roles (user_id, role)` — RLS সহ।
3. SECURITY DEFINER ফাংশন `has_role(_user_id, _role)`।
4. আপনার `user_id`-কে এককালীন `admin` হিসাবে seed করা হবে (আপনি লগইন থাকা ইমেইল কনফার্ম করতে বলব মাইগ্রেশনের আগে)।
5. ফ্রন্টএন্ডে `useIsAdmin()` হুক — শুধু `true` হলে এডিটিং UI দেখাবে।

## ডেটাবেস: নতুন টেবিল `tips`

| কলাম | টাইপ | নোট |
|---|---|---|
| id | uuid PK | |
| title | text | বাধ্যতামূলক |
| content | text | বাংলা বিবরণ |
| link_url | text | ঐচ্ছিক |
| category | text | default `study` |
| created_by | uuid | admin user_id |
| created_at / updated_at | timestamptz | |

RLS:
- SELECT: সবাই (authenticated) — সবার কাছে পড়ার জন্য খোলা।
- INSERT/UPDATE/DELETE: শুধু `has_role(auth.uid(), 'admin')`।

## ফাইল পরিবর্তন

- নতুন: `src/components/tips/TipsView.tsx`, `TipCard.tsx`, `AddTipDialog.tsx`, `EditTipDialog.tsx`, `src/hooks/useIsAdmin.ts`, `src/hooks/useTips.ts`।
- এডিট: `src/components/layout/AppSidebar.tsx` — `atom` আইটেম সরিয়ে `tips` (icon: Lightbulb) যোগ।
- এডিট: `src/components/layout/MobileNav.tsx` (যদি atom থাকে)।
- এডিট: `src/pages/Index.tsx` — `case 'atom'` সরিয়ে `case 'tips': return <TipsView />`।
- ডিলিট: `src/components/atom/*`, `src/data/elements.ts` (আর প্রয়োজন নেই; three.js/recharts অন্যত্র ব্যবহৃত হলে dependency রাখা হবে, না হলে সরানো হবে)।

## আপনাকে যা করতে হবে

মাইগ্রেশনের আগে আমাকে বলুন **আপনি যে ইমেইলে অ্যাপে লগইন করেন** সেটি — যাতে আপনার অ্যাকাউন্টে `admin` role seed করতে পারি। অনুমোদন দিলে আমি বিল্ড মোডে এগিয়ে যাব।
