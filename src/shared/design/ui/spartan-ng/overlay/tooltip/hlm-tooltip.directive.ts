import { Directive } from '@angular/core';
import { BrnTooltip, BrnTooltipPosition, provideBrnTooltipDefaultOptions } from '@spartan-ng/brain/tooltip';
import { hlm } from '@spartan-ng/hlm-helper';
import {
	DEFAULT_TOOLTIP_CONTENT_CLASSES,
	DEFAULT_TOOLTIP_SVG_CLASS,
	tooltipPositionVariants,
} from '@spartan-ng/hlm-tooltip-const';

@Directive({
	selector: '[hlmTooltip]',
	providers: [
		provideBrnTooltipDefaultOptions({
			svgClasses: DEFAULT_TOOLTIP_SVG_CLASS,
			tooltipContentClasses: DEFAULT_TOOLTIP_CONTENT_CLASSES,
			arrowClasses: (position: BrnTooltipPosition) => hlm(tooltipPositionVariants({ position })),
		}),
	],
	hostDirectives: [
		{
			directive: BrnTooltip,
			inputs: ['brnTooltip: hlmTooltip', 'position', 'hideDelay', 'showDelay', 'tooltipDisabled'],
		},
	],
})
export class HlmTooltipDirective {}
