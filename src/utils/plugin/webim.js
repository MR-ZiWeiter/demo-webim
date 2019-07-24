import store from '@/store'
// require('Strophe')
// window.Strophe = require('strophe.js').Strophe
let WebIM = require('hx-websdk')
// require('hx-emedia')
// require('webrtc')

WebIM.WebRTC = require('hx-webrtc')
console.log(WebIM)
WebIM.config = {
  /*
   * XMPP server
   */
  xmppURL: 'im-api.easemob.com',
  /*
   * Backend REST API URL
   */
  apiURL: (location.protocol === 'https:' ? 'https:' : 'http:') + '//a1.easemob.com',
  /*
   * Application AppKey
   */
  appkey: '1137181009253489#ebuyhouse',

  /*
   * Whether to use wss
   * @parameter {Boolean} true or false
   */
  https: location.protocol === 'https:',
  /*
   * isMultiLoginSessions
   * true: A visitor can sign in to multiple webpages and receive messages at all the webpages.
   * false: A visitor can sign in to only one webpage and receive messages at the webpage.
   */
  isMultiLoginSessions: false,
  /*
   * set presence after login
   */
  isAutoLogin: true,
  /**
   * Whether to use window.doQuery()
   * @parameter {Boolean} true or false
   */
  isWindowSDK: false,
  /**
   * isSandBox=true:  xmppURL: 'im-api-sandbox.easemob.com',  apiURL: '//a1-sdb.easemob.com',
   * isSandBox=false: xmppURL: 'im-api.easemob.com',          apiURL: '//a1.easemob.com',
   * @parameter {Boolean} true or false
   */
  isSandBox: false,
  /**
   * Whether to console.log in strophe.log()
   * @parameter {Boolean} true or false
   */
  isDebug: false,
  /**
   * will auto connect the xmpp server autoReconnectNumMax times in background when client is offline.
   * won't auto connect if autoReconnectNumMax=0.
   */
  autoReconnectNumMax: 2,
  /**
   * the interval seconds between each auto reconnectting.
   * works only if autoReconnectMaxNum >= 2.
   */
  autoReconnectInterval: 2,
  /**
   * webrtc supports WebKit and https only
   */
  isWebRTC: (/Firefox/.test(navigator.userAgent) || /WebKit/.test(navigator.userAgent)) && /^https:$/.test(window.location.protocol),
  /**
   * after login, send empty message to xmpp server like heartBeat every 45s, to keep the ws connection alive.
   */
  heartBeatWait: 4500,
  /**
   * while http access,use ip directly,instead of ServerName,avoiding DNS problem.
   */
  isHttpDNS: false,

  /**
   * Will show the status of messages in single chat
   * msgStatus: true  show
   * msgStatus: true  hide
   */
  msgStatus: true,

  /**
   * When a message arrived, the receiver send an ack message to the
   * sender, in order to tell the sender the message has delivered.
   * See call back function onReceivedMessage
   */
  delivery: true,

  /**
   * When a message read, the receiver send an ack message to the
   * sender, in order to tell the sender the message has been read.
   * See call back function onReadMessage
   */
  read: false,

  /**
   * Will encrypt text message and emoji message
   * {type:'none'}   no encrypt
   * {type:'base64'} encrypt with base64
   * {type:'aes',mode: 'ebc',key: '123456789easemob',iv: '0000000000000000'} encrypt with aes(ebc)
   * {type:'aes',mode: 'cbc',key: '123456789easemob',iv: '0000000000000000'} encrypt with aes(cbc)
   */
  encrypt: {
    type: 'none'
  }
}
WebIM.Emoji = {
  path: '/static/images/faces/',
  map: {
    '[):]': 'ee_1.png',
    '[:D]': 'ee_2.png',
    '[;)]': 'ee_3.png',
    '[:-o]': 'ee_4.png',
    '[:p]': 'ee_5.png',
    '[(H)]': 'ee_6.png',
    '[:@]': 'ee_7.png',
    '[:s]': 'ee_8.png',
    '[:$]': 'ee_9.png',
    '[:(]': 'ee_10.png',
    '[:\'(]': 'ee_11.png',
    '[:|]': 'ee_12.png',
    '[(a)]': 'ee_13.png',
    '[8o|]': 'ee_14.png',
    '[|]': 'ee_15.png',
    '[+o(]': 'ee_16.png',
    '[<o)]': 'ee_17.png',
    '[|-)]': 'ee_18.png',
    '[*-)]': 'ee_19.png',
    '[:-#]': 'ee_20.png',
    '[:-*]': 'ee_21.png',
    '[^o)]': 'ee_22.png',
    '[8-)]': 'ee_23.png',
    '[(|)]': 'ee_24.png',
    '[(u)]': 'ee_25.png',
    '[(S)]': 'ee_26.png',
    '[(*)]': 'ee_27.png',
    '[(#)]': 'ee_28.png',
    '[(R)]': 'ee_29.png',
    '[({)]': 'ee_30.png',
    '[(})]': 'ee_31.png',
    '[(k)]': 'ee_32.png',
    '[(F)]': 'ee_33.png',
    '[(W)]': 'ee_34.png',
    '[(D)]': 'ee_35.png'
  }
}
WebIM.NewEmoji = {
  map: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😵', '🤯', '🤠', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹', '😮', '😯', '😲', '😳', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '💋', '👋', '🤚', '🖐', '✋', '🖖', '👌', '✌', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍', '💅', '🤳', '💪', '👂', '👃', '🧠', '👀', '👁', '👅', '👄', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👱‍', '👨‍', '👨‍', '👨‍', '👨‍', '👩', '👱‍', '👩‍', '👩‍', '👩‍', '👩‍', '🧓', '👴', '👵', '🙍', '🙍‍', '🙍‍', '🙎', '🙎‍', '🙎‍', '🙅', '🙅‍', '🙅‍', '🙆', '🙆‍', '🙆‍', '💁', '💁‍', '💁‍', '🙋', '🙋‍', '🙋‍', '🙇', '🙇‍', '🙇‍', '🤦', '🤦‍', '🤦‍', '🤷', '🤷‍', '🤷‍', '👨‍⚕️', '👩‍⚕️', '👨‍🎓', '👩‍🎓', '👨‍🏫', '👩‍🏫', '👨‍⚖️', '👩‍⚖️', '👨‍🌾', '👩‍🌾', '👨‍🍳', '👩‍🍳', '👨‍🔧', '👩‍🔧', '👨‍🏭', '👩‍🏭', '👨‍💼', '👩‍💼', '👨‍🔬', '👩‍🔬', '👨‍💻', '👩‍💻', '👨‍🎤', '👩‍🎤', '👨‍🎨', '👩‍🎨', '👨‍✈️', '👩‍✈️', '👨‍🚀', '👩‍🚀', '👨‍🚒', '👩‍🚒', '👮', '👮‍♂️', '👮‍♀️', '🕵Det', '🕵️‍♂️', '🕵️‍♀️', '💂', '💂‍', '💂‍', '👷', '👷‍', '👷‍', '🤴', '👸', '👳', '👳‍', '👳‍', '👲', '🧕', '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶', '🧙', '🧙‍', '🧙‍', '🧚', '🧚‍', '🧚‍', '🧛', '🧛‍', '🧛‍', '🧜', '🧜‍', '🧜‍', '🧝', '🧝‍', '🧝‍', '🧞', '🧞‍', '🧞‍', '🧟', '🧟‍', '🧟‍', '💆', '💆‍', '💆‍', '💇', '💇‍', '💇‍', '🚶', '🚶‍', '🚶‍', '🏃', '🏃‍', '🏃‍', '💃', '🕺', '🕴', '👯', '👯‍', '👯‍', '🧖', '🧖‍', '🧖‍', '🧘', '👭', '👫', '👬', '💏', '👨‍', '👩‍', '💑', '👨‍', '👩‍', '👪', '👨‍👩‍👦', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', '👨‍👨‍👦', '👨‍👨‍👧', '👨‍👨‍👧‍👦', '👨‍👨‍👦‍👦', '👨‍👨‍👧‍👧', '👩‍👩‍👦', '👩‍👩‍👧', '👩‍👩‍👧‍👦', '👩‍👩‍👦‍👦', '👩‍👩‍👧‍👧', '👨‍👦', '👨‍👦‍👦', '👨‍👧', '👨‍👧‍👦', '👨‍👧‍👧', '👩‍👦', '👩‍👦‍👦', '👩‍👧', '👩‍👧‍👦', '👩‍👧‍👧', '🗣', '👤', '👥', '👣', '🌂', '☂', '👓', '🕶', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '👙', '👚', '👛', '👜', '👝', '🎒', '👞', '👟', '👠', '👡', '👢', '👑', '👒', '🎩', '🎓', '🧢', '⛑', '💄', '💍', '💼']
}
/* eslint new-cap: ["error", { "newIsCap": false }] */
const conn = new WebIM.connection({
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
  https: WebIM.config.https,
  url: WebIM.config.xmppURL,
  heartBeatWait: WebIM.config.heartBeatWait,
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
  autoReconnectInterval: WebIM.config.autoReconnectInterval,
  apiUrl: WebIM.config.apiURL,
  isAutoLogin: true
})
conn.listen({
  // 连接成功回调
  onOpened: function (message) {
    conn.getRoster({
      success: function (roster) {
        console.log(roster)
        roster.map(item => {
          if (item.subscription === 'both') {
            store.dispatch('AsyncUpdateUserFriendList', item)
          }
        })
      }
    })
    console.log('------------>>>>>>>连接成功<<<<<<<<<----------------')
  },
  // 收到文本消息
  onTextMessage: function (message) {
    console.log(message)
    // message.
    store.dispatch('AsyncUpdateCurrentUserMessageList', message)
  },
  // 收到表情信息
  onEmojiMessage: function (message) {
    // 处理表情消息
    message.data = message.data.map(item => {
      if (item.type === 'emoji') {
        return `<img src="${item.data}" data-emoji="${item.data}" data-type="${item.type}"/>`
      } else {
        return item.data
      }
    }).join('')
    console.log(message)
    store.dispatch('AsyncUpdateCurrentUserMessageList', message)
  },
  // 收到图片消息
  onPictureMessage: function (message) {
    console.log(message)
    message.data = `<img src="${message.url}" />`
    store.dispatch('AsyncUpdateCurrentUserMessageList', message)
  },
  // 收到联系人订阅请求、处理群组、聊天室被踢解散等消息
  onPresence: function (e) {
    // console.log(message)
    // （发送者希望订阅接收者的出席信息），即别人申请加你为好友
    if (e.type === 'subscribe') {
      console.log(e)
      // 更新未处理好友列表
      store.dispatch('AsyncUpateUserUnProcessedList', e)
    }

    // (发送者允许接收者接收他们的出席信息)，即别人同意你加他为好友
    if (e.type === 'subscribed') {
      console.log(e)
    }

    // （发送者取消订阅另一个实体的出席信息）,即删除现有好友
    if (e.type === 'unsubscribe') {
      console.log(e)
    }

    // （订阅者的请求被拒绝或以前的订阅被取消），即对方单向的删除了好友
    if (e.type === 'unsubscribed') {
      console.log(e)
    }
  },
  // 处理好友申请
  onRoster: function () {
    conn.getRoster({
      success: function (roster) {
        console.log(roster)
        store.dispatch('AsyncUpdateUserFriendList', [])
        roster.map(item => {
          if (item.subscription === 'both') {
            store.dispatch('AsyncUpdateUserFriendList', item)
          }
        })
      }
    })
  },
  // 消息回执
  onDeliveredMessage (message) {
    console.log('消息回执')
    console.log(message)
  },
  onAudioMessage: function (message) {
    console.log('音频消息')
    console.log(message)
    message.data = `<audio src="${message.url}" controls><source src="${message.url}" type="audio/mp3" /></audio>`
    store.dispatch('AsyncUpdateCurrentUserMessageList', message)
  }, // 收到音频消息
  onLocationMessage: function (message) { console.log('当前关闭') }, // 收到位置消息
  onFileMessage: function (message) {
    console.log('文件消息')
    console.log(message)
    message.data = `<a href="${message.url}" download="${message.url}" style="display: flex; width: 150px; height: 80px; border-radius: 5px; justify-content: center; align-items: center; flex-direction: column; color: #1281fc; background: #fff;"><i class="iconfont icon-nav_article1" style="font-size: 30px"></i><span style="font-size: 14px">Click Me Download File</span></a>`
    store.dispatch('AsyncUpdateCurrentUserMessageList', message)
  }, // 收到文件消息
  onVideoMessage: function (message) {
    console.log('视频消息')
    console.log(message)
    message.data = `<video src="${message.url}" controls><source src="${message.url}" type="audio/mp4" /></video>`
    store.dispatch('AsyncUpdateCurrentUserMessageList', message)
  }, // 收到视频消息
  onInviteMessage: function (message) { console.log('当前关闭') }, // 处理群组邀请
  onOnline: function () { console.log('当前关闭') }, // 本机网络连接成功
  onOffline: function () { console.log('当前关闭') }, // 本机网络掉线
  // 失败回调
  onError: function (message) {
    console.log('登录失败---------------->')
    console.log(message)
    console.log('登录失败---------------->')
  }
})

