import { rest } from 'msw';

let items: { id: number; description: string; completed: boolean }[] = [
  {
    id: 1,
    description: 'test',
    completed: false,
  },
  {
    id: 2,
    description: 'test2',
    completed: true,
  },
  {
    id: 3,
    description: 'test3',
    completed: false,
  },
];
const xSrToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
export const handlers = [
  rest.post('/api/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 'Success',
        data: {
          xSrToken,
        },
      })
    );
  }),
  rest.post('/api/logout', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 'Success',
      })
    );
  }),
  rest.post('/api/user', (req, res, ctx) => {
    // Check if the user is authenticated in this session
    const isAuthenticated = req.cookies['x-sr-token'] === xSrToken;
    if (!isAuthenticated) {
      // If not authenticated, respond with a 403 error
      return res(
        ctx.status(403),
        ctx.json({
          code: 'Not authorized',
        })
      );
    }
    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.json({
        code: 'Success',
        data: {
          username: `用户名称`,
          permissionIds: ['react.permission.list', 'react.permission.add'],
        },
      })
    );
  }),
  rest.post('/api/todo/list', (req, res, ctx) => {
    return res(
      ctx.delay(500),
      ctx.json({
        code: 'Success',
        data: {
          total: 100,
          pageSize: 10,
          pageNum: 1,
          data: items,
        },
      })
    );
  }),
  rest.post('/api/todo/detail', (req, res, ctx) => {
    // @ts-ignore
    const { id } = req.body;
    const target = items.find(item => item.id === id);
    return res(
      ctx.delay(500),
      ctx.json({
        code: 'Success',
        data: target,
      })
    );
  }),
  rest.post('/api/todo/add', (req, res, ctx) => {
    // @ts-ignore
    const { description } = req.body;
    const id = (items.at(-1)?.id ?? 0) + 1;
    const newItem = {
      id,
      description: description,
      completed: false,
    };
    items = [...items, newItem];
    return res(
      ctx.delay(500),
      ctx.json({
        code: 'Success',
        data: newItem,
      })
    );
  }),
];
