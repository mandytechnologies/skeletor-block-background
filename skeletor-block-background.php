<?php

namespace Mandy;

/**
 * Plugin Name:           QB - Block Settings — Background
 * Plugin URI:            https://github.com/mandytechnologies/skeletor-block-background
 * Description:           Adds support for a block custom compound background
 * Version:               1.0.2
 * Requires PHP:          7.0
 * Requires at least:     6.1.0
 * Tested up to:          6.8.2
 * Author:                Quick Build
 * Author URI:            https://www.quickbuildwebsite.com/
 * License:               GPLv2 or later
 * License URI:           https://www.gnu.org/licenses/
 * Text Domain:           qb-block-settings-background
 * 
*/

// Exit if accessed directly
if (!defined('ABSPATH')) {
	exit;
}


/**
 * Enable Background Settings for blocks.
 */

use Asset_Enqueuer; // Needed for get_site_info()
class SkeletorBlockBackground {
	/**
	 * Called on `after_setup_theme`
	 *
	 * Bind actions here
	 *
	 * @return void
	 */
	public static function setup() {
		\add_action('wp_enqueue_scripts', [__CLASS__, 'enqueue_frontend_assets']);
		\add_action('enqueue_block_editor_assets', [__CLASS__, 'enqueue_block_editor_assets']);
	}

	/**
	 * Called on `wp_enqueue_scripts`
	 *
	 * Enqueue any front end assets needed for this plugin
	 *
	 * @return void
	 */
	public static function enqueue_frontend_assets() {
		self::_enqueue_frontend_styles();
	}

	/**
	 * a singular function for enqueuing the front-end CSS
	 * needed for base styling of this plugin
	 *
	 * @return void
	 */
	private static function _enqueue_frontend_styles() {
		$fileslug = 'frontend'; // the asset name without the extension
		$asset = self::_get_build_asset_file($fileslug);
		if (!$asset) {
			return;
		}

		$url_base = \plugin_dir_url(__FILE__);
		wp_enqueue_style(
			'skeletor_block_background_frontend',
			sprintf('%sbuild/%s.css', $url_base, $fileslug),
			[],
			$asset['version'],
		);
	}

	/**
	 * Called on `enqueue_block_editor_assets`
	 *
	 * Enqueue the plugin frontend script in the block editor
	 *
	 * @return void
	 */
	public static function enqueue_block_editor_assets() {
		if (!$screen = get_current_screen()) {
			return;
		}

		if (!$screen->is_block_editor) {
			return;
		}

		$fileslug = 'backend'; // the asset name without the extension
		$asset = self::_get_build_asset_file($fileslug);
		if (!$asset) {
			return;
		}

		$url_base = \plugin_dir_url(__FILE__);
		\wp_enqueue_script(
			'skeletor_block_background_backend',
			sprintf('%sbuild/%s.js', $url_base, $fileslug),
			$asset['dependencies'],
			$asset['version'],
			true
		);
		wp_enqueue_style(
			'skeletor_block_background_backend',
			sprintf('%sbuild/%s.css', $url_base, $fileslug),
			[],
			$asset['version'],
		);

		self::_enqueue_frontend_styles();
	}

	/**
	 * helper for retrieving the asset file data
	 *
	 * @param string $basename the part of the filename that comes before asset.php
	 * @return null|array
	 */
	protected static function _get_build_asset_file($basename) {
		$directory = \plugin_dir_path(__FILE__);
		$filepath = sprintf('%sbuild/%s.asset.php', $directory, $basename);
		if (!file_exists($filepath)) {
			error_log(sprintf('could not include script file %s as it does not exist', $filepath));
			return;
		}

		$asset = require_once($filepath);
		if (!$asset) {
			return;
		}

		return $asset;
	}
}

add_action('after_setup_theme', ['\Mandy\SkeletorBlockBackground', 'setup']);

define('MANDY_BLOCK_BACKGROUND_VERSION', '1.0.2');

require 'plugin-update-checker/plugin-update-checker.php';

$update_checker = \Puc_v4_Factory::buildUpdateChecker(
	'https://github.com/mandytechnologies/skeletor-block-background',
	__FILE__,
	'skeletor-block-background'
);

require_once( 'includes/class-plugin.php' );