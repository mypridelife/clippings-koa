const nodemailer = require('nodemailer');

async function sendEmail(code: string, cnd: string) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: '163', // no need to set host or port etc.
    secureConnection: true, // 使用了 SSL
    auth: {
      user: 'mypridelife@163.com',
      pass: 'Gg147258369'
    }
  });

  const html = `<div>
    <p>
    您好！
    </p>
    <p>
    感谢您注册Your Kindle Clippings帐户。为激活您的帐户，请单击下列链接。
    </p>
    <p>
    https://www.guoyiheng.xyz/#/activation?code=${code}
    </p>
    <p>
    如果单击链接没有反应，请将链接复制到浏览器窗口中，或直接输入链接。祝您使用愉快！
    </p>
    <p>
    致敬！
    </p>
    <p>
    Your Kindle Clippings 开发者
    </p>
    </div>`;

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'mypridelife@163.com', // 发件地址
    to: cnd, // 收件列表
    subject: 'Your Kindle Clippings 帐户 - 电子邮件确认', // 标题
    html: html // html 内容
  });

  console.log('Message sent: %s', html);
}

export default sendEmail;
