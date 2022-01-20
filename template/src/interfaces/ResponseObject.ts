import { ResponseCode } from '../constants';

export interface ResponseObject<T = any> {
  code: typeof ResponseCode[keyof typeof ResponseCode];
  msg: string;
  data?: T;
  requestId?: string;
}
