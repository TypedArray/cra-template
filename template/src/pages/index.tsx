import { Alert } from '@arco-design/web-react';
import Modal from '@typedarray/arco-design-modal';
import React, { useRef } from 'react';
import { SWRConfig } from 'swr';
import SessionExpired from '../components/SessionExpired';
import { PrivateLayout } from '../layouts';

export default function Index() {
  const modalRef = useRef<Modal>(null);
  return (
    <SWRConfig
      value={{
        onError(error, key, config) {
          if (modalRef.current?.size === 0) {
            // 同时只能打开一个登录窗口
            if (error.response?.status === 403) {
              // "Unauthorized"

              // @ts-ignore
              config.cache.clear();
              modalRef.current.warning(
                {
                  title: '登录过期，请重新登录',
                  flags: Modal.NONE,
                  escToExit: false,
                  className: 'w-auto',
                },
                <SessionExpired />
              );
            } else {
              // 其他错误
              modalRef.current.warning({
                title: '系统异常',
                content: error.response ? (
                  <Alert
                    type="error"
                    showIcon={false}
                    title={error.response.status}
                    content={error.response.statusText}
                  />
                ) : (
                  '服务器发生错误，请稍后重试'
                ),
              });
            }
          }
        },
      }}
    >
      <PrivateLayout />
      <Modal ref={modalRef} />
    </SWRConfig>
  );
}
