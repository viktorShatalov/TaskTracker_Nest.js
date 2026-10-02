import moment from 'moment';

export function toPrismaDate(value: string | null | undefined): Date | null {
  return value ? moment(value).toDate() : null;
}