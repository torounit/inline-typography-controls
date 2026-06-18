import { __ } from '@wordpress/i18n';
import { toggleFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { square } from '@wordpress/icons';

import './style.css';

export const formatName = 'inline-typography-controls/inline-block';

export const settings = {
	title: __( 'Inline Block' ),
	tagName: 'span',
	className: 'has-inline-block',
	interactive: false,
	object: false,
	name: formatName,
	edit: Edit,
};

// @ts-ignore
function Edit( { isActive, onChange, value } ) {
	return (
		<>
			<RichTextToolbarButton
				icon={ square }
				title={ settings.title }
				onClick={ () =>
					onChange( toggleFormat( value, { type: formatName } ) )
				}
				isActive={ isActive }
				role="menuitemcheckbox"
			/>
		</>
	);
}
