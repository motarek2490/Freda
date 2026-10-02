import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { InvitationTemplateProps } from '../model/templateContract';
import { logger } from '../../../shared/utils/logger';

interface Props {
  children: React.ReactNode;
  templateId?: string;
  fallbackProps?: InvitationTemplateProps;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Isolated Error Boundary per Template.
 * If a single template throws during render, only this template shows a controlled fallback UI with retry.
 * The overall application, navbar, music, and modals continue to function properly.
 */
export class TemplateErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'Unknown template rendering error',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Isolated error caught inside TemplateErrorBoundary', {
      templateId: this.props.templateId,
      componentStack: errorInfo.componentStack,
    }, error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      const isRtl = this.props.fallbackProps?.isRtl ?? true;
      const customColors = this.props.fallbackProps?.customColors || {
        bg: '#171717',
        cardBg: '#1f1e1b',
        text: '#F7F4EE',
        accent: '#B99A65',
      };

      return (
        <div
          className="max-w-xl mx-auto p-8 rounded-3xl border shadow-2xl text-center space-y-6 animate-in fade-in"
          style={{
            backgroundColor: customColors.cardBg,
            borderColor: `${customColors.accent}50`,
            color: customColors.text,
          }}
        >
          <div
            className="w-14 h-14 rounded-full mx-auto flex items-center justify-center border"
            style={{
              backgroundColor: `${customColors.accent}20`,
              borderColor: customColors.accent,
            }}
          >
            <AlertCircle className="w-7 h-7" style={{ color: customColors.accent }} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold">
              {isRtl ? 'حدث خطأ غير متوقع أثناء عرض هذا التصميم' : 'Unexpected error loading this invitation layout'}
            </h3>
            <p className="text-xs opacity-70">
              {isRtl
                ? 'تم عزل الخطأ بأمان داخل هذا القالب، يمكنك إعادة المحاولة فوراً.'
                : 'The error was isolated safely within this template. You can retry immediately.'}
            </p>
          </div>

          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: customColors.accent,
              color: '#171717',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isRtl ? 'إعادة تحميل القالب' : 'Retry Layout'}</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
