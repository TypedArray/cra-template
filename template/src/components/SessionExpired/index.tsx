import { Button, Form, Message } from '@arco-design/web-react';
import { IconLock, IconUser } from '@arco-design/web-react/icon';
import { Input, Password } from '@typedarray/arco-design-formik';
import Modal, { ModalContext } from '@typedarray/arco-design-modal';
import axios from 'axios';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { useCookie, useKey } from 'react-use';
import { mutate, useSWRConfig } from 'swr';
import * as Yup from 'yup';
import { ResponseCode } from '../../constants';
import { ResponseObject } from '../../interfaces';

interface Values {
  username: string;
  password: string;
}

/**
 * 账号过期临时登录页
 */
const SessionExpired = () => {
  const [, setXSrToken] = useCookie('x-sr-token');
  const modal = useContext(ModalContext);
  const { cache } = useSWRConfig();
  const formikRef = useRef<FormikProps<Values>>(null);
  const validationSchema = useMemo(
    () =>
      Yup.object({
        username: Yup.string()
          .matches(/^\S+$/, '用户名不能包含空格，通常是 11 位手机号码')
          .required('请输入用户名，通常是 11 位手机号码'),
        password: Yup.string()
          .matches(/^\S+$/, '密码不能包含空格')
          .max(32, '密码长度不能大于32位')
          .required('请输入密码'),
      }),
    []
  );

  /**
   * 点击登录事件
   */
  const onSubmit = useCallback(
    async (values: Values, formikHelpers: FormikHelpers<Values>) => {
      const { username, password } = values;
      const res = await axios.post<ResponseObject>('/api/login', {
        username,
        password,
      });

      if (res.data.code === ResponseCode.SUCCESS) {
        Message.success('登录成功');
        setXSrToken(res.data.data?.xSrToken!);
        // 清空缓存
        // @ts-ignore
        cache.clear();
        // 刷新用户信息
        mutate('/api/user');
        modal?.close();
      } else {
        Message.error(res.data.msg || '登录出错，请刷新重试');
        modal?.close(Modal.REJECT);
      }
      formikHelpers.setSubmitting(false);
    },
    [cache, modal, setXSrToken]
  );

  // 按下回车时触发登录事件
  useKey('Enter', () => formikRef.current?.submitForm());

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      innerRef={formikRef}
    >
      {formikProps => {
        return (
          <Form layout="vertical" className="w-60">
            <Input
              name="username"
              placeholder="请输入用户名"
              prefix={<IconUser />}
              allowClear
            />
            <Password
              name="password"
              placeholder="请输入密码"
              type="password"
              prefix={<IconLock />}
              allowClear
            />
            <Form.Item wrapperCol={{ span: 24 }} className="mb-0">
              <Button
                loading={formikProps.isSubmitting}
                htmlType="submit"
                long
                type="primary"
                onClick={() => formikProps.handleSubmit()}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        );
      }}
    </Formik>
  );
};
export default SessionExpired;
