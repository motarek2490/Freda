import React, { useMemo } from 'react';
import { InvitationTemplateProps } from '../model/templateContract';
import { getLazyTemplate } from '../registry/templateRegistry';
import { TemplateErrorBoundary } from './TemplateErrorBoundary';

export const LayoutLoadingFallback: React.FC = () => (
  <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-[#0E0E0E] text-[#C9A86A]">
    <div className="flex flex-col items-center gap-2">
      <div className="w-6 h-6 border-2 border-[#C9A86A]/20 border-t-[#C9A86A] rounded-full animate-spin" />
      <span className="text-[10px] font-mono tracking-widest uppercase">FRIDA ATELIER</span>
    </div>
  </div>
);

interface InvitationEngineProps {
  layoutType: string;
  props: InvitationTemplateProps;
}

export const InvitationEngine: React.FC<InvitationEngineProps> = ({ layoutType, props }) => {
  const LazyComponent = useMemo(() => getLazyTemplate(layoutType), [layoutType]);

  return (
    <TemplateErrorBoundary templateId={layoutType} fallbackProps={props}>
      <React.Suspense fallback={<LayoutLoadingFallback />}>
        <LazyComponent {...props} />
      </React.Suspense>
    </TemplateErrorBoundary>
  );
};
