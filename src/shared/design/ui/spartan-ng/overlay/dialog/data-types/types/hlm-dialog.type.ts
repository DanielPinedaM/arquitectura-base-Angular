import { type BrnDialogOptions } from '@spartan-ng/brain/dialog';

export type HlmDialogOptions<DialogContext = unknown> = BrnDialogOptions & {
	contentClass?: string;
	showCloseButton?: boolean;
	context?: DialogContext;
};
