import React, { useState } from 'react';
import { Clock, Plus, Trash2, Sparkles } from 'lucide-react';
import { TimelineItem, Language } from '../../../types';

interface TimelineTabProps {
  currentLang: Language;
  timeline: TimelineItem[];
  onChangeTimeline: (timeline: TimelineItem[]) => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({
  currentLang,
  timeline,
  onChangeTimeline,
}) => {
  const isRtl = currentLang === 'ar';

  const [timeInput, setTimeInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');

  const handleAddItem = () => {
    if (!titleInput.trim()) return;

    const newItem: TimelineItem = {
      id: 'tl-' + Date.now(),
      time: timeInput.trim() || '08:00 PM',
      title: titleInput.trim(),
      description: descInput.trim() || undefined,
    };

    onChangeTimeline([...timeline, newItem]);
    setTimeInput('');
    setTitleInput('');
    setDescInput('');
  };

  const handleRemoveItem = (id: string) => {
    onChangeTimeline(timeline.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Form to add item */}
      <div className="p-4 bg-[#171717] rounded-2xl border border-[#2E2C28] space-y-4 text-xs">
        <h4 className="font-bold text-[#F7F4EE] flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#B99A65]" />
          <span>{isRtl ? 'إضافة فقرة جديدة في برنامج الحفل:' : 'Add Event Schedule Item:'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-[#8D8A84]">{isRtl ? 'الوقت (الساعة):' : 'Time:'}</label>
            <input
              type="text"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              placeholder="08:00 PM"
              className="w-full bg-[#1F1E1B] border border-[#333] rounded-xl px-3 py-2 text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] text-[#8D8A84]">{isRtl ? 'عنوان الفقرة:' : 'Activity Title:'}</label>
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder={isRtl ? 'مثال: استقبال الضيوف والترحيب' : 'e.g. Welcome & Guest Reception'}
              className="w-full bg-[#1F1E1B] border border-[#333] rounded-xl px-3 py-2 text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="px-4 py-2 rounded-xl bg-[#B99A65] hover:bg-[#d6bd91] text-[#171717] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isRtl ? 'إضافة للجدول' : 'Add to Schedule'}</span>
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-[#F7F4EE]">
          {isRtl ? `فقرات البرنامج المضافة (${timeline.length}):` : `Schedule Items (${timeline.length}):`}
        </label>

        {timeline.length === 0 ? (
          <p className="text-xs text-[#8D8A84] italic">
            {isRtl ? 'لم تتم إضافة فقرات لجدول الحفل بعد.' : 'No schedule items added yet.'}
          </p>
        ) : (
          <div className="space-y-2">
            {timeline.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-[#171717] rounded-xl border border-[#333] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-[#242424] text-[#B99A65] font-mono font-bold text-[11px]">
                    {item.time}
                  </span>
                  <div>
                    <h5 className="font-bold text-[#F7F4EE]">{item.title}</h5>
                    {item.description && <p className="text-[11px] text-[#8D8A84]">{item.description}</p>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
