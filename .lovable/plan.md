## Owner Dashboard (Secret) — শুধু আপনার জন্য

একটি গোপন owner dashboard যোগ করব যা **শুধু admin role** এর user দেখতে পাবে (আপনি)। অন্য কেউ URL জানলেও access পাবে না — RLS দিয়ে protected।

### Access
- **URL:** `/owner` — sidebar এ কোনো link নেই, শুধু আপনি জানবেন।
- Non-admin হলে auto redirect → `/`।

### Features

**1. User Management**
- সব registered user এর তালিকা: display name, email, signup date, last active
- প্রতি user এর study stats: মোট session, hours, streak
- Search ও filter

**2. App-Wide Theme Control (সব user দেখবে)**
- Festival/দিবস theme switcher: ঈদুল ফিতর, ঈদুল আজহা, স্বাধীনতা দিবস (২৬ মার্চ), বিজয় দিবস (১৬ ডিসেম্বর), পহেলা বৈশাখ, শহীদ দিবস (২১ ফেব্রুয়ারি), মহররম, শবে বরাত, ডিফল্ট
- প্রতিটি theme এর নিজস্ব color palette + banner message + emoji decoration
- আপনি toggle করলে সব user এর app এ instantly apply হবে (real-time)

**3. App Announcement / Broadcast**
- সব user এর dashboard এর top এ একটা banner notification পাঠানো (Bengali title + content + optional link)
- Active/inactive toggle, expiry date

**4. Feature Flags (পরে আর বলতে হবে না)**
- Toggle করতে পারবেন: Quotes section on/off, Tips section on/off, AI Assistant on/off, Pomodoro on/off — সব user এর জন্য
- এতে নতুন feature বানানো ছাড়াই অনেক control পাবেন

**5. Stats Overview**
- Total users, active today/week, total study hours app-wide, popular subjects

### Database Changes

**New table `app_settings`** (single row, admin-only write, public read):
- `active_theme` (text) — কোন festival theme active
- `announcement_title`, `announcement_content`, `announcement_link`, `announcement_active`, `announcement_expires_at`
- `features` (jsonb) — `{ quotes: true, tips: true, ai: true, pomodoro: true }`

**RLS:**
- SELECT: সবাই পড়তে পারবে (theme/announcement সব user দেখবে)
- INSERT/UPDATE/DELETE: শুধু admin

**Edge Function `admin-list-users`** (verify_jwt + admin role check):
- Service role দিয়ে `auth.users` থেকে email + metadata fetch করে user list return করবে। Client থেকে সরাসরি `auth.users` access করা যায় না, তাই edge function লাগবে।

### Files

**New:**
- `src/pages/OwnerDashboard.tsx` — main hidden dashboard
- `src/components/owner/UserListPanel.tsx`
- `src/components/owner/ThemeControlPanel.tsx`
- `src/components/owner/AnnouncementPanel.tsx`
- `src/components/owner/FeatureFlagsPanel.tsx`
- `src/components/owner/StatsOverviewPanel.tsx`
- `src/components/AnnouncementBanner.tsx` — সব user এর top এ show হবে
- `src/hooks/useAppSettings.ts` — real-time subscribe to app_settings
- `src/lib/festivalThemes.ts` — theme palette definitions
- `supabase/functions/admin-list-users/index.ts`

**Edited:**
- `src/App.tsx` — `/owner` route যোগ
- `src/pages/Index.tsx` — AnnouncementBanner mount + festival theme apply

### Theme Palettes (sample)
```text
ঈদুল ফিতর:   সবুজ + সোনালি, চাঁদ-তারা decoration
ঈদুল আজহা:    গভীর সবুজ + brown
২৬ মার্চ:      লাল-সবুজ, পতাকার gradient
১৬ ডিসেম্বর:    লাল-সবুজ + বিজয় emoji
পহেলা বৈশাখ:   লাল-সাদা, আলপনা pattern
২১ ফেব্রুয়ারি:  কালো-সাদা, শহীদ মিনার
```

### Security
- Owner dashboard route client-side admin check + server-side RLS double protection
- Edge function admin role verify করবে before user list return
- Festival theme শুধু CSS variable override, কোনো sensitive data না

আপনি approve করলে migration + code একসাথে implement করব।