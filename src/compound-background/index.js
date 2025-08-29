import classnames from 'classnames';

import { backgroundAttributes } from './attributes';
import { BackgroundControl } from './controls/background-control';
import { MobileBackgroundControl } from './controls/mobile-background-control';
import { getBackgroundStyle, getMobileBackgroundStyle, getMobileBackgroundClassNames } from './helpers';

const { addFilter, applyFilters } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { InspectorControls } = wp.blockEditor;

/**
 * List any blocks that should use this by default here. Directions below on
 * how to do this from the theme js.
 */
const BLOCKS = [
	'core/group',
	'core/columns',
	'core/column',
	'core/cover',
];

/**
 * This function is used to determine if the block should use this Control or
 * not. By filtering hasBackgroundControl from within the theme js, you can
 * add this to your block without having to touch the plugin script.
 * @param {string} name
 */
const isBlockWithBackground = name => {
	return applyFilters('hasBackgroundControl', BLOCKS.includes(name), name);
}

/**
 * Here we add a filter for blocks.registerBlockType. If the block is one with
 * background settings, use the spread operator to merge the Background
 * attributes into the block’s attributes.
 *
 * @see https://developer.wordpress.org/block-editor/developers/filters/block-filters/#blocks-registerblocktype
 */
addFilter(
	'blocks.registerBlockType',
	'background',
	(settings, name) => {
		if (!isBlockWithBackground(name)) {
			return settings;
		}

		return {
			...settings,
			attributes: {
				...settings.attributes,
				...backgroundAttributes,
			},
		};
	}
);

/**
 * Filter on blocks.getSaveContent.extraProps to parse the Background
 * attributes and pass them into the style for the block's save output
 *
 * @see https://developer.wordpress.org/block-editor/developers/filters/block-filters/#blocks-getsavecontent-extraprops
 */
addFilter(
	'blocks.getSaveContent.extraProps',
	'background',
	(props, blockType, attributes) => {
		if (!isBlockWithBackground(blockType.name)) {
			return props;
		}

		const ret = {
			...props,
			className: classnames(
				props.className,
				getMobileBackgroundClassNames(attributes)
			),
			style: {
				...props.style,
				...getBackgroundStyle(attributes),
				...getMobileBackgroundStyle(attributes),
			},
		};

		return ret;
	}
);

/**
 * Filter on editor.BlockEdit to add the BackgroundControl component to the
 * InspectorControls for blocks that have a background
 *
 * @see https://developer.wordpress.org/block-editor/developers/filters/block-filters/#editor-blockedit
 */
addFilter(
	'editor.BlockEdit',
	'background',
	createHigherOrderComponent((BlockEdit) => (props) => {
		if (!isBlockWithBackground(props.name)) {
			return <BlockEdit {...props} />;
		}

		const blockEditProps = {
			...props,
			className: classnames(
				props.className,
				getMobileBackgroundClassNames(props.attributes)
			),
			style: {
				...props.style,
				...getBackgroundStyle(props.attributes),
				...getMobileBackgroundStyle(props.attributes),
			},
		};

		return (
			<>
				<BlockEdit {...blockEditProps} />
				<InspectorControls>
					<BackgroundControl {...props} />
					<MobileBackgroundControl {...props} />
				</InspectorControls>
			</>
		);
	})
);

/**
 * Filter on editor.BlockListBlock to parse the Background props into a style
 * for the block output in the editor
 *
 * @see https://developer.wordpress.org/block-editor/developers/filters/block-filters/#editor-blocklistblock
 */
addFilter(
	'editor.BlockListBlock',
	'background',
	createHigherOrderComponent((BlockListBlock) => (props) => {
		const { name } = props;

		if (!isBlockWithBackground(name)) {
			return <BlockListBlock {...props} />;
		}

		const blockListProps = {
			...props,
			className: classnames(
				props.className,
				getMobileBackgroundClassNames(props.attributes)
			),
			wrapperProps: {
				...props.wrapperProps,
				style: {
					...props.wrapperProps?.style,
					...getBackgroundStyle(props.attributes),
					...getMobileBackgroundStyle(props.attributes),
				}
			}
		}

		return (
			<BlockListBlock {...blockListProps} />
		);
	})
);
