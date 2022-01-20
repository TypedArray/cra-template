import axios from 'axios';
import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { ResponseCode } from '../constants';
import { ResponseObject } from '../interfaces';

interface User {
  username: string;
  permissionIds: string[];
}

/**
 * 登录用户信息
 */
export default function useUser() {
  const { data, isValidating, mutate, error } = useSWR(
    '/api/user',
    (url: string) => axios.post<ResponseObject<User>>(url),
    {
      // 每隔一段时间刷新一次
      refreshInterval: 60_000,
    }
  );

  const me = useMemo(() => data?.data.data, [data]);
  const isLoggedOut = useMemo(
    () => data && data.data.code !== ResponseCode.SUCCESS,
    [data]
  );
  const isLoggedIn = useMemo(
    () => data && data.data.code === ResponseCode.SUCCESS,
    [data]
  );

  const permissionSet = useMemo(
    () => new Set(data?.data.data?.permissionIds ?? []),
    [data]
  );
  const hasPermission = useCallback(
    (permissionId?: string | string[]) => {
      if (permissionId === undefined) {
        return true;
      }
      if (permissionId === null) {
        console.warn('调用 hasPermission 参数 permissionId 不能为空');
        return true;
      }
      if (typeof permissionId === 'string') {
        return permissionSet.has(permissionId);
      } else {
        return permissionId.some(permissionId =>
          permissionSet.has(permissionId)
        );
      }
    },
    [permissionSet]
  );

  return {
    me,
    isLoggedIn,
    isLoggedOut,
    hasPermission,
    isValidating,
    data,
    mutate,
    error,
  };
}
