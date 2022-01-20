import { Spin } from '@arco-design/web-react';
import useUser from '../../data/useUser';
import AccessDenied from '../AccessDenied';

interface Props {
  element: React.ReactElement | null;
  permissionId?: string;
}

export const PrivateRoute: React.FC<Props> = ({ element, permissionId }) => {
  const { isValidating, hasPermission } = useUser();

  return hasPermission(permissionId) ? (
    element
  ) : isValidating ? (
    <div className="relative w-full h-full flex items-center justify-center">
      <Spin dot className="absolute top-1/3" />
    </div>
  ) : (
    <AccessDenied />
  );
};
