import React, { useState } from 'react';
import { LayoutGrid, Plus, Edit2, Copy, Eye, Trash2, CheckCircle2, Shield, Search, Filter } from 'lucide-react';
import { Template, Category, ThemeStyle, Language } from '../types';
import { TEMPLATES } from '../data/templates';
import { useTranslation } from '../data/translations';

interface AdminTemplateManagerProps {
  currentLang: Language;
  onClose: () => void;
  onPreviewTemplate: (template: Template) => void;
  onEditTemplate: (template: Template) => void;
}

export const AdminTemplateManager: React.FC<AdminTemplateManagerProps> = ({
  currentLang,
  onClose,
  onPreviewTemplate,
  onEditTemplate,
}) => {
  const t = useTranslation(currentLang);
  const isRtl = currentLang === 'ar';

  const [templatesList, setTemplatesList] = useState<Template[]>(TEMPLATES);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedTheme, setSelectedTheme] = useState<ThemeStyle | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templatesList.filter((template) => {
    if (selectedCategory !== 'all' && template.category !== selectedCategory) return false;
    if (selectedTheme !== 'all' && template.themeStyle !== selectedTheme) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const titleMatch = template.title[currentLang].toLowerCase().includes(q);
      const descMatch = template.description[currentLang].toLowerCase().includes(q);
      return titleMatch || descMatch;
    }
    return true;
  });

  const handleDuplicateTemplate = (tmpl: Template) => {
    const duplicated: Template = {
      ...tmpl,
      id: `${tmpl.id}-copy-${Date.now()}`,
      title: {
        en: `${tmpl.title.en} (Copy)`,
        ar: `${tmpl.title.ar} (نسخة)`,
      },
      isNew: true,
    };
    setTemplatesList([duplicated, ...templatesList]);
  };

  const handleToggleFeatured = (id: string) => {
    setTemplatesList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFeatured: !t.isFeatured } : t))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#171717] border border-[#B99A65]/40 rounded-3xl overflow-hidden shadow-2xl my-6 flex flex-col max-h-[90vh]">
        
        {/* Admin Header */}
        <div className="bg-[#1F1E1B] border-b border-[#333] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#B99A65]/20 border border-[#B99A65] flex items-center justify-center text-[#B99A65]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-playfair text-xl font-bold text-[#F7F4EE]">
                {isRtl ? 'إدارة القوالب والتصاميم (Admin Suite)' : 'Admin Template Manager'}
              </h2>
              <p className="text-xs text-[#8D8A84]">
                {isRtl ? 'إدارة وإضافة وتخصيص قوالب فريدا الرقمية' : 'Manage, create, and organize FRIDA invitation suites'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#2A2722] border border-[#333] text-xs text-[#F7F4EE] hover:text-[#B99A65] font-semibold"
          >
            {isRtl ? 'إغلاق' : 'Close Admin'}
          </button>
        </div>

        {/* Filter Controls */}
        <div className="bg-[#121212] border-b border-[#333] p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-grow w-full">
            <Search className="w-4 h-4 text-[#B99A65] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'بحث باسم القالب...' : 'Search templates...'}
              className="w-full bg-[#1F1E1B] border border-[#333] rounded-xl pl-10 pr-4 py-2 text-xs text-[#F7F4EE] focus:border-[#B99A65]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-[#B99A65]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category)}
              className="bg-[#1F1E1B] border border-[#333] rounded-xl px-3 py-2 text-xs text-[#F7F4EE]"
            >
              <option value="all">{isRtl ? 'جميع التصنيفات' : 'All Categories'}</option>
              <option value="royal">{t.categories.royal}</option>
              <option value="floral">{t.categories.floral}</option>
              <option value="minimal">{t.categories.minimal}</option>
              <option value="botanical">{t.categories.botanical}</option>
              <option value="boho">{t.categories.boho}</option>
              <option value="cultural">{t.categories.cultural}</option>
              <option value="romantic">{t.categories.romantic}</option>
              <option value="artistic">{t.categories.artistic}</option>
              <option value="birthdays">{t.categories.birthdays}</option>
            </select>
          </div>
        </div>

        {/* Templates Grid List */}
        <div className="p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-[#1F1E1B] border border-[#333] hover:border-[#B99A65]/50 rounded-2xl p-4 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-[#171717]">
                  <img src={tmpl.coverImage} alt={tmpl.title[currentLang]} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="text-[9px] uppercase font-bold tracking-widest bg-black/80 text-[#B99A65] border border-[#B99A65]/30 px-2 py-0.5 rounded-full">
                      {t.categories[tmpl.category]}
                    </span>
                  </div>
                  {tmpl.isFeatured && (
                    <span className="absolute top-2 right-2 text-[9px] uppercase font-bold bg-[#B99A65] text-[#171717] px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <h4 className="font-playfair font-bold text-[#F7F4EE] text-sm">
                  {tmpl.title[currentLang]}
                </h4>
                <p className="text-[11px] text-[#8D8A84] line-clamp-2 mt-1">
                  {tmpl.description[currentLang]}
                </p>
              </div>

              {/* Actions Bar */}
              <div className="pt-3 border-t border-[#333] flex items-center justify-between text-xs">
                <button
                  onClick={() => onPreviewTemplate(tmpl)}
                  className="p-2 rounded-lg bg-[#171717] text-[#B99A65] hover:bg-[#B99A65] hover:text-[#171717] transition-all"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onEditTemplate(tmpl)}
                  className="p-2 rounded-lg bg-[#171717] text-[#F7F4EE] hover:bg-[#B99A65] hover:text-[#171717] transition-all"
                  title="Customize"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDuplicateTemplate(tmpl)}
                  className="p-2 rounded-lg bg-[#171717] text-[#F7F4EE] hover:bg-[#B99A65] hover:text-[#171717] transition-all"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleToggleFeatured(tmpl.id)}
                  className={`p-2 rounded-lg transition-all ${
                    tmpl.isFeatured ? 'bg-[#B99A65] text-[#171717]' : 'bg-[#171717] text-[#8D8A84]'
                  }`}
                  title="Toggle Featured"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
