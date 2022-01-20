import {
  Button,
  Dropdown,
  Layout,
  Menu,
  Message,
} from '@arco-design/web-react';
import { IconDown, IconMenu } from '@arco-design/web-react/icon';
import Modal from '@typedarray/arco-design-modal';
import axios from 'axios';
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Link, Outlet, To, useLocation, useNavigate } from 'react-router-dom';
import { useCookie } from 'react-use';
import { PermissionId, ResponseCode } from '../../constants';
import useUser from '../../data/useUser';
import { ResponseObject } from '../../interfaces';

interface MenuItem {
  permissionId?: string | string[];
  disabled?: boolean;
  label: ReactNode;
  caseSensitive?: boolean;
  end?: boolean;
  to: To;
  submenu?: MenuItem[];
}

const PrivateLayout: FC = ({ children }) => {
  const modalRef = useRef<Modal>(null);
  const [xSrToken, , removeXSrToken] = useCookie('x-sr-token');
  const { me, hasPermission } = useUser();

  const template = useMemo<MenuItem[]>(() => {
    return [
      {
        permissionId: PermissionId.LIST,
        label: 'List',
        to: '/todo/list',
      },
      {
        permissionId: PermissionId.LIST,
        label: 'Add',
        to: '/todo/add',
      },
    ];
  }, []);

  const location = useLocation();
  const selectedKeys = useMemo(() => {
    return template
      .filter(({ caseSensitive, end, to }) => {
        let toPathname = typeof to === 'object' ? to.pathname! : to;
        let locationPathname = location.pathname;
        if (!caseSensitive) {
          locationPathname = locationPathname.toLowerCase();
          toPathname = toPathname.toLowerCase();
        }
        const isActive =
          locationPathname === toPathname ||
          (!end &&
            locationPathname.startsWith(toPathname) &&
            locationPathname.charAt(toPathname.length) === '/');
        return isActive;
      })
      .map(({ to }) => (typeof to === 'object' ? to.pathname! : to))
      .slice(0, 1);
  }, [template, location]);

  const navigate = useNavigate();
  const onClickMenuItem = useCallback(
    key => {
      navigate(key);
    },
    [navigate]
  );
  const onLogout = useCallback(async () => {
    try {
      const res = await axios.post<ResponseObject>('/api/logout');
      if (res.data.code === ResponseCode.SUCCESS) {
        Message.success('退出成功');
      } else {
        Message.error(res.data.msg);
      }
    } catch (error) {
    } finally {
      removeXSrToken();
    }
  }, [removeXSrToken]);
  const buildMenuFromTemplate = useCallback(
    (template: MenuItem[]): ReactNode[] => {
      return template
        .filter(item => !item.disabled)
        .filter(item => hasPermission(item.permissionId))
        .map(item => {
          const toPathname =
            typeof item.to === 'object' ? item.to.pathname! : item.to;
          const submenu = item.submenu?.filter(item => !item.disabled);
          if (submenu && submenu.length > 0) {
            const menu = buildMenuFromTemplate(submenu);
            return (
              menu.length > 0 && (
                <Menu.ItemGroup key={toPathname} title={item.label}>
                  {menu}
                </Menu.ItemGroup>
              )
            );
          } else {
            return (
              <Menu.Item key={toPathname}>
                <Link to={toPathname}>{item.label}</Link>
              </Menu.Item>
            );
          }
        });
    },
    [hasPermission]
  );
  useEffect(() => {
    // 当 x-sr-token 不存在时，跳转登录页
    if (!xSrToken) {
      const redirectUri = `${location.pathname}${location.search}`;
      navigate({
        pathname: '/login',
        search:
          redirectUri !== '/'
            ? `?redirect_uri=${encodeURIComponent(redirectUri)}`
            : undefined,
      });
    }
  }, [xSrToken, navigate, location]);

  const menuItems = useMemo(
    () => buildMenuFromTemplate(template),
    [buildMenuFromTemplate, template]
  );

  return (
    <>
      <Layout className="h-full">
        <Layout.Sider theme="dark" className="hidden md:block">
          <Menu
            theme="dark"
            mode="vertical"
            selectedKeys={selectedKeys}
            onClickMenuItem={onClickMenuItem}
          >
            {menuItems}
          </Menu>
        </Layout.Sider>
        <Layout className="overflow-auto">
          <Layout.Header className="bg-white shadow flex items-center justify-between p-4 z-10">
            <div className="group md:hidden relative">
              <Button type="text" icon={<IconMenu />} />
              <Menu
                className="invisible opacity-0 rounded group-hover:visible group-hover:opacity-100 absolute w-48 transition translate-y-0 group-hover:-translate-y-1"
                mode="vertical"
                selectedKeys={selectedKeys}
                onClickMenuItem={onClickMenuItem}
              >
                {menuItems}
              </Menu>
            </div>
            <h3 className="text-base font-medium text-center whitespace-nowrap">
              React App
            </h3>
            <Dropdown
              trigger="click"
              triggerProps={{ autoAlignPopupWidth: true }}
              droplist={
                <Menu>
                  <Menu.Item key="logout" onClick={onLogout}>
                    退出登录
                  </Menu.Item>
                </Menu>
              }
            >
              <Button type="text">
                {me?.username ?? '-'} <IconDown />
              </Button>
            </Dropdown>
          </Layout.Header>
          <Layout.Content className="bg-gray-100">
            <Outlet />
          </Layout.Content>
        </Layout>
      </Layout>
      <Modal ref={modalRef} />
      {children}
    </>
  );
};

export default PrivateLayout;
