import { DateRange, ValueType } from 'rsuite/esm/DateRangePicker';

export function subDays(date: Date, days: number): Date {
  return new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
}

export function startOfWeek(date: Date, options = { weekStartsOn: 0 }): Date {
  const { weekStartsOn } = options;
  const day = date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - diff);
}

export function endOfWeek(
  date: Date,
  options?: { weekStartsOn: number }
): Date {
  const weekStartsOn = options?.weekStartsOn ?? 0;
  const startOfWeekDate = startOfWeek(date, { weekStartsOn });
  return new Date(startOfWeekDate.getTime() + 6 * 24 * 60 * 60 * 1000);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function addMonths(date: Date, months: number): Date {
  const year = date.getFullYear();
  const month = date.getMonth();
  const newMonth = month + months;
  const newYear = year + Math.floor(newMonth / 12);
  const newMonthIndex = newMonth % 12;
  return new Date(newYear, newMonthIndex, date.getDate());
}

export interface PredefinedRange {
  label: string;
  value: DateRange | ((value?: ValueType | undefined) => DateRange);
  placement?: 'bottom' | 'left' | undefined;
  appearance?: string;
  closeOverlay?: boolean;
}

export const setToStartOfDate = (date: Date): Date => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return d;
};

export const setToEndOfDate = (date: Date) => {
  date.setUTCHours(23, 59, 59, 59);
  return date;
};

export const todayRange = {
  startDate: setToStartOfDate(new Date()),
  endDate: new Date(),
};

export const yesterdayRange = {
  startDate: setToStartOfDate(addDays(new Date(), -1)),
  endDate: setToEndOfDate(addDays(new Date(), -1)),
};

export const last7DaysRange = {
  startDate: setToStartOfDate(subDays(new Date(), 6)),
  endDate: new Date(),
};

export const last30daysRange = {
  startDate: setToStartOfDate(subDays(new Date(), 29)),
  endDate: new Date(),
};

export const formatDateLabel = (date: Date) => {
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return formattedDate;
};

export const predefinedRanges: PredefinedRange[] = [
  {
    label: 'Today',
    value: [new Date(), new Date()],
    placement: 'left',
  },
  {
    label: 'Yesterday',
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    placement: 'left',
  },
  {
    label: 'This week',
    value: [startOfWeek(new Date()), endOfWeek(new Date())],
    placement: 'left',
  },
  {
    label: 'Last 7 days',
    value: [subDays(new Date(), 6), new Date()],
    placement: 'left',
  },
  {
    label: 'Last 30 days',
    value: [subDays(new Date(), 29), new Date()],
    placement: 'left',
  },
  {
    label: 'This month',
    value: [startOfMonth(new Date()), new Date()],
    placement: 'left',
  },
  {
    label: 'Last month',
    value: [
      startOfMonth(addMonths(new Date(), -1)),
      endOfMonth(addMonths(new Date(), -1)),
    ],
    placement: 'left',
  },
  {
    label: 'This year',
    value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    placement: 'left',
  },
  {
    label: 'Last year',
    value: [
      new Date(new Date().getFullYear() - 1, 0, 1),
      new Date(new Date().getFullYear(), 0, 0),
    ],
    placement: 'left',
  },
  {
    label: 'All time',
    value: [new Date(new Date().getFullYear() - 3, 0, 1), new Date()],
    placement: 'left',
  },
  {
    label: 'Last week',
    closeOverlay: false,
    value: (value: ValueType | undefined) => {
      const [start = new Date()] = value || [];
      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), -7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), -7),
      ];
    },
    appearance: 'default',
    placement: 'bottom',
  },
  {
    label: 'Next week',
    closeOverlay: false,
    value: (value: ValueType | undefined) => {
      const [start = new Date()] = value || [];
      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), 7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), 7),
      ];
    },
    appearance: 'default',
    placement: 'bottom',
  },
];
