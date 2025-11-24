import React from 'react';
import { registerPoc } from '../registry';
import { DifySouvenirRecommend1 } from './index';

// レジストリに登録（このファイルがimportされた時点で実行される）
registerPoc('dify-souvenir-recommend1', () =>
  React.createElement(DifySouvenirRecommend1)
);

