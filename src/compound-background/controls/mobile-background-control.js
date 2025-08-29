import { MobileBackgroundLayerControl } from './mobile-background-layer';

const { __ } = wp.i18n;
const { PanelBody, Button } = wp.components;

export const MobileBackgroundControl = (props) => {
	const defaultBackground = [{ layerType: 'image' }];

	const onClickAddLayer = () => {
		const mobileCompoundBackground =
			props.attributes.mobileCompoundBackground || defaultBackground;
		props.setAttributes({ mobileCompoundBackground: [
			...mobileCompoundBackground,
			{}
		]});
	}

	const onClickDeleteLayer = (index) => {
		const currentBackground =
			props.attributes.mobileCompoundBackground || defaultBackground;
		const mobileCompoundBackground = currentBackground.filter((l, n) => n !== index);

		props.setAttributes({ mobileCompoundBackground });
	}

	const onClickMoveLayerDown = (index) => {
		const currentBackground =
			props.attributes.mobileCompoundBackground || defaultBackground;
		if (index === currentBackground.length - 1) {
			return;
		}

		if (currentBackground.length <= 1) {
			return;
		}

		const moving = Object.assign({}, currentBackground[index]);
		const replacing = Object.assign({}, currentBackground[index + 1]);

		const mobileCompoundBackground = currentBackground.map((layer, n) => {
			if (n === index + 1) {
				return moving;
			} else if (n === index) {
				return replacing;
			} else {
				return Object.assign({}, layer);
			}
		});

		props.setAttributes({ mobileCompoundBackground });
	}

	const onClickMoveLayerUp = (index) => {
		if (index <= 0) {
			return;
		}

		const currentBackground =
			props.attributes.mobileCompoundBackground || defaultBackground;
		if (currentBackground.length <= 1) {
			return;
		}

		const moving = Object.assign({}, currentBackground[index]);
		const replacing = Object.assign({}, currentBackground[index - 1]);

		const mobileCompoundBackground = currentBackground.map((layer, n) => {
			if (n === (index - 1)) {
				return moving;
			} else if (n === index) {
				return replacing;
			} else {
				return Object.assign({}, layer);
			}
		});

		props.setAttributes({ mobileCompoundBackground });
	};

	const handleLayerChange = (layer, index) => {
		const oldBackground =
			props.attributes.mobileCompoundBackground ||
			defaultBackground;
;
		const mobileCompoundBackground = oldBackground.map((l, i) =>
			i === index ? layer : l
		);

		props.setAttributes({ mobileCompoundBackground });
	}

	const mobileCompoundBackground =
		props.attributes.mobileCompoundBackground || defaultBackground;
	const wrapperClass = [
		'background-layer-collection'
	];

	let buttonText = __('Add Overlay');

	if (mobileCompoundBackground.length === 0) {
		buttonText = __('Add Background');
		wrapperClass.push('no-layers');
	} else if (mobileCompoundBackground.length === 1) {
		wrapperClass.push('single-layer');
	} else if (mobileCompoundBackground.length > 1) {
		buttonText = __('Add Layer');
		wrapperClass.push('multiple-layers');
	}

	return (
		<PanelBody
			className={'skeletor-inspector-control'}
			title={__('Mobile Compound Background')}
			initialOpen={false}
		>
			<div className={wrapperClass.join(' ')}>
				{mobileCompoundBackground.map((layer, index) => (
					<MobileBackgroundLayerControl
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
