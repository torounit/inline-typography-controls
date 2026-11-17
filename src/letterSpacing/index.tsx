import { type RefObject, useState } from 'react';
import {
	removeFormat,
	applyFormat,
	useAnchor,
	getActiveFormat,
} from '@wordpress/rich-text';
import type { RichTextValue } from '@wordpress/rich-text';
import { SVG, Path } from '@wordpress/primitives';
import {
	RichTextToolbarButton,
	// There is no stable unit-aware input yet; this is the control core uses for block letter spacing.
	// @ts-ignore
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalLetterSpacingControl as LetterSpacingControl,
} from '@wordpress/block-editor';
import { Popover, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import './editor.css';

// Material Symbols Outlined: format_letter_spacing
const letterSpacingIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
		<Path d="M320-80 160-240l160-160 57 56-64 64h334l-63-64 56-56 160 160L640-80l-57-56 64-64H313l63 64-56 56ZM200-480v-400h80v400h-80Zm240 0v-400h80v400h-80Zm240 0v-400h80v400h-80Z" />
	</SVG>
);

export const formatName = 'inline-typography-controls/letter-spacing';

export const settings = {
	title: __( 'Letter spacing' ),
	tagName: 'span',
	className: 'has-inline-letter-spacing',
	interactive: false,
	object: false,
	name: formatName,
	attributes: {
		style: 'style',
		inlineLetterSpacing: 'data-inline-letter-spacing',
	},
	edit: Edit,
} as const;

type Attributes = { [ K in keyof typeof settings.attributes ]: string };

// @ts-ignore
function Edit( { isActive, onChange, value, contentRef } ) {
	const [ isPopoverVisible, setIsPopoverVisible ] = useState( false );
	const togglePopover = () => {
		setIsPopoverVisible( ( state ) => ! state );
	};
	return (
		<>
			<RichTextToolbarButton
				icon={ letterSpacingIcon }
				title={ settings.title }
				onClick={ togglePopover }
				isActive={ isActive }
				role="menuitemcheckbox"
			/>
			{ isPopoverVisible && (
				<InlineLetterSpacingUI
					isActive={ isActive }
					value={ value }
					onChange={ onChange }
					onClose={ togglePopover }
					contentRef={ contentRef }
				/>
			) }
		</>
	);
}

type InlineLetterSpacingUIProps = {
	value: RichTextValue;
	contentRef: RefObject< HTMLElement >;
	onChange: ( value: RichTextValue ) => void;
	onClose: () => void;
	isActive: boolean;
};

function InlineLetterSpacingUI( {
	value,
	contentRef,
	onChange,
	onClose,
	isActive,
}: InlineLetterSpacingUIProps ) {
	const activeInlineLetterSpacingFormat = getActiveFormat(
		value,
		formatName
	);
	// @ts-ignore
	const attributes = activeInlineLetterSpacingFormat?.attributes as
		Partial< Attributes > | undefined;
	const activeLetterSpacing = attributes?.inlineLetterSpacing ?? '';

	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		// @ts-ignore
		settings: { ...settings, isActive },
	} );

	const onChangeLetterSpacing = ( letterSpacing: string | undefined ) => {
		// An empty input, or a bare unit without a number, clears the format.
		if ( ! letterSpacing || Number.isNaN( parseFloat( letterSpacing ) ) ) {
			onChange( removeFormat( value, formatName ) );
		} else {
			// @ts-ignore
			onChange(
				applyFormat( value, {
					type: formatName,
					// @ts-ignore
					attributes: {
						inlineLetterSpacing: letterSpacing,
						style: `letter-spacing: ${ letterSpacing };`,
					},
				} )
			);
		}
	};

	return (
		<Popover
			anchor={ popoverAnchor }
			onClose={ onClose }
			className="inline-typography-controls-letter-spacing-popover"
		>
			<LetterSpacingControl
				__next40pxDefaultSize
				__unstableInputWidth="100%"
				value={ activeLetterSpacing }
				onChange={ onChangeLetterSpacing }
			/>
			<div style={ { marginTop: '16px', display: 'flex' } }>
				<Button
					onClick={ () => {
						onChange( removeFormat( value, formatName ) );
					} }
					variant="tertiary"
					style={ { marginLeft: 'auto' } }
				>
					{ __( 'Clear' ) }
				</Button>
			</div>
		</Popover>
	);
}
