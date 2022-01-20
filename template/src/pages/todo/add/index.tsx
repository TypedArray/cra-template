import { Button, Layout, Message, Space } from '@arco-design/web-react';
import { Form, Input } from '@typedarray/arco-design-formik';
import Modal from '@typedarray/arco-design-modal';
import axios from 'axios';
import { Formik, FormikProps } from 'formik';
import React, { useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ResponseCode } from '../../../constants';
import { ResponseObject } from '../../../interfaces';

export default function Add() {
  const modalRef = useRef<Modal>(null);
  const formikRef = useRef<FormikProps<any>>(null);
  const navigate = useNavigate();

  const validationSchema = useMemo(
    () =>
      Yup.object({
        description: Yup.string().required('请输入描述'),
      }),
    []
  );
  const onSubmit = useCallback(
    async values => {
      const { description } = values;
      const res = await axios.post<ResponseObject>('/api/todo/add', {
        description,
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        Message.success('新增成功');
        navigate('/todo/list');
      } else {
        Message.error(res.data.msg);
      }
    },
    [navigate]
  );

  const onCancelClick = useCallback(async () => {
    if (formikRef.current?.dirty) {
      const flag = await modalRef.current!.confirm({
        icon: null,
        title: '取消新增',
        content: '离开当前页面已编辑内容将不会保存，是否确认退出？',
      });
      if (flag & Modal.OK) {
        navigate('/todo/list');
      }
    } else {
      navigate('/todo/list');
    }
  }, [navigate]);

  return (
    <>
      <Layout className="h-full">
        <Layout.Header className="bg-white h-auto space-y-1 p-4">
          <div className="text-lg text-black font-medium px-1">新增</div>
        </Layout.Header>
        <Layout.Content className="bg-white m-4 p-4 space-y-4">
          <Formik
            initialValues={{ description: '' }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
            validateOnMount
            innerRef={formikRef}
          >
            {formikProps => (
              <Form
                layout="horizontal"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                colon
                className="w-fit"
              >
                <Input
                  name="description"
                  label="description"
                  placeholder="请输入描述"
                  allowClear
                  required
                  className="w-60"
                />
                <Form.Item wrapperCol={{ offset: 8 }}>
                  <Space size={16}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={formikProps.isSubmitting}
                    >
                      提交
                    </Button>
                    <Button onClick={onCancelClick}>取消</Button>
                  </Space>
                </Form.Item>
              </Form>
            )}
          </Formik>
        </Layout.Content>
      </Layout>
      <Modal ref={modalRef} />
    </>
  );
}
