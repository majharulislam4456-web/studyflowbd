import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Loader2, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsOverviewPanel } from '@/components/owner/StatsOverviewPanel';
import { ThemeControlPanel } from '@/components/owner/ThemeControlPanel';
import { AnnouncementPanel } from '@/components/owner/AnnouncementPanel';
import { FeatureFlagsPanel } from '@/components/owner/FeatureFlagsPanel';
import { UserListPanel } from '@/components/owner/UserListPanel';

export default function OwnerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!authLoading && !roleLoading && user && !isAdmin) navigate('/');
  }, [authLoading, roleLoading, user, isAdmin, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-7 h-7 text-primary" />
            <div>
              <h1 className="text-2xl font-bold font-bengali">ওনার ড্যাশবোর্ড</h1>
              <p className="text-xs text-muted-foreground font-bengali">গোপন নিয়ন্ত্রণ প্যানেল — শুধু আপনার জন্য</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')} className="font-bengali">
            <ArrowLeft className="w-4 h-4 mr-1" /> অ্যাপে ফিরুন
          </Button>
        </div>

        <StatsOverviewPanel />

        <div className="grid md:grid-cols-2 gap-4">
          <ThemeControlPanel />
          <AnnouncementPanel />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FeatureFlagsPanel />
          <UserListPanel />
        </div>
      </div>
    </div>
  );
}