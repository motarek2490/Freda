import React from 'react';
import { ButterflyIntro } from '../../../../components/intros/ButterflyIntro';
import { TemplateOpeningScreenProps } from '../../model/templateContract';

export const ButterflyOpeningScreen: React.FC<TemplateOpeningScreenProps> = (props) => {
  return <ButterflyIntro {...props} />;
};
