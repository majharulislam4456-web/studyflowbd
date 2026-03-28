import { useState } from 'react';
import { Settings, Clock, Volume2, Bell, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGlobalPomodoro } from '@/contexts/PomodoroContext';
import { cn } from '@/lib/utils';

export function PomodoroSettings() {
  const { language } = useLanguage();
  const { focusDuration, setFocusDuration, settings, updateSettings } = useGlobalPomodoro();
  const isBn = language === 'bn';
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-muted-foreground hover:text-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 space-y-5">
          {/* Timer Section */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              <Clock className="w-3.5 h-3.5" />
              {isBn ? 'টাইমার' : 'Timer'}
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium">{isBn ? 'সময় (মিনিট)' : 'Time (minutes)'}</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">{isBn ? 'পমোডোরো' : 'Pomodoro'}</span>
                  <Input
                    type="number"
                    min={5}
                    max={120}
                    value={focusDuration}
                    onChange={e => setFocusDuration(Math.max(5, Math.min(120, parseInt(e.target.value) || 25)))}
                    className="text-center h-9"
                  />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">{isBn ? 'শর্ট ব্রেক' : 'Short Break'}</span>
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    value={settings.breakDuration}
                    onChange={e => updateSettings({ breakDuration: Math.max(1, Math.min(30, parseInt(e.target.value) || 5)) })}
                    className="text-center h-9"
                  />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">{isBn ? 'লং ব্রেক' : 'Long Break'}</span>
                  <Input
                    type="number"
                    min={5}
                    max={60}
                    value={settings.longBreakDuration}
                    onChange={e => updateSettings({ longBreakDuration: Math.max(5, Math.min(60, parseInt(e.target.value) || 15)) })}
                    className="text-center h-9"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm">{isBn ? 'অটো স্টার্ট ব্রেক' : 'Auto Start Breaks'}</span>
              <Switch
                checked={settings.autoStartBreaks}
                onCheckedChange={v => updateSettings({ autoStartBreaks: v })}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm">{isBn ? 'অটো স্টার্ট পমোডোরো' : 'Auto Start Pomodoros'}</span>
              <Switch
                checked={settings.autoStartPomodoros}
                onCheckedChange={v => updateSettings({ autoStartPomodoros: v })}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm">{isBn ? 'লং ব্রেক ইন্টারভ্যাল' : 'Long Break interval'}</span>
              <Input
                type="number"
                min={2}
                max={10}
                value={settings.sessionsBeforeLongBreak}
                onChange={e => updateSettings({ sessionsBeforeLongBreak: Math.max(2, Math.min(10, parseInt(e.target.value) || 4)) })}
                className="w-16 text-center h-8"
              />
            </div>
          </div>

          <Separator />

          {/* Sound Section */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              <Volume2 className="w-3.5 h-3.5" />
              {isBn ? 'সাউন্ড' : 'Sound'}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{isBn ? 'অ্যালার্ম সাউন্ড' : 'Alarm Sound'}</span>
              <Select value={settings.alarmSound} onValueChange={v => updateSettings({ alarmSound: v })}>
                <SelectTrigger className="w-28 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="bell">Bell</SelectItem>
                  <SelectItem value="chime">Chime</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{isBn ? 'ভলিউম' : 'Volume'}</span>
                <span>{settings.volume}%</span>
              </div>
              <Slider
                value={[settings.volume]}
                onValueChange={v => updateSettings({ volume: v[0] })}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          <Separator />

          {/* Notification */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              <Bell className="w-3.5 h-3.5" />
              {isBn ? 'নোটিফিকেশন' : 'Notification'}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{isBn ? 'ব্রাউজার নোটিফিকেশন' : 'Browser Notification'}</span>
              <Switch
                checked={settings.browserNotification}
                onCheckedChange={v => updateSettings({ browserNotification: v })}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
