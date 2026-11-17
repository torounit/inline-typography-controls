import { type RefObject, useState } from 'react';
import {
	removeFormat,
	applyFormat,
	useAnchor,
	getActiveFormat,
} from '@wordpress/rich-text';
import type { RichTextValue } from '@wordpress/rich-text';
import { SVG, Path } from '@wordpress/primitives';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { Popover, SelectControl, Button } from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';

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

const FONT_WEIGHTS = [
	{ name: _x( 'Thin', 'font weight' ), value: '100' },
	{ name: _x( 'Extra Light', 'font weight' ), value: '200' },
	{ name: _x( 'Light', 'font weight' ), value: '300' },
	{ name: _x( 'Regular', 'font weight' ), value: '400' },
	{ name: _x( 'Medium', 'font weight' ), value: '500' },
	{ name: _x( 'Semi Bold', 'font weight' ), value: '600' },
	{ name: _x( 'Bold', 'font weight' ), value: '700' },
	{ name: _x( 'Extra Bold', 'font weight' ), value: '800' },
	{ name: _x( 'Black', 'font weight' ), value: '900' },
];

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
	const activeInlineFontWeightFormat = getActiveFormat( value, formatName );
	// @ts-ignore
	const attributes = activeInlineFontWeightFormat?.attributes as
		Partial< Attributes > | undefined;
	const activeFontWeight = attributes?.inlineFontWeight ?? '';

	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		// @ts-ignore
		settings: { ...settings, isActive },
	} );

	const onChangeFontWeight = ( fontWeight: string ) => {
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
			<SelectControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ settings.title }
				value={ activeFontWeight }
				options={ [
					{ label: __( 'Default' ), value: '' },
					...FONT_WEIGHTS.map( ( fontWeight ) => ( {
						label: `${ fontWeight.name } (${ fontWeight.value })`,
						value: fontWeight.value,
					} ) ),
				] }
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
