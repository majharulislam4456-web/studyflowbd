

## Plan: Bug Fixes + UX Improvements for Student Engagement

### Issues Found

**Critical Bugs:**
1. **Textarea component is broken** — `src/components/ui/textarea.tsx` does NOT spread `{...props}`, so `value`, `onChange`, `placeholder`, `rows` are all ignored. This is why study log notes don't save and other textareas malfunction across the entire app.
2. **LiveClock uses `bg-white/8`** — invalid Tailwind class, should be `bg-white/[0.08]`.

**Minor Issues:**
3. Timer settings panel scene selector hidden on mobile — no way to change wallpaper on phone.
4. Todo add dialog requires both English and Bengali title fields — tedious for students.
5. Study Logger form has plain English labels mixed with Bengali — inconsistent UX.
6. No quick-add shortcuts for common tasks (e.g., one-tap subject logging).

---

### Implementation Plan

#### Step 1: Fix Textarea Component (Critical)
**File:** `src/components/ui/textarea.tsx`
- Spread `{...props}` on the `<textarea>` element and remove the hardcoded placeholder.
- This single fix will restore notes in Study Logger, Goal descriptions, and all other text areas.

#### Step 2: Fix LiveClock Invalid Class
**File:** `src/components/timer/LiveClock.tsx`
- Change `bg-white/8` to `bg-white/[0.08]`.

#### Step 3: Make Data Input Less Boring for Students
Reduce friction and add delight:

**A. Quick-add mode for To-Do** (`src/components/todo/TodoList.tsx`)
- Add an inline quick-add input at the top (just type and press Enter) instead of forcing a dialog for every task.
- Auto-detect Bengali text and fill `title_bn` automatically.
- Default priority to "medium", auto-set today's date.

**B. Simplify Study Logger** (`src/components/logger/StudyLoggerPanel.tsx`)
- Add quick-log buttons: "15 min", "30 min", "1 hr" that log instantly with one tap.
- Add emoji reactions after logging (🔥, 💪, 🎯) for gamification.
- Show encouraging streak message ("3 দিন ধরে পড়ছো! 🔥").

**C. Simplify Goal creation** (`src/components/goals/AddGoalDialog.tsx`)
- Add preset goal templates: "পরীক্ষার প্রস্তুতি", "নতুন বিষয় শেখা", "সিলেবাস শেষ করা" — one tap to create.
- Remove the separate Bengali title field (auto-use the main title).

**D. Add Quick Actions to Dashboard** (`src/components/views/DashboardView.tsx`)
- Add a "Quick Actions" strip at top: "📝 Log Study", "⏱️ Start Timer", "✅ Add Task" — one-tap shortcuts.
- Show motivational progress: "আজ ৪৫ মিনিট পড়েছো — আরেকটু!" 

**E. Mobile scene selector** (`src/components/views/TimerView.tsx`)
- Add scene selector inside the Settings panel so mobile users can change wallpaper too.

#### Step 4: Add Micro-animations & Feedback
- Add confetti/celebration animation when completing a goal milestone.
- Add subtle haptic-like visual feedback (scale bounce) on checkbox taps.
- Add progress encouragement toasts based on daily study streaks.

---

### Technical Details

| File | Change |
|------|--------|
| `src/components/ui/textarea.tsx` | Spread `{...props}`, remove hardcoded placeholder |
| `src/components/timer/LiveClock.tsx` | Fix `bg-white/8` → `bg-white/[0.08]` |
| `src/components/todo/TodoList.tsx` | Add inline quick-add input with Enter-to-submit |
| `src/components/logger/StudyLoggerPanel.tsx` | Quick-log buttons, streak display, emoji feedback |
| `src/components/goals/AddGoalDialog.tsx` | Goal templates, simplified form |
| `src/components/views/DashboardView.tsx` | Quick action strip at top |
| `src/components/views/TimerView.tsx` | Scene selector in settings panel for mobile |

