//

import axios from 'axios';
import useSWR from 'swr';
import { PaginationObject, ResponseObject } from '../interfaces';

export interface Item {
  id: number;
  description: string;
  completed: boolean;
}

/**
 * todo list
 */
export default function useTodos(
  data: {
    requestId?: number;
    pageNum: number;
    pageSize: number;
  } | null
) {
  return useSWR(
    data ? ['/api/todo/list', data] : null,
    (url, { requestId, ...data }) =>
      axios.post<ResponseObject<PaginationObject<Item>>>(url, data)
  );
}
