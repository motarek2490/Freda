import React from 'react';
import { InvitationData } from '../types';
import { IntroRouter } from './intros/IntroRouter';

interface ThemeEnvelopeScreenProps {
  invitation: InvitationData;
  guestNameParam: string | null;
  isRtl: boolean;
  onOpen: () => void;
}

export const ThemeEnvelopeScreen: React.FC<ThemeEnvelopeScreenProps> = ({
  invitation,
  guestNameParam,
  isRtl,
  onOpen,
}) => {
  return (
    <IntroRouter
      invitation={invitation}
      guestNameParam={guestNameParam}
      isRtl={isRtl}
      onOpen={onOpen}
    />
  );
};
