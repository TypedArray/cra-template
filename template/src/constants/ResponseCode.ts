// @ts-nocheck
const ResponseCode = {
  /**
   * 请求成功
   */
  SUCCESS: 'Success',
  /**
   * 操作失败
   */
  FAILED_OPERATION: 'FailedOperation',
  /**
   * 身份校验失败，应该重新登录
   */
  AUTH_FAIL: 'TokenCheckFailure',
  /**
   * 网络错误
   */
  NETWORK_ERR: 'NetworkError',
  /**
   * 没有权限，就是不能进系统
   */
  NO_PERMISSION: 'NotPermissionsError'
};

export { ResponseCode };
