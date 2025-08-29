import { BackgroundLayerControl } from './background-layer';

const { __ } = wp.i18n;
const { PanelBody, Button } = wp.components;

export const BackgroundControl = (props) => {
	const defaultBackground = [{ layerType: 'image' }];

	const onClickAddLayer = () => {
		const compoundBackground =
			props.attributes.compoundBackground || defaultBackground;
		props.setAttributes({ compoundBackground: [
			...compoundBackground,
			{}
		]});
	}

	const onClickDeleteLayer = (index) => {
		const currentBackground =
			props.attributes.compoundBackground || defaultBackground;
		const compoundBackground = currentBackground.filter((l, n) => n !== index);

		props.setAttributes({ compoundBackground });
	}

	const onClickMoveLayerDown = (index) => {
		const currentBackground =
			props.attributes.compoundBackground || defaultBackground;
		if (index === currentBackground.length - 1) {
			return;
		}

		if (currentBackground.length <= 1) {
			return;
		}

		const moving = Object.assign({}, currentBackground[index]);
		const replacing = Object.assign({}, currentBackground[index + 1]);

		const compoundBackground = currentBackground.map((layer, n) => {
			if (n === index + 1) {
				return moving;
			} else if (n === index) {
				return replacing;
			} else {
				return Object.assign({}, layer);
			}
		});

		props.setAttributes({ compoundBackground });
	}

	const onClickMoveLayerUp = (index) => {
		if (index <= 0) {
			return;
		}

		const currentBackground =
			props.attributes.compoundBackground || defaultBackground;
		if (currentBackground.length <= 1) {
			return;
		}

		const moving = Object.assign({}, currentBackground[index]);
		const replacing = Object.assign({}, currentBackground[index - 1]);

		const compoundBackground = currentBackground.map((layer, n) => {
			if (n === (index - 1)) {
				return moving;
			} else if (n === index) {
				return replacing;
			} else {
				return Object.assign({}, layer);
			}
		});

		props.setAttributes({ compoundBackground });
	};

	const handleLayerChange = (layer, index) => {
		const oldBackground =
			props.attributes.compoundBackground ||
			defaultBackground;
;
		const compoundBackground = oldBackground.map((l, i) =>
			i === index ? layer : l
		);

		props.setAttributes({ compoundBackground });
	}

	const compoundBackground =
		props.attributes.compoundBackground || defaultBackground;
	const wrapperClass = [
		'background-layer-collection'
	];

	let buttonText = __('Add Overlay');

	if (compoundBackground.length === 0) {
		buttonText = __('Add Background');
		wrapperClass.push('no-layers');
	} else if (compoundBackground.length === 1) {
		wrapperClass.push('single-layer');
	} else if (compoundBackground.length > 1) {
		buttonText = __('Add Layer');
		wrapperClass.push('multiple-layers');
	}

	return (
		<PanelBody
			className={'skeletor-inspector-control'}
			title={__('Compound Background')}
			initialOpen={false}
		>
			<div className={wrapperClass.join(' ')}>
				{compoundBackground.map((layer, index) => (
					<BackgroundLayerControl
						index={index}
						layer={layer}
						onLayerChange={(newLayer, index) => {
							handleLayerChange(newLayer, index);
						}}
						onClickDeleteLayer={(index) =>
							onClickDeleteLayer(index)
						}
						onClickMoveLayerUp={(index) =>
							onClickMoveLayerUp(index)
						}
						onClickMoveLayerDown={(index) =>
							onClickMoveLayerDown(index)
						}
					/>
				))}
			</div>
			<Button
				text={buttonText}
				variant="secondary"
				onClick={() => onClickAddLayer(props)}
				isSmall
			/>
		</PanelBody>
	);
};
