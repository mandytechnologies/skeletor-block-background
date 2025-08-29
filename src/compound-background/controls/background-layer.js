import {
	backgroundLayerTypeOptions,
	backgroundSizeOptions,
	backgroundPositionOptions,
	backgroundRepeatOptions,
	backgroundBlendModeOptions,
	backgroundAttachmentOptions,
} from '../select-options';

const {
	BaseControl,
	SelectControl,
	Button,
	TextControl,
	FocalPointPicker,
	GradientPicker,
	ColorPalette,
	RangeControl,
	TextareaControl
} = wp.components;

const { MediaUpload, MediaUploadCheck, useSetting } = wp.blockEditor;
const { __ } = wp.i18n;

export const BackgroundLayerControl = ({
	index,
	layer,
	onLayerChange,
	onClickDeleteLayer,
	onClickMoveLayerDown,
	onClickMoveLayerUp,
}) => {
	const {
		layerType,
		manualTextBackground,
		backgroundImage,
		backgroundGradient,
		backgroundColor,
		backgroundColorOpacity,
		focalPoint,
		backgroundSize,
		backgroundSizeManual,
		backgroundPosition,
		backgroundPositionManual,
		backgroundRepeat,
		backgroundBlendMode,
		backgroundAttachment,
	} = layer;

	const containerStyle = {
		display: 'flex',
		flexDirection: 'column',
	};

	const setLayerAttributes = (attributes) => {
		onLayerChange(Object.assign({}, layer, attributes), index);
	};

	return (
		<div
			className="background-layer-control"
			style={containerStyle}
			key={index}
			title={__(`Layer ${index}`)}
		>
			<div className="background-layer-control-title-bar">
				<label>Layer {index}</label>

				<div className="background-layer-control-title-bar-buttons">
					<Button
						isSmall
						text="▲"
						label="Move Up"
						onClick={() => onClickMoveLayerUp(index)}
					/>
					<Button
						isSmall
						text="▼"
						label="Move Down"
						onClick={() => onClickMoveLayerDown(index)}
					/>
					<Button
						isSmall
						text="×"
						label="Delete"
						onClick={() => onClickDeleteLayer(index)}
					/>
				</div>
			</div>

			<SelectControl
				label={__('Background Type')}
				value={layerType}
				options={backgroundLayerTypeOptions}
				onChange={(layerType) => setLayerAttributes({ layerType })}
			/>

			<SelectControl
				label={__('Attachment')}
				value={backgroundAttachment}
				options={backgroundAttachmentOptions}
				onChange={(backgroundAttachment) =>
					setLayerAttributes({ backgroundAttachment })
				}
			/>

			<SelectControl
				label={__('Blend Mode')}
				value={backgroundBlendMode}
				options={backgroundBlendModeOptions}
				onChange={(backgroundBlendMode) =>
					setLayerAttributes({ backgroundBlendMode })
				}
			/>

			{layerType === 'manual' && (
				<TextareaControl
					label="Manual CSS Background"
					value={manualTextBackground}
					onChange={(manualTextBackground) =>
						setLayerAttributes({ manualTextBackground })
					}
				/>
			)}

			{layerType === 'image' && (
				<BaseControl label={__('Image')}>
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={['image']}
							onSelect={(selected) => {
								setLayerAttributes({
									backgroundImage: selected.url,
								});
							}}
							render={(O) => (
								<Button
									className={
										'editor-post-featured-image__toggle'
									}
									onClick={O.open}
								>
									{__('Set Background Image')}
								</Button>
							)}
						/>
					</MediaUploadCheck>
				</BaseControl>
			)}

			{layerType === 'image' && backgroundImage && (
				<BaseControl className="components-bg-image-display">
					<img src={backgroundImage} alt={__('Image')} />
					<div className="components-bg-image-display__clear-wrapper">
						<Button
							isSmall
							onClick={() => {
								setLayerAttributes({
									backgroundImage: undefined,
								});
							}}
						>
							Clear
						</Button>
					</div>
				</BaseControl>
			)}

			{layerType === 'gradient' && (
				<GradientPicker
					label="Gradient"
					value={backgroundGradient}
					disableCustomGradients={false}
					gradients={useSetting('color.gradients')}
					onChange={(backgroundGradient) =>
						setLayerAttributes({ backgroundGradient })
					}
				/>
			)}

			{layerType === 'color' && (
				<>
					<ColorPalette
						label="Background Color"
						colors={useSetting('color.palette')}
						value={backgroundColor}
						onChange={(backgroundColor) =>
							setLayerAttributes({ backgroundColor })
						}
					/>

					<RangeControl
						label="Background Color Opacity"
						min={0}
						max={100}
						value={
							backgroundColorOpacity >= 0
								? backgroundColorOpacity
								: 100
						}
						onChange={(backgroundColorOpacity) =>
							setLayerAttributes({ backgroundColorOpacity })
						}
					/>
				</>
			)}

			{['image', 'gradient'].includes(layerType) && (
				<SelectControl
					label={__('Size')}
					value={backgroundSize}
					options={Object.values(backgroundSizeOptions)}
					onChange={(backgroundSize) => {
						setLayerAttributes({ backgroundSize });
					}}
				/>
			)}

			{['image', 'gradient'].includes(layerType) &&
				backgroundSize === 'manual' && (
					<BaseControl label={__('Manual Size')}>
						<TextControl
							value={backgroundSizeManual}
							onChange={(backgroundSizeManual) => {
								setLayerAttributes({ backgroundSizeManual });
							}}
						/>
					</BaseControl>
				)}

			{['image', 'gradient'].includes(layerType) && (
				<SelectControl
					label={__('Position')}
					value={backgroundPosition}
					options={Object.values(backgroundPositionOptions)}
					onChange={(backgroundPosition) => {
						setLayerAttributes({ backgroundPosition });
					}}
				/>
			)}

			{['image', 'gradient'].includes(layerType) &&
				backgroundPosition === 'manual' && (
					<BaseControl label={__('Manual Position')}>
						<TextControl
							value={backgroundPositionManual}
							onChange={(backgroundPositionManual) => {
								setLayerAttributes({
									backgroundPositionManual,
								});
							}}
						/>
					</BaseControl>
				)}

			{['image', 'gradient'].includes(layerType) &&
				backgroundPosition === 'focalpoint' && (
					<FocalPointPicker
						url={backgroundImage}
						value={focalPoint || { x: 0.5, y: 0.5 }}
						onChange={(p) => setLayerAttributes({ focalPoint: p })}
					/>
				)}

			{['image', 'gradient'].includes(layerType) && (
				<SelectControl
					label={__('Repeat')}
					value={backgroundRepeat}
					options={Object.values(backgroundRepeatOptions)}
					onChange={(backgroundRepeat) => {
						setLayerAttributes({ backgroundRepeat });
					}}
				/>
			)}
		</div>
	);
};