const rtcCall = new WebIM.WebRTC.Call({
  connection: conn,
  mediaStreamConstaints: {
    audio: true,
    video: true
  },

  listener: {
    onAcceptCall: function (from, options) {
      // console.log('onAcceptCall::', 'from: ', from, 'options: ', options);
    },
    onGotRemoteStream: function (stream, streamType) {
      // console.log('onGotRemoteStream::', 'stream: ', stream, 'streamType: ', streamType);
    },
    onGotLocalStream: function (stream, streamType) {
      // console.log('onGotLocalStream::', 'stream:', stream, 'streamType: ', streamType);
    },
    onRinging: function (caller) {
      // let reg = /(?<=_).*(?=@)/
      // let callerId = (reg.exec(caller))[0]
      // let curUser = []
      // let friends = store.state.data.friends
      // for (let i in friends) {
      //   if (friends[i].username === callerId) {
      //     curUser = friends[i]
      //   }
      // }
      // console.log(curUser)
      // router.push({ path: '/calling', query: { user: curUser, curBtn: true } })
    },
    onTermCall: function (reason) {
      console.log('onTermCall::')
      console.log('reason:', reason)
    },
    onIceConnectionStateChange: function (iceState) {
      if (iceState === 'closed') {
        // router.push({ path: '/friends' })
      }
    },
    onError: function (e) {
      console.log(e)
    }
  }
})

const imOptions = {
  apiUrl: WebIM.config.apiURL,
  user: null,
  pwd: '123456',
  appKey: WebIM.config.appkey
}
// 全局注册WebIM
window.WebIM = WebIM

// conn.open(imOptions)

export default {
  install: function (Vue, options) {
    // console.log(WebIM)
    Object.defineProperty(Vue.prototype, '$WebIM', { value: WebIM })
    Object.defineProperty(Vue.prototype, '$imConn', { value: conn })
    Object.defineProperty(Vue.prototype, '$rtcCall', { value: rtcCall })
    Object.defineProperty(Vue.prototype, '$WebImOptions', { value: imOptions })
  }
}
