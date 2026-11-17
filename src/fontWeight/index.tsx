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
	// @ts-ignore
	useSettings,
	// The control core uses for the block "Appearance" setting; it has no stable export yet.
	// @ts-ignore
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalFontAppearanceControl as FontAppearanceControl,
} from '@wordpress/block-editor';
import { Popover, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { formatName as fontFamilyFormatName } from '../fontFamily';

import './editor.css';

// Material Symbols Outlined: line_weight
const fontWeightIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
		<Path d="M120-160v-40h720v40H120Zm0-120v-80h720v80H120Zm0-160v-120h720v120H120Zm0-200v-160h720v160H120Z" />
	</SVG>
);

export const formatName = 'inline-typography-controls/font-weight';

export const settings = {
	title: __( 'Font weight' ),
	tagName: 'span',
	className: 'has-inline-font-weight',
	interactive: false,
	object: false,
	name: formatName,
	attributes: {
		style: 'style',
		inlineFontWeight: 'data-inline-font-weight',
	},
	edit: Edit,
} as const;

type Attributes = { [ K in keyof typeof settings.attributes ]: string };

type FontFamilyDefinition = {
	slug: string;
	fontFamily: string;
	fontFace?: unknown[];
};

// Makes a `font-family` value comparable: computed styles and theme.json differ in quoting and spacing.
function normalizeFontFamily( fontFamily: string ) {
	return fontFamily
		.split( ',' )
		.map( ( name ) =>
			name
				.trim()
				.replace( /^["']|["']$/g, '' )
				.toLowerCase()
		)
		.join( ',' );
}

// @ts-ignore
function Edit( { isActive, onChange, value, contentRef } ) {
	const [ isPopoverVisible, setIsPopoverVisible ] = useState( false );
	const togglePopover = () => {
		setIsPopoverVisible( ( state ) => ! state );
	};
	return (
		<>
			<RichTextToolbarButton
				icon={ fontWeightIcon }
				title={ settings.title }
				onClick={ togglePopover }
				isActive={ isActive }
				role="menuitemcheckbox"
			/>
			{ isPopoverVisible && (
				<InlineFontWeightUI
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

type InlineFontWeightUIProps = {
	value: RichTextValue;
	contentRef: RefObject< HTMLElement >;
	onChange: ( value: RichTextValue ) => void;
	onClose: () => void;
	isActive: boolean;
};

function InlineFontWeightUI( {
	value,
	contentRef,
	onChange,
	onClose,
	isActive,
}: InlineFontWeightUIProps ) {
	const [ customFontFamilies, themeFontFamilies, defaultFontFamilies ] =
		useSettings(
			'typography.fontFamilies.custom',
			'typography.fontFamilies.theme',
			'typography.fontFamilies.default'
		);
	const fontFamilies: FontFamilyDefinition[] = [
		...( customFontFamilies ?? [] ),
		...( themeFontFamilies ?? [] ),
		...( defaultFontFamilies ?? [] ),
	];

	const activeInlineFontWeightFormat = getActiveFormat( value, formatName );
	// @ts-ignore
	const attributes = activeInlineFontWeightFormat?.attributes as
		Partial< Attributes > | undefined;
	const activeFontWeight = attributes?.inlineFontWeight;

	// The font family in effect for the selection: the inline Font Family format if there is
	// one, otherwise whatever the block renders with (its own setting or an inherited one).
	// Its font faces limit the weights on offer, as they do for the block setting.
	const inlineFontFamilySlug = // @ts-ignore
		getActiveFormat( value, fontFamilyFormatName )?.attributes
			?.inlineFontFamily;
	const contentElement = contentRef.current;
	const renderedFontFamily = contentElement
		? normalizeFontFamily(
				contentElement.ownerDocument.defaultView?.getComputedStyle(
					contentElement
				).fontFamily ?? ''
			)
		: '';
	const activeFontFamily = inlineFontFamilySlug
		? fontFamilies.find( ( { slug } ) => slug === inlineFontFamilySlug )
		: fontFamilies.find(
				( { fontFamily } ) =>
					normalizeFontFamily( fontFamily ) === renderedFontFamily
			);

	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		// @ts-ignore
		settings: { ...settings, isActive },
	} );

	const onChangeFontWeight = ( { fontWeight }: { fontWeight?: string } ) => {
		if ( ! fontWeight ) {
			onChange( removeFormat( value, formatName ) );
		} else {
			// @ts-ignore
			onChange(
				applyFormat( value, {
					type: formatName,
					// @ts-ignore
					attributes: {
						inlineFontWeight: fontWeight,
						style: `font-weight: ${ fontWeight };`,
					},
				} )
			);
		}
	};

	return (
		<Popover
			anchor={ popoverAnchor }
			onClose={ onClose }
			className="inline-typography-controls-font-weight-popover"
		>
			<FontAppearanceControl
				__next40pxDefaultSize
				hasFontStyles={ false }
				fontFamilyFaces={ activeFontFamily?.fontFace }
				value={ { fontStyle: undefined, fontWeight: activeFontWeight } }
				onChange={ onChangeFontWeight }
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
