import { registerFormatType } from '@wordpress/rich-text';

import * as fontSize from './fontSize';
import * as fontFamily from './fontFamily';
import * as fontWeight from './fontWeight';
import * as letterSpacing from './letterSpacing';
import * as inlineBlock from './inlineBlock';
import * as small from './small';

registerFormatType( fontSize.formatName, fontSize.settings );
registerFormatType( fontFamily.formatName, fontFamily.settings );
registerFormatType( fontWeight.formatName, fontWeight.settings );
registerFormatType( letterSpacing.formatName, letterSpacing.settings );
registerFormatType( inlineBlock.formatName, inlineBlock.settings );
registerFormatType( small.formatName, small.settings );
