import * as Koa from 'koa';
import * as json from 'koa-json';
import * as koaJwt from 'koa-jwt';
import * as KoaStatic from 'koa-static2';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import * as cors from '@koa/cors';
import * as path from 'path';
import * as pathToRegexp from 'path-to-regexp';

import { router } from './routes';
import { token } from './middlewares/token';

const app = new Koa();

app.use(token());
app.use(cors());
app.use(bodyParser());
app.use(json());
app.use(logger());

app.use(KoaStatic('assets', path.resolve(__dirname, '../assets')));
app.use(
  koaJwt({
    secret: 'jwtSecret'
  }).unless(
    // ctx => {
    //     let keys = []
    //     if (/^\/api/.test(ctx.path)) {
    //         if (
    //             pathToRegexp(
    //                 [
    //                     '/assets',
    //                     '/api/user/login',
    //                     '/api/user/register',
    //                     '/api/base/options'
    //                 ],
    //                 keys
    //             ).test(ctx.path)
    //         ) {
    //             return {
    //                 path: RegExp[...keys]
    //             }
    //         }
    //     }
    // }

    // 只要不需要token, 写到下面
    {
      path: [
        /\/assets\/uploads\/.*/,
        pathToRegexp('/api/user/login'),
        pathToRegexp('/api/user/register'),
        pathToRegexp('/api/user/activation'),
        pathToRegexp('/api/base/options')
      ]
    } // 数组中的路径不需要通过jwt验证
  )
);

app.use(async (ctx, next) => {
  const start: any = new Date();
  await next();
  const end: any = new Date();
  const ms: any = end - start;
  console.log(`${start} - ${ctx.method} ${ctx.url} - ${ms}ms`);
});
app.use(router.routes()).use(router.allowedMethods());

app.listen(8000);

console.log('server start at http://localhost:8000/');
