import { createClient } from "https://esm.sh/@supabase/supabase-js@2.93.3";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code || code.length < 4 || code.length > 10) {
      return new Response(JSON.stringify({ error: "Invalid code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Look up share code
    const { data: shareData, error: shareError } = await supabase
      .from("parent_share_codes")
      .select("user_id, is_active")
      .eq("share_code", code.toUpperCase())
      .single();

    if (shareError || !shareData || !shareData.is_active) {
      return new Response(JSON.stringify({ error: "Invalid or inactive code" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = shareData.user_id;

    // Get student profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, avatar_url, student_class, division, dream")
      .eq("user_id", userId)
      .single();

    // Today's date boundaries (UTC)
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

    // Week start (Saturday)
    const dayOfWeek = now.getDay();
    const satOffset = dayOfWeek >= 6 ? dayOfWeek - 6 : dayOfWeek + 1;
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - satOffset);
    const weekStartISO = weekStart.toISOString();

    // Fetch data in parallel
    const [sessionsRes, todosRes, subjectsRes, allSessionsRes] = await Promise.all([
      // Today's sessions
      supabase
        .from("study_sessions")
        .select("duration, subject_id, session_date")
        .eq("user_id", userId)
        .gte("session_date", todayStart)
        .lt("session_date", todayEnd),
      // Todos
      supabase
        .from("todos")
        .select("title, title_bn, is_completed, priority, due_date")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20),
      // Subjects with syllabus progress
      supabase
        .from("subjects")
        .select("id, name, name_bn, color, completed_chapters, total_chapters")
        .eq("user_id", userId),
      // All sessions for week + streak calculation (last 30 days)
      supabase
        .from("study_sessions")
        .select("duration, session_date, subject_id")
        .eq("user_id", userId)
        .gte("session_date", new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order("session_date", { ascending: false }),
    ]);

    const todaySessions = sessionsRes.data || [];
    const todos = todosRes.data || [];
    const subjects = subjectsRes.data || [];
    const allSessions = allSessionsRes.data || [];

    // Calculate today's study time
    const todayStudyMinutes = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    // Calculate week study time
    const weekSessions = allSessions.filter(s => new Date(s.session_date) >= weekStart);
    const weekStudyMinutes = weekSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    // Calculate streak
    let streak = 0;
    const dateSet = new Set<string>();
    allSessions.forEach(s => {
      const d = new Date(s.session_date);
      dateSet.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    
    const checkDate = new Date(now);
    // Check if studied today, if not start from yesterday
    const todayKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
    if (!dateSet.has(todayKey)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    for (let i = 0; i < 30; i++) {
      const key = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
      if (dateSet.has(key)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Syllabus progress
    const totalChapters = subjects.reduce((sum, s) => sum + s.total_chapters, 0);
    const completedChapters = subjects.reduce((sum, s) => sum + s.completed_chapters, 0);
    const syllabusProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

    // Today's subjects studied
    const subjectMap = new Map(subjects.map(s => [s.id, s]));
    const todaySubjects = [...new Set(todaySessions.map(s => s.subject_id).filter(Boolean))].map(id => {
      const sub = subjectMap.get(id!);
      return sub ? { name: sub.name, name_bn: sub.name_bn, color: sub.color } : null;
    }).filter(Boolean);

    // Todo stats
    const todosCompleted = todos.filter(t => t.is_completed).length;
    const todosTotal = todos.length;

    const result = {
      student: {
        name: profile?.display_name || "Student",
        avatar_url: profile?.avatar_url,
        class: profile?.student_class,
        division: profile?.division,
        dream: profile?.dream,
      },
      today: {
        studyMinutes: todayStudyMinutes,
        subjects: todaySubjects,
        sessionCount: todaySessions.length,
      },
      week: {
        studyMinutes: weekStudyMinutes,
      },
      streak,
      syllabus: {
        progress: syllabusProgress,
        completedChapters,
        totalChapters,
      },
      todos: {
        completed: todosCompleted,
        total: todosTotal,
        items: todos.slice(0, 10),
      },
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
