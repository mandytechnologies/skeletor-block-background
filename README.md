# Skeletor Block Background
Add a Background Settings control to InspectorControls for any Block! Set a custom background image, size, repeat, and position directly into the Block’s style attribute.

## v0.9.999.1 : Bugfix
Fixed a bug in the destructureColor helper function where it would fail if the color input was using uppercase.

## NEW in v0.9.999 : Layered Backgrounds!
, Skeletor Block Background will allow multiple background images, including gradients and solid colors with an alpha channel. All of which can be independently sized/positioned/etc.

## How to Use
In your Skeletor Theme’s **admin** js file, use the [WordPress Hooks api](https://developer.wordpress.org/block-editor/packages/packages-hooks/) addFilter method to filter on **hasBackgroundControl**. Your filter callback will receive two arguments, the current result and a blockName. Return whether or not you want this block to have background controls.

**Example: Adding Background controls to “My Block”**
```js
const { addFilter } = wp.hooks;

addFilter('hasBackgroundControl', 'mandy.hasBackgroundControl', (result, blockName) => {
	const blocksWithBackground = [
		'acf/my-block',
	];

	return result || blocksWithBackground.includes(blockName);
});
```
*Skeletor Blocks are registered through ACF, so they'll always have that `acf/` prefix*

**Example: Adding Background controls to ALL Blocks**
```js
const { addFilter } = wp.hooks;

addFilter('hasBackgroundControl', 'mandy.hasBackgroundControl', (result, blockName) => true);
```
