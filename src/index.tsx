import { registerFormatType } from '@wordpress/rich-text';

import * as fontSize from './fontSize';
import * as fontFamily from './fontFamily';
import * as inlineBlock from './inlineBlock';
import * as small from './small';

registerFormatType( fontSize.formatName, fontSize.settings );
registerFormatType( fontFamily.formatName, fontFamily.settings );
registerFormatType( inlineBlock.formatName, inlineBlock.settings );
registerFormatType( small.formatName, small.settings );
