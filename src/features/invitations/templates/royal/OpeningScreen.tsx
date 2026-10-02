import React from 'react';
import { WaxSealIntro } from '../../../../components/intros/WaxSealIntro';
import { TemplateOpeningScreenProps } from '../../model/templateContract';

export const RoyalOpeningScreen: React.FC<TemplateOpeningScreenProps> = (props) => {
  return <WaxSealIntro {...props} />;
};
