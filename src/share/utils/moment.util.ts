import * as moment from 'moment-timezone';
import { MomentFormatEnum } from '../../enums/moment-format.enum';

export const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';

export class MomentHumanize {
  static relativeTime = {
    future: 'tới',
    past: 'trước',
    s: 'vài giây',
    ss: 'giây',
    m: 'một phút',
    mm: 'phút',
    h: 'một giờ',
    hh: 'giờ',
    d: 'một ngày',
    dd: 'ngày',
    M: 'một tháng',
    MM: 'tháng',
    y: 'một năm',
    yy: 'năm',
  };

  static from(from: moment.MomentInput, to: moment.MomentInput) {
    const duration = moment.duration(moment(from).diff(to));
    const years = duration.years();
    const months = duration.months();
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    return [
      years && `${years} ${MomentHumanize.relativeTime.yy}`,
      months && `${months} ${MomentHumanize.relativeTime.MM}`,
      days && `${days} ${MomentHumanize.relativeTime.dd}`,
      hours && `${hours} ${MomentHumanize.relativeTime.hh}`,
      minutes && `${minutes} ${MomentHumanize.relativeTime.mm}`,
      seconds && `${seconds} ${MomentHumanize.relativeTime.ss}`,
    ]
      .filter((h) => h)
      .join(' ');
  }

  static fromNow(date: moment.MomentInput) {
    return MomentHumanize.from(date, moment());
  }
}

export const genObjFromDate = (date) => {
  const min = date.getMinutes();
  return {
    year: date.getFullYear().toString(),
    month: (date.getMonth() + 1).toString(),
    date: date.getDate().toString(),
    hour: date.getHours().toString(),
    step: calcStepByMinute(min),
  };
};

export const extractDate = (time: moment.MomentInput): string => {
  return moment(time).tz(DEFAULT_TIMEZONE).format(MomentFormatEnum.ISO_DATE);
};

export const dateStartOfHour = (time: moment.MomentInput): string => {
  return moment(time).tz(DEFAULT_TIMEZONE).startOf('hour').toISOString();
};

export const endOfHour = (time: moment.MomentInput): string => {
  return moment(time).tz(DEFAULT_TIMEZONE).endOf('hour').toISOString();
};

export const startOfDay = (time: moment.MomentInput): string => {
  return moment(time).tz(DEFAULT_TIMEZONE).startOf('day').toISOString();
};

export const endOfYesterday = (time: moment.MomentInput): string => {
  return moment(time)
    .tz(DEFAULT_TIMEZONE)
    .endOf('day')
    .subtract(1, 'day')
    .toISOString();
};

export const endOfDay = (time: moment.MomentInput): string => {
  return moment(time).tz(DEFAULT_TIMEZONE).endOf('day').toISOString();
};

export const endOfDayToDate = (time: moment.MomentInput): Date => {
  return moment(time).tz(DEFAULT_TIMEZONE).endOf('day').toDate();
};

export const endOfDayMoment = (time: moment.MomentInput): moment.Moment => {
  return moment(time).tz(DEFAULT_TIMEZONE).endOf('day');
};

export const exactTimeToString = (time: moment.MomentInput): string => {
  return moment(time).tz(DEFAULT_TIMEZONE).toISOString();
};

export const exactTime = (time: moment.MomentInput): Date => {
  return moment(time).tz(DEFAULT_TIMEZONE).toDate();
};

export const getTime = (time: moment.MomentInput): string => {
  return moment(time).format(MomentFormatEnum.ISO_TIME);
};

export const getDateOfTime = (time: moment.MomentInput): string => {
  return moment(time).tz(DEFAULT_TIMEZONE).format(MomentFormatEnum.ISO_DATE);
};

function calcStepByMinute(minute): string {
  const steps = [];
  let step = null;
  for (let i = 0; i < 12; i++) {
    steps.push({
      min: i * 5,
      max: (i + 1) * 5,
      step: i * 5,
    });
  }

  steps.forEach((cur) => {
    if (cur.min <= minute && minute < cur.max) {
      step = cur.step.toString();
    }
  });
  return step;
}

export const startOfHour = (time: moment.MomentInput): string => {
  return moment(time)
    .tz(DEFAULT_TIMEZONE)
    .startOf('hour')
    .format(MomentFormatEnum.VI_TIME);
};
