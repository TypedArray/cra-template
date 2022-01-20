import {
  Button,
  Checkbox,
  Layout,
  PaginationProps,
  Space,
  Table,
  TableColumnProps,
} from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import {
  Form,
  Input,
  RangePicker,
  Select,
} from '@typedarray/arco-design-formik';
import Modal from '@typedarray/arco-design-modal';
import { Formik, FormikProps } from 'formik';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import useTodos, { Item } from '../../../data/useTodos';

interface Values {
  searchKey: string | null;
  keywords: string;
}

interface SearchParams {
  requestId?: number;
  pageNum: number;
  pageSize: number;
  searchKey?: string | null;
  keywords?: string;
}

export default function List() {
  const modalRef = useRef<Modal>(null);
  const formikRef = useRef<FormikProps<Values>>(null);
  const initialValues = useMemo<Values>(
    () => ({
      searchKey: null,
      keywords: '',
    }),
    []
  );
  const [searchParams, setSearchParams] = useState<SearchParams>({
    pageNum: 1,
    pageSize: 10,
  });

  const validationSchema = useMemo(
    () =>
      Yup.object({
        searchKey: Yup.string().nullable(),
        keywords: Yup.string(),
      }),
    []
  );

  const { data, isValidating } = useTodos(searchParams);
  const dataSource = useMemo(() => data?.data.data?.data, [data]);
  const total = useMemo(() => data?.data.data?.total, [data]);

  const onSubmit = useCallback((values: Values) => {
    const { searchKey, keywords } = values;
    setSearchParams(prevState => ({
      ...prevState,
      requestId: Date.now(),
      pageNum: 1, // 查询时重置页码
      searchKey,
      keywords,
    }));
  }, []);

  const navigate = useNavigate();

  const columns = useMemo<TableColumnProps<Item>[]>(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: 'Description',
        dataIndex: 'description',
      },
      {
        title: 'Completed',
        dataIndex: 'completed',
        render(val) {
          return <Checkbox checked={val} />;
        },
      },
    ],
    []
  );

  const pagination = useMemo<PaginationProps>(
    () => ({
      sizeCanChange: true,
      showTotal: true,
      total: total,
      pageSize: searchParams.pageSize,
      current: searchParams.pageNum,
      onChange(current, pageSize) {
        setSearchParams(prevState => ({
          ...prevState,
          requestId: Date.now(),
          pageNum: current,
          pageSize,
        }));
      },
    }),
    [total, searchParams.pageSize, searchParams.pageNum]
  );

  const onAddClick = useCallback(() => {
    navigate('/todo/add');
  }, [navigate]);

  useEffect(() => {
    setSearchParams(prevState => ({
      ...prevState,
      searchKey: null,
      keywords: '',
    }));
  }, []);

  return (
    <>
      <Layout className="h-full">
        <Layout.Header className="bg-white h-auto space-y-1 p-4">
          <div className="text-lg text-black font-medium px-1">列表</div>
        </Layout.Header>
        <Layout.Content className="bg-white m-4 p-4 space-y-4">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            onReset={() => {
              formikRef.current?.submitForm();
            }}
            enableReinitialize
            validateOnMount
            innerRef={formikRef}
          >
            {formikProps => (
              <Form layout="inline" colon>
                <Select
                  name="searchKey"
                  label="searchKey"
                  allowClear
                  options={[
                    { label: 'ID', value: 'id' },
                    { label: 'Name', value: 'name' },
                  ]}
                  placeholder="请选择查询字段"
                  className="w-48"
                  nullable
                />
                <Input
                  name="keywords"
                  label="keywords"
                  placeholder="请输入关键词"
                  allowClear
                  className="w-48"
                />
                <RangePicker
                  name="timeRange"
                  label="选择日期"
                  allowClear
                  className="w-64"
                />
                <Form.Item>
                  <Space size={16}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={isValidating}
                    >
                      查询
                    </Button>
                    <Button htmlType="reset" disabled={isValidating}>
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            )}
          </Formik>
          <Space size={16}>
            <Button
              type="primary"
              htmlType="button"
              onClick={onAddClick}
              icon={<IconPlus />}
            >
              新增
            </Button>
          </Space>
          <Table
            rowKey="id"
            data={dataSource}
            columns={columns}
            border={false}
            scroll={{ x: 'max-content' }}
            pagination={pagination}
            loading={!data && isValidating}
          />
        </Layout.Content>
      </Layout>
      <Modal ref={modalRef} />
    </>
  );
}
