import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { Category, Language } from '../types';
import { useTranslation } from '../data/translations';

interface CategoryGridProps {
  currentLang: Language;
  onSelectCategory: (category: Category) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ currentLang, onSelectCategory }) => {
  const t = useTranslation(currentLang);

  const categories = [
    {
      id: 'weddings' as Category,
      title: t.categories.weddings,
      image: '/images/samples/royal_invitation_mockup_1790456589429.jpg',
      count: '11 Suites',
    },
    {
      id: 'engagements' as Category,
      title: t.categories.engagements,
      image: '/images/samples/engagement_invitation_mockup_1790456600087.jpg',
      count: '3 Designs',
    },
    {
      id: 'birthdays' as Category,
      title: t.categories.birthdays,
      image: '/images/samples/baby_shower_mockup_1790456718080.jpg',
      count: 'Celebrations',
    },
    {
      id: 'baby_showers' as Category,
      title: t.categories.baby_showers,
      image: '/images/samples/baby_shower_mockup_1790456718080.jpg',
      count: 'Pastel Suite',
    },
    {
      id: 'royal' as Category,
      title: 'الملكي الفاخر',
      image: '/images/samples/baroque_gold_mockup_1790456610620.jpg',
      count: 'Haute Couture',
    },
    {
      id: 'minimal' as Category,
      title: 'مينيمال كلاسيكي',
      image: '/images/samples/minimalist_invitation_mockup_1790456623950.jpg',
      count: 'Modern',
    },
  ];

  return (
    <section id="categories" className="py-20 bg-[#171717] text-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12 pb-6 border-b border-[#B99A65]/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1f1e1b] border border-[#B99A65]/30 text-[#B99A65] text-xs font-semibold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.nav.categories}</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold">
              {currentLang === 'en' ? 'Explore by Occasion' : 'تصنيفات المناسبات'}
            </h2>
          </div>
          <p className="text-xs text-[#8D8A84] max-w-md">
            {currentLang === 'en'
              ? 'Find tailored digital invitation suites designed specifically for your event’s atmosphere and scale.'
              : 'اختر الطراز المناسب لأجواء مناسبتكم من بين مجموعات إبداعية متكاملة.'}
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-[#333] hover:border-[#B99A65] transition-all duration-500"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/40 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
                <div>
                  <span className="text-[10px] text-[#B99A65] uppercase tracking-widest font-semibold block mb-1">
                    {cat.count}
                  </span>
                  <h3 className="font-playfair text-xl font-bold text-[#F7F4EE] group-hover:text-[#B99A65] transition-colors">
                    {cat.title}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#171717]/80 border border-[#B99A65]/40 flex items-center justify-center text-[#B99A65] group-hover:bg-[#B99A65] group-hover:text-[#171717] transition-all">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
