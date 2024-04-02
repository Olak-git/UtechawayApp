
export const refreshColor = ['red', 'blue', 'green'];

export const msgs = [
  {
    id: `1`,
    type: 'text',
    content: 'hello world',
    targetId: '12345678',
    chatInfo: {
      avatar: require('../assets/images/2.png'),
      id: '12345678',
      nickName: 'Test'
    },
    renderTime: true,
    sendStatus: 0,
    time: '1542006036549'
  },
  {
    id: `2`,
    type: 'text',
    content: 'hi/{se}',
    targetId: '12345678',
    chatInfo: {
      avatar: require('../assets/images/2.png'),
      id: '12345678',
      nickName: 'Test'
    },
    renderTime: true,
    sendStatus: 0,
    time: '1542106036549'
  },
  {
    id: `3`,
    type: 'image',
    content: {
      uri: 'https://upload-images.jianshu.io/upload_images/11942126-044bd33212dcbfb8.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/300/h/240',
      width: 100,
      height: 80,
    } ,
    targetId: '12345678',
    chatInfo: {
      avatar: require('../assets/images/2.png'),
      id: '12345678',
      nickName: 'Test'
    },
    renderTime: false,
    sendStatus: 0,
    time: '1542106037000'
  },
  {
    id: `4`,
    type: 'text',
    content: '你好/{weixiao}',
    targetId: '88886666',
    chatInfo: {
      avatar: require('../assets/images/2.png'),
      id: '12345678'
    },
    renderTime: true,
    sendStatus: -2,
    time: '1542177036549'
  },
  {
    id: `10`,
    type: 'text',
    content: 'Rien à dire les amis!',
    targetId: '88886666',
    chatInfo: {
      avatar: require('../assets/images/2.png'),
      id: '12345678'
    },
    renderTime: false,
    sendStatus: 1,
    time: '1542177036549'
  },
  {
    id: `5`,
    type: 'voice',
    content: {
      uri: 'http://m10.music.126.net/20190810141311/78bf2f6e1080052bc0259afa91cf030d/ymusic/d60e/d53a/a031/1578f4093912b3c1f41a0bfd6c10115d.mp3',
      length: 10
    },
    targetId: '12345678',
    chatInfo: {
      avatar: require('../assets/images/2.png'),
      id: '12345678',
      nickName: 'Test'
    },
    renderTime: true,
    sendStatus: 1,
    time: '1542260667161'
  },
  {
    id: `6`,
    type: 'voice',
    content: {
      uri: 'http://m10.music.126.net/20190810141311/78bf2f6e1080052bc0259afa91cf030d/ymusic/d60e/d53a/a031/1578f4093912b3c1f41a0bfd6c10115d.mp3',
      length: 30
    },
    targetId: '88886666',
    chatInfo: {
      avatar: require('../assets/images/2.png'),
      id: '12345678'
    },
    renderTime: true,
    sendStatus: 1,
    time: '1542264667161'
  }
];



  export const _messages = [
    {
      _id: 1,
      text: 'Hello',
      createdAt: new Date(),
      user: {
        _id: 'admin',
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/300',
      },
    },
    {
      _id: 2,
      text: 'Hello22!!!',
      createdAt: new Date(),
      user: {
        _id: 'admin',
        name: 'Jane Doe',
        avatar: 'https://i.pravatar.cc/300',
      },
    },
    {
      _id: 3,
      text: 'Hello!!!',
      createdAt: new Date(),
      user: {
        _id: 'client',
        name: 'Richo',
        avatar: 'https://i.pravatar.cc/300',
      },
    },
    {
      _id: 4,
      text: 'Hello!!!',
      createdAt: new Date(),
      user: {
        _id: 'admin',
        name: 'Jane Doe',
        avatar: 'https://i.pravatar.cc/300',
      },
    },
    {
      _id: 5,
      text: 'Hello!!!',
      createdAt: new Date(), //dayjs().add(2, 'day').toDate(),
      user: {
        _id: 'client',
        name: 'Richo',
        avatar: 'https://i.pravatar.cc/300',
      },
    },
    {
      _id: 6,
      text: 'http://google.com Hello!!!',
      createdAt: new Date(), //dayjs().add(2, 'day').toDate(),
      user: {
        _id: 'client',
        name: 'Richo',
        avatar: 'https://i.pravatar.cc/300',
      },
    },
    {
      _id: 7,
      text: '#hashtag Hello!!!',
      createdAt: new Date(), //dayjs().add(2, 'day').toDate(),
      user: {
        _id: 'admin',
        name: 'Jane Doe',
        avatar: 'https://i.pravatar.cc/300',
      },
    },
    {
      _id: 8,
      text: '#hashtag Hello!!!',
      createdAt: new Date(), //dayjs().add(2, 'day').toDate(),
      user: {
        _id: 'client',
        name: 'Richo',
        avatar: 'https://i.pravatar.cc/300',
      },
      video: 'https://storage.googleapis.com/gtv-v_ideos-bucket/sample/BigBuckBunny.mp4',
    },
    {
      _id: 9,
      text: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
      The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`,
      createdAt: new Date(), //dayjs().add(2, 'day').toDate(),
      user: {
        _id: 'admin',
        name: 'Jane Doe',
        avatar: 'https://i.pravatar.cc/300',
      }
    },
  ];