import { Button, Result, Space } from '@arco-design/web-react';
import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useUser from '../../data/useUser';

function AccessDenied() {
  const { isValidating, mutate } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const onLogin = useCallback(() => {
    const redirectUri = `${location.pathname}${location.search}`;
    navigate({
      pathname: '/login',
      search:
        redirectUri !== '/'
          ? `?redirect_uri=${encodeURIComponent(redirectUri)}`
          : undefined,
    });
  }, [navigate, location]);
  return (
    <div className="relative bg-gray-100 h-full">
      <Result
        className="absolute top-1/3 -translate-y-1/2"
        status="403"
        subTitle="您访问的页面不存在或没有权限"
        extra={
          <Space>
            <Button onClick={() => mutate()} disabled={isValidating}>
              刷新
            </Button>
            <Button type="primary" onClick={onLogin}>
              登录
            </Button>
          </Space>
        }
      />
    </div>
  );
}

export default AccessDenied;
