const { __ } = wp.i18n;

export const backgroundLayerTypeOptions = [
	{ label: __(''),                value: '' },
	{ label: __('Image'),           value: 'image' },
	{ label: __('Gradient'),        value: 'gradient' },
	{ label: __('Solid Color'),     value: 'color' },
	{ label: __('Manual CSS Text'), value: 'manual' },
];

export const backgroundAttachmentOptions = [
	{ label: __('Default'), value: 'scroll' },
	{ label: __('Fixed'), value: 'fixed' },
	{ label: __('Local'), value: 'local' },
];

export const backgroundSizeOptions = [
	{ label: __('Display image at its actual size'),        value: 'auto' },
	{ label: __('Cover (Crop excess parts of image)'),      value: 'cover' },
	{ label: __('Contain (Letterbox image to fit inside)'), value: 'contain' },
	{ label: __('Manually enter background-size CSS'),      value: 'manual' },
];

export const backgroundPositionOptions = [
	{ label: __('Upper Left Corner'),                      value: 'top left' },
	{ label: __('Centered on Top Side'),                   value: 'top center' },
	{ label: __('Upper Right Corner'),                     value: 'top right' },
	{ label: __('Centered on Left Side'),                  value: 'center left' },
	{ label: __('Centered'),                               value: 'center center' },
	{ label: __('Centered on Right Side'),                 value: 'center right' },
	{ label: __('Bottom Left Corner'),                     value: 'bottom left' },
	{ label: __('Centered on Bottom Side'),                value: 'bottom center' },
	{ label: __('Bottom Right Corner'),                    value: 'bottom right' },
	{ label: __('Focal Point'),                            value: 'focalpoint' },
	{ label: __('Manually enter background-position CSS'), value: 'manual' },
];

export const backgroundRepeatOptions = [
	{ label: __('Repeat'),              value: 'repeat' },
	{ label: __('Repeat Horizontally'), value: 'repeat-x' },
	{ label: __('Repeat Vertically'),   value: 'repeat-y' },
	{ label: __('Do NOT Repeat'),       value: 'no-repeat' },
];

export const backgroundBlendModeOptions = [
	{ label: __('Normal'),      value: 'normal' },
	{ label: __('Multiply'),    value: 'multiply' },
	{ label: __('Screen'),      value: 'screen' },
	{ label: __('Overlay'),     value: 'overlay' },
	{ label: __('Darken'),      value: 'darken' },
	{ label: __('Lighten'),     value: 'lighten' },
	{ label: __('Color Dodge'), value: 'color-dodge' },
	{ label: __('Color Burn'),  value: 'color-burn' },
	{ label: __('Hard Light'),  value: 'hard-light' },
	{ label: __('Soft Light'),  value: 'soft-light' },
	{ label: __('Difference'),  value: 'difference' },
	{ label: __('Exclusion'),   value: 'exclusion' },
	{ label: __('Hue'),         value: 'hue' },
	{ label: __('Saturation'),  value: 'saturation' },
	{ label: __('Color'),       value: 'color' },
	{ label: __('Luminosity'),  value: 'luminosity' },
];
