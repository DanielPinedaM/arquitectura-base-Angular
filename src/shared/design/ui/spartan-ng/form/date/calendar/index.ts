import { HlmCalendarComponent } from '@/shared/design/ui/spartan-ng/form/date/calendar/hlm-calendar.component';
import { HlmCalendarMultiComponent } from '@/shared/design/ui/spartan-ng/form/date/calendar/hlm-calendar-multi.component';
import { HlmCalendarRangeComponent } from '@/shared/design/ui/spartan-ng/form/date/calendar/hlm-calendar-range.component';

export * from '@/shared/design/ui/spartan-ng/form/date/calendar/hlm-calendar-multi.component';
export * from '@/shared/design/ui/spartan-ng/form/date/calendar/hlm-calendar-range.component';
export * from '@/shared/design/ui/spartan-ng/form/date/calendar/hlm-calendar.component';

export const HlmCalendarImports = [
	HlmCalendarComponent,
	HlmCalendarMultiComponent,
	HlmCalendarRangeComponent,
] as const;
