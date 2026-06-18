import { __ } from '@wordpress/i18n';
import { toggleFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { info } from '@wordpress/icons';

export const formatName = 'inline-typography-controls/small';

export const settings = {
	title: __( 'Side comment', 'inline-typography-controls' ),
	tagName: 'small',
	className: null,
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
				icon={ info }
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
