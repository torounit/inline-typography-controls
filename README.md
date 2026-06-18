# Inline Typography Controls

Contributors:      Toro_Unit,hamworks 
Donate link:       https://www.paypal.me/torounit
Tags:              Typography, Font Size, Font Family
Requires at least: 6.7 
Tested up to:      7.0 
Requires PHP:      8.1 
Stable tag:        0.4.8
License:           GPLv3 or later 
License URI:       https://www.gnu.org/licenses/gpl-3.0.html

Add inline typography controls to the block editor toolbar, letting you apply formatting to selected text without wrapping it in a block.

## Description

This plugin adds extra controls to the rich text formatting toolbar (the popup toolbar shown when you select text inside a block). Each control wraps the selected text in an inline element, similar to Bold or Italic, so you can mix formatting within a single paragraph or heading.

Github: https://github.com/torounit/inline-typography-controls

### Controls

* **Font Size** — Apply an inline font size to the selected text. Choose from the font size presets defined in your theme's `theme.json`, or pick a custom value with the slider.
* **Font Family** — Apply an inline font family to the selected text, chosen from the font family presets defined in your theme's `theme.json`.
* **Inline Block** — Wrap the selected text in an inline-block element (`display: inline-block`), which is useful for keeping a phrase from breaking across lines.
* **Small** — Wrap the selected text in a `<small>` tag, useful for side comments and supplementary text such as captions or fine print.

## Screenshots

1. Applying an inline font size to selected text using the theme's font size presets.

## Credits

The Font Size toolbar button icon is based on the "format_size" icon from [Material Symbols](https://fonts.google.com/icons) by Google, licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

## Changelog

### Unreleased

* Add a Font Family control, letting you apply an inline font family from your theme's `theme.json` presets.
* Show the Font Size control as a direct toolbar button instead of inside the "More" dropdown.
* Use a Material Symbols "format_size" icon for the Font Size button.
* Relicense the plugin from GPLv2 or later to GPLv3 or later.

### 0.4.8

* Tested up to WordPress 7.0
