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
	BlockControls,
	// @ts-ignore
	useSettings,
} from '@wordpress/block-editor';
import {
	Popover,
	FontSizePicker,
	Button,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import './editor.css';

export const formatName = 'inline-typography-controls/font-size';

export const settings = {
	title: __( 'Font size' ),
	tagName: 'span',
	className: 'has-inline-font-size',
	interactive: false,
	object: false,
	name: formatName,
	attributes: {
		style: 'style',
		inlineFontSize: 'data-inline-font-size',
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
			<BlockControls group="other">
				<ToolbarGroup>
					<ToolbarButton
						icon={ typography }
						title={ settings.title }
						onClick={ togglePopover }
						isActive={ isActive }
					/>
				</ToolbarGroup>
			</BlockControls>
			{ isPopoverVisible && (
				<InlineFontSizeUI
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

type InlineFontSizeUIProps = {
	value: RichTextValue;
	contentRef: RefObject< HTMLElement >;
	onChange: ( value: RichTextValue ) => void;
	onClose: () => void;
	isActive: boolean;
};

function InlineFontSizeUI( {
	value,
	contentRef,
	onChange,
	onClose,
	isActive,
}: InlineFontSizeUIProps ) {
	const [
		defaultFontSizesEnabled,
		customFontSizes,
		defaultFontSizes,
		themeFontSizes,
		customFontSize,
	] = useSettings(
		'typography.defaultFontSizes',
		'typography.fontSizes.custom',
		'typography.fontSizes.default',
		'typography.fontSizes.theme',
		'typography.customFontSize'
	);

	function getMergedFontSizes() {
		return [
			...( customFontSizes ?? [] ),
			...( themeFontSizes ?? [] ),
			...( defaultFontSizesEnabled ? defaultFontSizes ?? [] : [] ),
		];
	}

	const activeInlineFontSizeFormat = getActiveFormat( value, formatName );
	// @ts-ignore
	const attributes = activeInlineFontSizeFormat?.attributes as
		| Partial< Attributes >
		| undefined;
	const activeFontSize = attributes?.inlineFontSize ?? '';

	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		// @ts-ignore
		settings: { ...settings, isActive },
	} );

	const onChangeFontSize = ( fontSize: string | number | undefined ) => {
		if ( ! fontSize ) {
			onChange( removeFormat( value, formatName ) );
		} else {
			// @ts-ignore
			onChange(
				applyFormat( value, {
					type: formatName,
					// @ts-ignore
					attributes: {
						inlineFontSize: `${ fontSize }`,
						style: `font-size: ${ fontSize };`,
					},
				} )
			);
		}
	};

	return (
		<Popover
			anchor={ popoverAnchor }
			onClose={ onClose }
			className="inline-typography-controls-font-size-popover"
		>
			<FontSizePicker
				__next40pxDefaultSize
				fontSizes={ getMergedFontSizes() }
				disableCustomFontSizes={ ! customFontSize }
				onChange={ onChangeFontSize }
				value={ activeFontSize }
				withSlider
				withReset={ false }
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
