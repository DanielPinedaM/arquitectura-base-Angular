import { HlmSwitchComponent } from '@/shared/design/ui/spartan-ng/form/selection/switch/hlm-switch.component';
import { HlmSwitchThumbDirective } from '@/shared/design/ui/spartan-ng/form/selection/switch/hlm-switch-thumb.directive';

export * from '@/shared/design/ui/spartan-ng/form/selection/switch/hlm-switch-thumb.directive';
export * from '@/shared/design/ui/spartan-ng/form/selection/switch/hlm-switch.component';

export const HlmSwitchImports = [
	HlmSwitchComponent,
	HlmSwitchThumbDirective,
] as const;
