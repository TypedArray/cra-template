/**
 * 分页列表对象
 */
export interface PaginationObject<T = any> {
  /**
   * 数据总数
   */
  total: number;
  /**
   * 每页数据条数
   */
  pageSize: number;
  /**
   * 当前页
   */
  pageNum: number;
  /**
   * 当前页数据
   */
  data: T[];
}
