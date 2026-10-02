import React from 'react';
import { CurtainCinematicIntro } from '../../../../components/intros/CurtainCinematicIntro';
import { TemplateOpeningScreenProps } from '../../model/templateContract';

export const CinematicOpeningScreen: React.FC<TemplateOpeningScreenProps> = (props) => {
  return <CurtainCinematicIntro {...props} />;
};
