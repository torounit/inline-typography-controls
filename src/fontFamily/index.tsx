import { type RefObject, useState } from 'react';
import {
	removeFormat,
	applyFormat,
	useAnchor,
	getActiveFormat,
} from '@wordpress/rich-text';
import type { RichTextValue } from '@wordpress/rich-text';
import { typography } from '@wordpress/icons';
import {
	RichTextToolbarButton,
	// @ts-ignore
	useSettings,
} from '@wordpress/block-editor';
import { Popover, SelectControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import './editor.css';

export const formatName = 'inline-typography-controls/font-family';

export const settings = {
	title: __( 'Font family' ),
	tagName: 'span',
	className: 'has-inline-font-family',
	interactive: false,
	object: false,
	name: formatName,
	attributes: {
		style: 'style',
		inlineFontFamily: 'data-inline-font-family',
	},
	edit: Edit,
} as const;

type Attributes = { [ K in keyof typeof settings.attributes ]: string };

type FontFamilyDefinition = {
	name?: string;
	slug: string;
	fontFamily: string;
};

// @ts-ignore
function Edit( { isActive, onChange, value, contentRef } ) {
	const [ isPopoverVisible, setIsPopoverVisible ] = useState( false );
	const togglePopover = () => {
		setIsPopoverVisible( ( state ) => ! state );
	};
	return (
		<>
			<RichTextToolbarButton
				icon={ typography }
				title={ settings.title }
				onClick={ togglePopover }
				isActive={ isActive }
				role="menuitemcheckbox"
			/>
			{ isPopoverVisible && (
				<InlineFontFamilyUI
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

type InlineFontFamilyUIProps = {
	value: RichTextValue;
	contentRef: RefObject< HTMLElement >;
	onChange: ( value: RichTextValue ) => void;
	onClose: () => void;
	isActive: boolean;
};

function InlineFontFamilyUI( {
	value,
	contentRef,
	onChange,
	onClose,
	isActive,
}: InlineFontFamilyUIProps ) {
	const [ customFontFamilies, themeFontFamilies, defaultFontFamilies ] =
		useSettings(
			'typography.fontFamilies.custom',
			'typography.fontFamilies.theme',
			'typography.fontFamilies.default'
		);

	function getMergedFontFamilies(): FontFamilyDefinition[] {
		return [
			...( customFontFamilies ?? [] ),
			...( themeFontFamilies ?? [] ),
			...( defaultFontFamilies ?? [] ),
		];
	}

	const fontFamilies = getMergedFontFamilies();

	const activeInlineFontFamilyFormat = getActiveFormat( value, formatName );
	// @ts-ignore
	const attributes = activeInlineFontFamilyFormat?.attributes as
		| Partial< Attributes >
		| undefined;
	const activeFontFamily = attributes?.inlineFontFamily ?? '';

	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		// @ts-ignore
		settings: { ...settings, isActive },
	} );

	const onChangeFontFamily = ( slug: string ) => {
		const fontFamilyDefinition = fontFamilies.find(
			( fontFamily ) => fontFamily.slug === slug
		);
		if ( ! fontFamilyDefinition ) {
			onChange( removeFormat( value, formatName ) );
		} else {
			// @ts-ignore
			onChange(
				applyFormat( value, {
					type: formatName,
					// @ts-ignore
					attributes: {
						inlineFontFamily: fontFamilyDefinition.slug,
						style: `font-family: ${ fontFamilyDefinition.fontFamily };`,
					},
				} )
			);
		}
	};

	return (
		<Popover
			anchor={ popoverAnchor }
			onClose={ onClose }
			className="inline-typography-controls-font-family-popover"
		>
			<SelectControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ settings.title }
				value={ activeFontFamily }
				options={ [
					{ label: __( 'Default' ), value: '' },
					...fontFamilies.map( ( fontFamily ) => ( {
						label: fontFamily.name ?? fontFamily.slug,
						value: fontFamily.slug,
					} ) ),
				] }
				onChange={ onChangeFontFamily }
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
