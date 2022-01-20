import { Button, Message } from '@arco-design/web-react';
import { IconLock, IconUser } from '@arco-design/web-react/icon';
import { Form, Input, Password } from '@typedarray/arco-design-formik';
import axios from 'axios';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookie, useSearchParam } from 'react-use';
import { mutate, useSWRConfig } from 'swr';
import * as Yup from 'yup';
import { ResponseCode } from '../../constants';
import { ResponseObject } from '../../interfaces';

interface Values {
  username: string;
  password: string;
}

/**
 * 登录页
 */
const Login = () => {
  const [, setXSrToken] = useCookie('x-sr-token');
  const { cache } = useSWRConfig();
  const formikRef = useRef<FormikProps<Values>>(null);
  const validationSchema = useMemo(
    () =>
      Yup.object({
        username: Yup.string()
          .matches(/^\S+$/, '用户名不能包含空格')
          .required('请输入用户名'),
        password: Yup.string()
          .matches(/^\S+$/, '密码不能包含空格')
          .max(32, '密码长度不能大于32位')
          .required('请输入密码'),
      }),
    []
  );
  const navigate = useNavigate();
  const redirectUri = useSearchParam('redirect_uri');

  /**
   * 点击登录事件
   */
  const onSubmit = useCallback(
    async (values: Values, formikHelpers: FormikHelpers<Values>) => {
      const res = await axios.post<ResponseObject>('/api/login', {
        username: values.username,
        password: values.password,
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        Message.success('登录成功');
        setXSrToken(res.data.data?.xSrToken!);
        // 清空缓存
        // @ts-ignore
        cache.clear();
        // 刷新用户信息
        mutate('/api/user');
        navigate(decodeURIComponent(redirectUri || '/'));
      } else {
        Message.error(res.data.msg || '登录出错，请刷新重试');
      }
      formikHelpers.setSubmitting(false);
    },
    [navigate, cache, redirectUri, setXSrToken]
  );

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
          <div className="w-full h-full">
            <div className="container mx-auto h-full flex items-center justify-center p-8">
              <div className="w-full md:w-96 flex flex-col items-center gap-12 mb-16">
                <Form layout="vertical">
                  <Input
                    name="username"
                    placeholder="请输入用户名"
                    prefix={<IconUser />}
                    size="large"
                    allowClear
                  />
                  <Password
                    name="password"
                    placeholder="请输入密码"
                    prefix={<IconLock />}
                    size="large"
                    allowClear
                  />
                  <Form.Item wrapperCol={{ span: 24 }} className="mt-8 mb-0">
                    <Button
                      loading={formikProps.isSubmitting}
                      htmlType="submit"
                      long
                      type="primary"
                      size="large"
                    >
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};
export default Login;
