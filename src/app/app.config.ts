import { routes } from '@/app/app.routes';
import { BrnLuxonDateAdapterNormalized } from '@spartan-ng/brn-luxon-date-adapter-normalized';
import { acceptInterceptor } from '@/shared/http-client/interceptors/headers/accept.interceptor';
import { contentTypeInterceptor } from '@/shared/http-client/interceptors/headers/content-type.interceptor';
import { timeoutInterceptor } from '@/shared/http-client/interceptors/timeout.interceptor';
import { withCredentialsInterceptor } from '@/shared/http-client/interceptors/with-credentials.interceptor';
import { loaderInterceptor } from '@/shared/http-client/loader/interceptors/loader.interceptor';
import { errorInterceptor } from '@/shared/http-client/response/error-handling/error.interceptor';
import { successInterceptor } from '@/shared/http-client/response/success.interceptor';
import { TitleCasePipe } from '@angular/common';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { provideBrnCalendarI18n } from '@spartan-ng/brain/calendar';
import { provideDateAdapter } from '@spartan-ng/brain/date-time';
import {
  provideHlmDatePickerConfig,
  provideHlmDatePickerMultiConfig,
  provideHlmDateRangePickerConfig,
} from '@spartan-ng/date-picker';
import { provideSpartanHlm } from '@spartan-ng/provide-spartan-hlm-helper';
import { DateTime } from 'luxon';

/**
 * Formatea un DateTime de Luxon al texto legible por el usuario (ej: "23 de julio de 2026").
 * Solo afecta la presentación visual: el value interno de los componentes de fecha
 * sigue usando ISO 8601 con offset de zona horaria */
const formatDisplayDate = (date: DateTime): string => date.setLocale('es').toFormat("d 'de' MMMM 'de' yyyy");

// #region componentes de spartan ng
const SPARTAN_NG = [
  provideSpartanHlm(),

  /**
   * Configurar spartan ng
   * para que los componentes de fecha
   * (hlm-calendar, hlm-calendar-multi, hlm-calendar-range, hlm-date-picker)
   * usen DateTime de Luxon y NO new Date() de JavaScript
   *
   * 🚨 PROHIBIDO: ⚠️
   * 1. Eliminar esta línea:
   * sin proveedor para BrnDateAdapterToken,
   * esos componentes lanzan NullInjectorError en runtime.
   *
   * 2. agregar otro provider de fecha
   * (provideNativeDateAdapter, provideUtcDateAdapter, provideDateAdapter(BrnJalaliDateAdapter), etc) */
  provideDateAdapter(BrnLuxonDateAdapterNormalized),

  /**
   * Texto mostrado al usuario en hlm-date-picker-trigger / hlm-date-picker-input
   * para selección de una única fecha */
  provideHlmDatePickerConfig<DateTime>({
    formatDate: formatDisplayDate,
  }),

  /**
   * Texto mostrado al usuario para selección de rango de fechas */
  provideHlmDateRangePickerConfig<DateTime>({
    formatDates: ([from, to]) => {
      if (!from) return '';
      return to ? `${formatDisplayDate(from)} - ${formatDisplayDate(to)}` : formatDisplayDate(from);
    },
  }),

  /**
   * Texto mostrado al usuario para selección de múltiples fechas */
  provideHlmDatePickerMultiConfig<DateTime>({
    formatDates: (dates) => dates.map(formatDisplayDate).join(', '),
  }),

  /**
   * Traducir a español el calendario de spartan ng */
  provideBrnCalendarI18n({
    formatWeekdayName: (index) => {
      const weekdays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
      return weekdays[index];
    },
    months: () => [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ],
    formatHeader: (month, year) =>
      new Date(year, month).toLocaleDateString('es', { month: 'long', year: 'numeric' }),
    formatMonth: (month) => new Date(2000, month).toLocaleDateString('es', { month: 'short' }),
    formatYear: (year) => new Date(year, 0).toLocaleDateString('es', { year: 'numeric' }),
    labelPrevious: () => 'Ir al mes anterior',
    labelNext: () => 'Ir al mes siguiente',
    labelWeekday: (index) => {
      const weekdays = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      return weekdays[index];
    },
  }),
];
// #endregion

// #region ⚠️ PROHIBIDO cambiar el orden de esta constante porque puedes generar bugs en consumo de APIs 🚨
const HTTP_CLIENT_INTERCEPTORS: HttpInterceptorFn[] = [
  // GRUPO 1: preparan la REQUEST (solo next(req.clone))
  withCredentialsInterceptor,
  acceptInterceptor,
  contentTypeInterceptor,

  // GRUPO 2: manejan la RESPONSE (.pipe con operadores)
  loaderInterceptor,
  timeoutInterceptor,
  errorInterceptor,
  successInterceptor,
];
// #endregion

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([...HTTP_CLIENT_INTERCEPTORS])),
    provideHotToastConfig(),
    TitleCasePipe,

    ...SPARTAN_NG,
  ],
};
