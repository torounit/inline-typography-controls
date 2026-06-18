<?php
/**
 * Plugin Name: Inline Typography Controls
 * Description: Add inline typography controls to the editor.
 * Version: 0.4.7
 * Author: Toro_Unit
 * License: GPL-2.0+
 * GitHub Plugin URI: https://github.com/torounit/inline-typography-controls
 * Release Asset: true
 *
 * @package inline-typography-controls
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'enqueue_block_editor_assets',
	function () {

		wp_enqueue_style(
			'inline-typography-controls-editor-styles',
			plugin_dir_url( __FILE__ ) . '/build/index.css',
			array(),
			filemtime( __DIR__ . '/build/index.css' )
		);

		$asset_file = include __DIR__ . '/build/index.asset.php';
		wp_enqueue_script(
			'inline-typography-controls',
			plugin_dir_url( __FILE__ ) . '/build/index.js',
			$asset_file['dependencies'],
			filemtime( __DIR__ . '/build/index.js' ),
			true
		);
	}
);

add_action(
	'enqueue_block_assets',
	function () {
		wp_enqueue_style(
			'inline-typography-controls-styles',
			plugin_dir_url( __FILE__ ) . '/build/style-index.css',
			array(),
			filemtime( __DIR__ . '/build/style-index.css' )
		);
	}
);
