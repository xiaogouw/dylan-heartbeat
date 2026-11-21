const AiBot = require('@wecom/aibot-node-sdk');
const { generateReqId } = require('@wecom/aibot-node-sdk');

const wsClient = new AiBot.WSClient({
  botId: process.env.WECOM_BOT_ID,
  secret: process.env.WECOM_BOT_SECRET,
});

wsClient.connect();

wsClient.on('authenticated', () => {
  console.log('🔐 认证成功，机器人已上线');
});

wsClient.on('message.text', async (frame) => {
  const content = frame.body.text?.content;
  console.log('收到：', content);

  const streamId = generateReqId('stream');
  wsClient.replyStream(frame, streamId, '正在思考中...', false);

  // TODO: 换成你自己的 DeepSeek 函数
  const reply = '收到：' + content;

  wsClient.replyStream(frame, streamId, reply, true);
});

wsClient.on('event.enter_chat', (frame) => {
  wsClient.replyWelcome(frame, {
    msgtype: 'text',
    text: { content: '你好，我是你的 AI 助手' },
  });
});

process.on('SIGINT', () => {
  wsClient.disconnect();
  process.exit(0);
});
