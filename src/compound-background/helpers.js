import classnames from 'classnames';

const destructureColor = (str) => {
	str = str.toLocaleLowerCase();

	//#facade
	if (str.match(/^\#[0-9a-f]{6}$/)) {
		return {
			r: parseInt(str.substr(1, 2), 16),
			g: parseInt(str.substr(3, 2), 16),
			b: parseInt(str.substr(5, 2), 16),
			a: 1,
		};
	}

	//#eee
	if (str.match(/^\#[0-9a-f]{3}$/)) {
		const hex = str.replace(/[0-9a-f]/g, '$&$&');
		return {
			r: parseInt(hex.substr(1, 2), 16),
			g: parseInt(hex.substr(3, 2), 16),
			b: parseInt(hex.substr(5, 2), 16),
			a: 1,
		};
	}

	//#deadbeef
	if (str.match(/^\#[0-9a-f]{8}$/)) {
		return {
			r: parseInt(str.substr(1, 2), 16),
			g: parseInt(str.substr(3, 2), 16),
			b: parseInt(str.substr(5, 2), 16),
			a: parseInt(str.substr(7, 2), 16) / 255,
		};
	}

	//rgb(...)
	const rgbMatch = str.match(/^rgb\(([^\)]+)\)$/);
	if (rgbMatch) {
		const data = rgbMatch[1].split(',').map((n) => parseInt(n.trim()));
		return {
			r: data[0],
			g: data[1],
			b: data[2],
			a: 1,
		};
	}

	//rgba(...)
	const rgbaMatch = str.match(/^rgba\(([^\)]+)\)$/);
	if (rgbaMatch) {
		const data = rgbaMatch[1].split(',').map((n) => n.trim());
		return {
			r: parseInt(data[0]),
			g: parseInt(data[1]),
			b: parseInt(data[2]),
			a: parseFloat(data[3]),
		};
	}

	return { r: 0, g: 0, b: 0, a: 0 };
};

const getBackgroundPosition = (layer) => {
	const { backgroundPosition, backgroundPositionManual, focalPoint } = layer;

	if (backgroundPosition === 'manual') {
		return backgroundPositionManual;
	}

	if (backgroundPosition === 'focalpoint' && focalPoint) {
		return `${focalPoint.x * 100}% ${focalPoint.y * 100}%`;
	}

	if (!backgroundPosition) {
		return '0 0';
	}

	return backgroundPosition;
};

const getBackgroundSize = (layer) => {
	const { backgroundSize, backgroundSizeManual } = layer;

	let ret = backgroundSize;
	if (backgroundSize === 'manual') {
		ret = backgroundSizeManual;
	} else if (backgroundSize === undefined) {
		ret = 'auto';
	}

	return `/${ret}`;
};

const getBackgroundImage = (layer) => {
	const { layerType, backgroundImage, backgroundGradient, backgroundColor } =
		layer;

	if (layerType === 'image' && backgroundImage) {
		return `url('${backgroundImage}')`;
	}

	if (layerType === 'gradient' && backgroundGradient) {
		return backgroundGradient;
	}

	if (layerType === 'color' && backgroundColor) {
		const color = destructureColor(backgroundColor);
		const opacity =
			layer.backgroundColorOpacity >= 0
				? layer.backgroundColorOpacity * 0.01
				: 1;
		const gradientColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${
			color.a * opacity
		})`;

		return `linear-gradient(to right,${gradientColor} 0,${gradientColor} 100%)`;
	}

	return null;
};

/**
 * Parse layer into a style object
 * @param {Object} layer
 */
export const getBackgroundStyle = (attributes) => {
	const { compoundBackground } = attributes;

	if (!compoundBackground) {
		return {};
	}

	const backgroundLayers = compoundBackground
		.map((layer) => {
			if (layer.layerType === 'manual') {
				return layer.manualTextBackground;
			}

			const backgroundImage = getBackgroundImage(layer);
			const backgroundPosition = getBackgroundPosition(layer);
			const backgroundSize = getBackgroundSize(layer);
			const { backgroundRepeat } = layer;

			if (backgroundImage) {
				const backgroundImageLayer = [
					backgroundImage,
					`${backgroundPosition}${backgroundSize}`,
					backgroundRepeat,
				]
					.filter((n) => n)
					.join(' ')
					.replace('auto/auto', '')
					.trim();

				return backgroundImageLayer;
			}
		})
		.filter((l) => l);

	const background = backgroundLayers.reverse().join(',');
	if (!background) {
		return;
	}

	const style = { background };

	const backgroundBlendModes = compoundBackground
		.map((layer) => layer.backgroundBlendMode || 'normal')
		.splice(0, backgroundLayers.length);

	if (
		backgroundBlendModes.length > 0 &&
		backgroundBlendModes.some((mode) => mode !== 'normal')
	) {
		Object.assign(style, {
			backgroundBlendMode: backgroundBlendModes.reverse().join(','),
		});
	}

	const backgroundAttachments = compoundBackground
		.map((layer) => layer.backgroundAttachment || 'scroll')
		.splice(0, backgroundLayers.length);

	if (
		backgroundAttachments.length > 0 &&
		backgroundAttachments.some((mode) => mode !== 'scroll')
	) {
		Object.assign(style, {
			backgroundAttachment: backgroundAttachments.reverse().join(','),
		});
	}

	return style;
};

/**
 * Parse attributes into a style object
 * @param {Object} attributes
 */
export const getMobileBackgroundStyle = (attributes) => {
	const { mobileCompoundBackground } = attributes;

	if (!mobileCompoundBackground) {
		return {};
	}

	const backgroundLayers = mobileCompoundBackground
		.map((layer) => {
			if (layer.layerType === 'manual') {
				return layer.manualTextBackground;
			}

			const backgroundImage = getBackgroundImage(layer);
			const backgroundPosition = getBackgroundPosition(layer);
			const backgroundSize = getBackgroundSize(layer);
			const { backgroundRepeat } = layer;

			if (backgroundImage) {
				const backgroundImageLayer = [
					backgroundImage,
					`${backgroundPosition}${backgroundSize}`,
					backgroundRepeat,
				]
					.filter((n) => n)
					.join(' ')
					.replace('auto/auto', '')
					.trim();

				return backgroundImageLayer;
			}
		})
		.filter((l) => l);

	const background = backgroundLayers.reverse().join(',');
	if (!background) {
		return;
	}

	const style = { 
		'--mobile-background': background
	};

	/* get our blend modes */
	const backgroundBlendModes = mobileCompoundBackground
		.map((layer) => layer.backgroundBlendMode || 'normal')
		.splice(0, backgroundLayers.length);

	if (
		backgroundBlendModes.length > 0 &&
		backgroundBlendModes.some((mode) => mode !== 'normal')
	) {
		Object.assign(style, {
			'--mobile-background-blend-mode': backgroundBlendModes.reverse().join(','),
		});
	}

	/* get our background Attachments */
	const backgroundAttachments = mobileCompoundBackground
		.map((layer) => layer.backgroundAttachment || 'scroll')
		.splice(0, backgroundLayers.length);

	if (
		backgroundAttachments.length > 0 &&
		backgroundAttachments.some((mode) => mode !== 'scroll')
	) {
		Object.assign(style, {
			'--mobile-background-attachment': backgroundAttachments.reverse().join(','),
		});
	}

	return style;
};

export const getMobileBackgroundClassNames = (attributes) => {
	const styles = getMobileBackgroundStyle(attributes);
	if (!styles) {
		return;
	}

	// in case it's an empty object
	if (typeof styles === 'object' && Object.keys(styles).length == 0) {
		return;
	}

	return classnames({
		'has-mobile-background': styles
	});
}