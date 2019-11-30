const statusCode = {
  SUCCESS: (msg: string, data?: any) => ({
    code: 200,
    msg,
    data
  }),

  ERROR_AUTH: (msg: string) => ({
    // 系统权限错误
    code: 401,
    msg
  }),

  ERROR_PARAMETER: (msg: string) => ({
    // 参数错误
    code: 444,
    msg
  }),

  ERROR_EXISTED: (msg: string) => ({
    // 用户已经存在
    code: 445,
    msg
  }),

  ERROR_NOT_EXISTED: (msg: string) => ({
    // 用户 不存在
    code: 446,
    msg
  }),

  ERROR_LOGIN: (msg: string) => ({
    // 登录失败
    code: 446,
    msg
  }),

  ERROR_SQL: (msg: string) => ({
    // 访问数据库异常
    code: 555,
    msg
  }),
  ERROR_SYSTEM: (msg: string) => ({
    // 系统未知错误
    code: 500,
    msg
  })
};

export default statusCode;
