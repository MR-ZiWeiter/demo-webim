<template>
  <section class="message-container">
    <section :class="['main-container', 'el-dialogs', isShowHistoryList ? 'history-active' : '', isFullScreen ? 'fullScreen' : '']">
      <!-- 左侧栏列表区 -->
      <section class="contact-left-list left">
        <section class="contack-message-modules">
          <header class="contack-me-info">
            <section class="contack-me-author-img">
              <img :src="MyHeaderImg" alt="">
            </section>
          </header>
          <section class="contack-user-type-list">
            <ul class="contack-user-type-box">
              <!-- 'signet' -->
              <li
                v-for="item in userModules"
                @click="switchUserModuleChange(item)"
                :class="['contack-user-type-item', currentType.id === item.id ? 'active' : '', isModuleSignet(item) ? 'signet' : '']"
                :key="item.id">
                <i :class="[item.icon]"></i>
              </li>
            </ul>
          </section>
        </section>
        <!-- 搜索+用户列表 -->
        <section class="current-user-list">
          <header class="search-info">
            <section class="search-box">
              <el-input class="search-user-input" v-model="searchUserKeyWord" :placeholder="searchUserPlaceholder" @click.enter="filterList">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="filterList"></i>
              </el-input>
            </section>
          </header>
          <section class="user-list-box">
            <!-- 类型一 消息列表 -->
            <ul class="user-list" v-if="currentType.id == 0">
              <!-- <li class="user-item"></li> -->
              <li :class="['user-item', currentMessageInfo.from === item.from ? 'active' : '', item.loginType === 1 ? 'Online' : 'Offline']" v-for="(item, index) in filterMessageUserList" :key="index" @click="switchMessageChange(item)">
                <section class="user-item-author-info">
                  <img class="user-item-author-img" :src="filterDesignation(item.from, 'headUrl') || '/static/img/common/header/avatar.png'">
                  <span :class="['user-item-author-name', item.signet ? 'signet' : '']">
                    {{filterDesignation(item.from, 'nickname')}}
                  </span>
                </section>
                <i class="el-icon-close" @click.stop="handlerDesignationDeleteChange(item.from)"></i>
              </li>
              <li class="user-item no-data" v-if="filterMessageUserList.length === 0">
                <span>no data</span>
              </li>
            </ul>
            <!-- 类型二 客服列表 -->
            <ul class="user-list" v-if="currentType.id == 1">
              <!-- <li class="user-item"></li> -->
              <li :class="['user-item', currentServiceInfo.hxusername === item.hxusername ? 'active' : '', item.loginType === 1 ? 'Online' : 'Offline']" v-for="(item, index) in filterServiceUserList" :key="index" @click="switchMessageServiceChange(item)">
                <section class="user-item-author-info">
                  <img class="user-item-author-img" :src="item.headUrl || '/static/img/common/header/avatar.png'">
                  <span :class="['user-item-author-name', item.signet ? 'signet' : '']">
                    {{item.accountName}}
                  </span>
                </section>
                <!-- <i class="el-icon-close" @click.stop="deleteFriend(item)"></i> -->
              </li>
              <li class="user-item no-data" v-if="filterServiceUserList.length === 0">
                <span>no data</span>
              </li>
            </ul>
            <!-- 类型三 好友列表 -->
            <ul class="user-list" v-if="currentType.id == 2">
              <li :class="['user-item', !currentUserInfo.name ? 'active' : '']" @click="currentUserChange({})">
                <section class="user-item-author-info">
                  <i class="user-item-author-img iconfont icon-message_newfriends"></i>
                  <span :class="['user-item-author-name', userUnprocessedList.length !== 0 ? 'signet' : '']">
                    New Friends
                  </span>
                </section>
              </li>
              <!-- v-if="filterFriendUserList.length !== 0" -->
              <li :class="['user-item', currentUserInfo.name === item.name ? 'active' : '', item.loginType === 1 ? 'Online' : 'Offline']" v-for="(item, index) in filterFriendUserList" :key="index" @click="currentUserChange(item)">
                <section class="user-item-author-info">
                  <img class="user-item-author-img" :src="filterDesignation(item.name, 'headUrl') || '/static/img/common/header/avatar.png'">
                  <span :class="['user-item-author-name', item.signet ? 'signet' : '']">
                    {{filterDesignation(item.name, 'nickname')}}
                  </span>
                </section>
                <!-- <i class="el-icon-close" @click.stop="deleteFriend(item)"></i> -->
              </li>
              <!-- <li class="user-item" v-else>
                <span>no data</span>
              </li> -->
            </ul>
          </section>
        </section>
      </section>
      <!-- 右侧内容区 -->
      <!-- modules-1 -->
      <section v-if="currentType.id === 0 || currentType.id === 1" class="contack-right-content right">
        <!-- 顶部tools工具栏 -->
        <header class="contack-user-name-tools-bar top el-dialog__header">
          <!-- <i :class="['iconfont', CurrentUser.loginType === 1 ? 'icon-online online' : 'icon-lixian offline']"></i> -->
          <h3 class="to-user-name">{{filterDesignation(selectObj().from, 'nickname')}}</h3>
          <section class="tools-bar">
            <span class="tools-item">
              <i :class="['iconfont', isFullScreen ? 'icon-suofang' : 'icon-icon--']" @click="zoomMessage"></i>
            </span>
            <span class="tools-item">
              <i class="iconfont icon-guanbi" @click="closeMessage"></i>
            </span>
          </section>
        </header>
        <!-- 内容区 -->
        <section class="contack-content">
          <!-- 消息内容 -->
          <section class="contack-message-container">
            <!-- 聊天记录模块 -->
            <section class="contack-message-content">
              <!-- 提示语 -->
              <section class="contack-message-content-fixed-power" v-if="TipConfig.isShow">
                <img class="contack-message-content-fixed-power-left" src="/static/img/message/04.png">
                <span class="contack-message-content-fixed-power-title">{{TipConfig.content}}</span>
                <i class="contack-message-content-fixed-power-close el-icon-close" @click="TipConfig.isShow = !TipConfig.isShow"></i>
              </section>
              <!-- 聊天内容盒子 -->
              <section class="contack-message-content-list-box" ref="messageBox">
                <ul class="current-user-message-list-box">
                  <li :class="['current-user-message-item', selectObj().from !== message.to ? 'message-left' : 'message-right']" v-for="(message, index) in (currentType.id === 0 ? messageList : currentType.id === 1 ? messageServiceList : [])" :key="index">
                    <section class="user-author-img">
                      <img class="author-img" :src="message.to === selectObj().from ? MyHeaderImg : filterDesignation(selectObj().from, 'headUrl')">
                    </section>
                    <section class="message-card-item-house-info">
                      <section class="message-content-style">
                        <article class="message-html-content" v-html="message.data"></article>
                        <section class="card-list-item" v-if="$options.filters.isShowCardItem(message)" @click="openHouseInfo(message.ext)">
                          <header class="header-img">
                            <img :src="message.ext.imgUrl">
                          </header>
                          <footer class="footer-intro">
                            <h4><span class="mini">$ </span>{{ message.ext.price }}</h4>
                            <section class="intro">
                              <section class="icons-items">
                                <!-- <img src="/static/img/listing/icons/utils_bads.png" alt="Bedrooms"> -->
                                <span>{{ message.ext.bedroom !== 'studio' ? message.ext.bedroom + ' bds' : message.ext.bedroom }}</span>
                              </section>
                              <section class="icons-items">
                                <!-- <img src="/static/img/listing/icons/utils_baths.png" alt="Bathrooms"> -->
                                <span class="padding-5">●</span>
                                <span>{{ message.ext.bathroom }} ba</span>
                              </section>
                              <section class="icons-items">
                                <!-- <img src="/static/img/listing/icons/utils_sqft.png" alt="Sqft"> -->
                                <span class="padding-5">●</span>
                                <span>{{ message.ext.lotSqft }} Sqft</span>
                              </section>
                            </section>
                            <footer class="art-itro">
                              <article>{{ message.ext.street }}</article>
                            </footer>
                          </footer>
                        </section>
                      </section>
                      <span>{{message.time|timerFormat}}</span>
                    </section>
                  </li>
                </ul>
              </section>
            </section>
            <hr>
            <!-- 底部输入模块 -->
            <section class="contack-message-insert">
              <!-- 工具栏 -->
              <header class="contack-message-insert-tools-bar">
                <!-- 左侧工具栏 -->
                <section class="tools-bar-box">
                  <el-tooltip placement="top-start" effect="light" popper-class="Emoji">
                    <template slot="content">
                      <section class="emojiType">
                        <el-tabs type="border-card" tab-position="bottom" class="tab-customer-emoji">
                          <el-tab-pane class="tab-emoji">
                            <span slot="label" class="label-sty">
                              <!-- <i class="el-icon-date"></i> -->
                              <img src="/static/images/faces/ee_1.png" alt="imgEmoji">
                            </span>
                            <ul class="emoji-box">
                              <li class="emoji-item" v-for="item in EmojiList" :key="item.id" v-show="item.type === 'img'" @click="addEmoji(item)">
                                <img :src="item.img" :data-emoji-id="item.emoji">
                                <!-- <span v-if="item.type === 'emoji'">{{ item.img }}</span> -->
                              </li>
                            </ul>
                          </el-tab-pane>
                          <el-tab-pane class="tab-emoji">
                            <span slot="label" class="label-sty">
                              <!-- <i class="el-icon-date"></i> -->
                              😃
                            </span>
                            <ul class="emoji-box">
                              <li class="emoji-item" v-for="item in EmojiList" :key="item.id" v-show="item.type === 'emoji'" @click="addEmoji(item)">
                                <!-- <img v-if="item.type === 'img'" :src="item.img" :data-emoji-id="item.emoji"> -->
                                <span>{{ item.img }}</span>
                              </li>
                            </ul>
                          </el-tab-pane>
                        </el-tabs>
                      </section>
                      <!-- <ul class="emoji-box">
                        <li class="emoji-item" v-for="item in EmojiList" :key="item.id" @click="addEmoji(item)">
                          <img v-if="item.type === 'img'" :src="item.img" :data-emoji-id="item.emoji">
                          <span v-if="item.type === 'emoji'">{{ item.img }}</span>
                        </li>
                      </ul> -->
                    </template>
                    <span class="tools-item">
                      <!-- <img src="/static/img/message/02.png" alt> -->
                      <i class="iconfont icon-message_face"></i>
                    </span>
                  </el-tooltip>
                  <span class="tools-item">
                    <label for="imgFileImg">
                      <!-- <img src="/static/img/message/01.png" alt> -->
                      <i class="iconfont icon-message_photo"></i>
                    </label>
                    <input id="imgFileImg" type="file" ref="selectFileImg" accept="image/*" @change="autoSendFileChange($event, 'img')">
                  </span>
                  <!-- <span class="tools-item">
                    <label for="imgFile">
                      <i class="iconfont icon-message_document"></i>
                    </label>
                    <input id="imgFile" type="file" ref="selectFile" @change="autoSendFileChange($event, 'file')">
                  </span>
                  <span class="tools-item">
                    <label for="voiceFile">
                      <i class="iconfont icon-message_voice"></i>
                    </label>
                    <input id="voiceFile" type="file" ref="selectFileVoice" accept="audio/*" @change="autoSendFileChange($event, 'audio')">
                  </span>
                  <span class="tools-item">
                    <label for="videoFile">
                      <i class="iconfont icon-message_video"></i>
                    </label>
                    <input id="videoFile" type="file" ref="selectFileVideo" accept="video/*" @change="autoSendFileChange($event, 'video')">
                  </span> -->
                </section>
                <!-- 右侧历史记录 -->
                <section class="contack-message-insert-history">
                  <section class="tools-btn-history" @click="switchOpenHistoryWindow">
                    <i class="el-icon-date"></i>
                    <span>Message History</span>
                  </section>
                </section>
              </header>
              <!-- 弹窗层 -->
              <el-popover
                popper-class="showHouseInfoClassOffsetHeight"
                ref="houseInfo"
                v-model="isShowHouseInfoBox"
                placement="top-start"
                :visible-arrow="false"
                offset="50"
                :disabled="isShowHouseInfo || !CurrentUser.fromName"
                trigger="click">
                <section class="card-list-item" @click="sendHouseMessage(houseInfoInformation)">
                  <header class="header-img">
                    <img :src="houseInfoInformation.imgUrl">
                  </header>
                  <footer class="footer-intro">
                    <h4><span class="mini">$ </span>{{ houseInfoInformation.price|priceFormat }}</h4>
                    <section class="intro">
                      <section class="icons-items">
                        <!-- <img src="/static/img/listing/icons/utils_bads.png" alt="Bedrooms"> -->
                        <span>{{ houseInfoInformation.bedroom !== 'studio' ? houseInfoInformation.bedroom + ' bds' : houseInfoInformation.bedroom }}</span>
                      </section>
                      <section class="icons-items">
                        <span class="padding-5">●</span>
                        <!-- <img src="/static/img/listing/icons/utils_baths.png" alt="Bathrooms"> -->
                        <span>{{ houseInfoInformation.bathroom }} ba</span>
                      </section>
                      <section class="icons-items">
                        <!-- <img src="/static/img/listing/icons/utils_sqft.png" alt="Sqft"> -->
                        <span class="padding-5">●</span>
                        <span>{{ houseInfoInformation.livingSqft|priceFormat }} sqft</span>
                      </section>
                    </section>
                    <footer class="art-itro">
                      <article>{{ houseInfoInformation.street }}</article>
                    </footer>
                  </footer>
                </section>
              </el-popover>
              <!-- 输入框 @keydown.enter="sendMessage" -->
              <cite
                ref="execInput"
                :disabled="!selectObj().from"
                v-popover:houseInfo
                placeholder="place input content"
                @drop="dragInputChange"
                @paste="paste"
                @input="input"
                @keydown="shiftAndEnterSend"
                contenteditable>
              </cite>
              <!-- 底部按钮组 发送消息等 -->
              <section class="contack-message-buttom-btn">
                <section class="contack-message-buttom-btn-close" @click="closeMessage">Close</section>
                <section class="contack-message-buttom-btn-send" @click="sendMessage">Send</section>
              </section>
            </section>
          </section>
          <!-- 历史记录 -->
          <section class="contack-message-history" v-show="isShowHistoryList">
            <header class="contack-message-history-header">
              <span>Message History<i class="el-icon-close" @click="switchCloseHistoryWindow"></i></span>
            </header>
            <section class="contack-message-history-content">
              <ul class="history-scroll-box">
                <li :class="['history-item', selectObj().from === item.fromId ? 'left' : 'right']" v-for="(item, index) in historyList" :key="index">
                  <header class="history-item-user-info">
                    <span class="history-item-user-info-username">{{filterDesignation(item.fromId, 'nickname')}}</span>
                    <span class="history-item-user-time">{{item.createTime|timerFormat}}</span>
                  </header>
                  <section class="history-item-body">
                    <article class="history-item-body-content" v-html="item.msg"></article>
                    <section class="card-list-item" v-if="$options.filters.isShowCardItem(item)" @click="openHouseInfo(item.ext)">
                      <header class="header-img">
                        <img :src="item.ext.imgUrl || '/static/img/common/header/avatar.png'">
                      </header>
                      <footer class="footer-intro">
                        <h4><span class="mini">$ </span>{{ item.ext.price }}</h4>
                        <section class="intro">
                          <section class="icons-items">
                            <!-- <img src="/static/img/listing/icons/utils_bads.png" alt="Bedrooms"> -->
                            <span>{{ item.ext.bedroom !== 'studio' ? item.ext.bedroom + ' bds' : item.ext.bedroom }}</span>
                          </section>
                          <section class="icons-items">
                            <!-- <img src="/static/img/listing/icons/utils_baths.png" alt="Bathrooms"> -->
                            <span class="padding-5">●</span>
                            <span>{{ item.ext.bathroom }} ba</span>
                          </section>
                          <section class="icons-items">
                            <!-- <img src="/static/img/listing/icons/utils_sqft.png" alt="Sqft"> -->
                            <span class="padding-5">●</span>
                            <span>{{ item.ext.lotSqft }} Sqft</span>
                          </section>
                        </section>
                        <footer class="art-itro">
                          <article>{{ item.ext.street }}</article>
                        </footer>
                      </footer>
                    </section>
                  </section>
                </li>
              </ul>
            </section>
            <footer class="contack-message-history-pageconfig">
              <section class="pageconfig-tools-bar">
                <span class="page-tools-bar-item" @click="jumpHistoryPageContent(0)"><i class="el-icon-d-arrow-left"></i></span>
                <span class="page-tools-bar-item" @click="jumpHistoryPageContent(1)"><i class="el-icon-arrow-left"></i></span>
                <span class="page-tools-bar-item" @click="jumpHistoryPageContent(2)"><i class="el-icon-arrow-right"></i></span>
                <span class="page-tools-bar-item" @click="jumpHistoryPageContent(3)"><i class="el-icon-d-arrow-right"></i></span>
              </section>
            </footer>
          </section>
        </section>
      </section>
      <!-- modules-2 -->
      <!-- modules-3 -->
      <section v-if="currentType.id === 2 && !currentUserInfo.name" class="contack-right-content right">
        <header class="contack-right-content-header top el-dialog__header">
          <h4 class="title">New Friends</h4>
          <section class="tools">
            <span><i class="iconfont icon-guanbi" @click="closeMessage"></i></span>
          </section>
        </header>
        <footer class="contack-right-new-friend-list">
          <section class="new-card-friend" v-for="friend in friendList" :key="friend.from + Math.random() * 1000000000">
            <header class="author-img">
              <img :src="filterDesignation(friend.from, 'headUrl') || '/static/img/common/header/avatar.png'" alt="">
            </header>
            <section class="card-content">
              <span class="theme-color">{{filterDesignation(friend.from, 'nickname')}}</span>
              <span>send a friend request to you </span>
            </section>
            <footer class="tools">
              <span class="agree-btn" v-show="friend.type === 'subscribe'" @click="handlerFriendChange(friend)">Agree</span>
              <span class="added-txt" v-show="friend.type === 'subscribed'">Added</span>
            </footer>
          </section>
        </footer>
      </section>
      <!-- modules-4 -->
      <section v-if="currentType.id === 2 && currentUserInfo.name" class="contack-right-content right">
        <header class="tools">
          <i class="iconfont icon-guanbi" @click="closeMessage"></i>
        </header>
        <section class="info-card-desc">
          <header class="info-author-img">
            <section class="img">
              <img :src="filterDesignation(currentUserInfo.name, 'headUrl') || '/static/img/common/header/avatar.png'" :alt="filterDesignation(currentUserInfo.name, 'nickname')">
            </section>
            <section class="user-name">{{filterDesignation(currentUserInfo.name, 'nickname')}}</section>
            <footer class="btn-tools">
              <span class="btn-delete" @click="handlerFriendDeleteChange(currentUserInfo)">
                <i class="iconfont icon-message_CancelFriends"></i>
                Delete
              </span>
              <span class="btn-contact" @click="userContactChange">
                <i class="iconfont icon-message_contact"></i>
                Contact
              </span>
            </footer>
          </header>
        </section>
      </section>
    </section>
  </section>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
export default {
  data () {
    return {
      userModules: [
        {
          id: 0,
          icon: 'iconfont icon-message_contact',
          type: 0,
          filter: 'filterMessageUserList',
          current: 'currentMessageInfo'
        },
        {
          id: 1,
          icon: 'iconfont icon-message_Customerservice',
          type: 1,
          filter: 'filterServiceUserList',
          current: 'currentServiceInfo'
        },
        {
          id: 2,
          icon: 'iconfont icon-message_friendlist',
          type: 3,
          filter: 'filterFriendUserList',
          current: 'currentUserInfo'
        }
      ],
      // 客服列表
      customerList: [],
      // 客服列表显示状态
      customerListStatus: false,
      // 左侧搜索框内容
      searchUserKeyWord: null,
      // 左侧搜索框placeholder
      searchUserPlaceholder: 'Contacts',
      // 用户输入的数据
      customerInputMessage: null,
      // 是否显示
      showMessage: false,
      // 当前输入框的消息
      msgBold: null,
      // 创建即时通讯对象
      conn: null,
      // 登录对象
      userAccount: {
        userName: 'hx-103853285458313216' || 'Ebuyhouse',
        password: '123456'
      },
      // 在线用户列表
      OnlineUserList: [],
      // 聊天对象
      CurrentUser: {
        fromName: null
      },
      // 当前用户聊天数据
      // messageList: [],
      // 提示
      TipConfig: {
        isShow: true,
        content: `Interested in this property? Send a message below. Please note, Ebuyhouse staff will never ask you for your account password.`
      },
      isShowHouseInfoBox: false,
      // 是否显示推荐发送消息  // 为true时不可会显示 false时可显示
      isShowHouseInfo: true,
      // 可发送的房源信息
      houseInfoInformation: {
        price: 0
      },
      MyHeaderImg: window.localStorage.getItem('a') || '/static/img/common/header/avatar.png',
      // emoji集合
      EmojiList: [],
      // 是否显示历史记录列表
      isShowHistoryList: false,
      // 历史记录渲染列表
      historyList: [],
      // 历史记录分页配置
      historyPageConfig: {
        pageNum: 1,
        pageSize: 12,
        pageTotal: 0
      },
      // 是否存在用户聊天时
      isNoUser: false,
      // 是否全屏显示
      isFullScreen: false,
      // 存储WEBIM配置
      WebIMConfig: null,
      // 用户信息列表
      userInfoList: [],
      // 聊天数据处理
      // 粘贴板图片处理
      pasteImgList: [],
      // 发送图文本地存储时单独对图片进行处理
      localImgUrlObjct: {},
      // 带过滤的消息列表
      filterMessageUserList: [],
      // 带过滤的客服列表
      filterServiceUserList: [],
      // 带过滤的好友列表
      filterFriendUserList: []
    }
  },
  computed: {
    ...mapGetters({
      token: 'token',
      currentType: 'currentType',
      messageList: 'messageList',
      messageServiceList: 'messageServiceList',
      currentMessageInfo: 'currentMessageInfo',
      currentServiceInfo: 'currentServiceInfo',
      currentUserInfo: 'currentUserInfo',
      userMessageList: 'userMessageList',
      userFriendList: 'userFriendList',
      userServiceList: 'userServiceList',
      userUnprocessedList: 'userUnprocessedList',
      userProcessedList: 'userProcessedList',
      globalUserInfo: 'GlobalUserInfo'
    }),
    friendList: function (params) {
      // console.log([...this.userUnprocessedList, ...this.userProcessedList])
      return [...this.userUnprocessedList, ...this.userProcessedList]
    },
    friendAll: function (params) {
      // console.log([...this.userUnprocessedList, ...this.userProcessedList])
      return [...this.friendList, ...this.userFriendList, ...this.userMessageList]
    }
  },
  filters: {
    isShowCardItem (_info) {
      if (_info.ext) {
        if (_info.ext.houseId) {
          console.log(true)
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  watch: {
    userMessageList: {
      handler (_new, _old) {
        this.filterMessageUserList = _new
      },
      immediate: true,
      deep: true
    },
    userFriendList: {
      handler (_new, _old) {
        this.filterFriendUserList = _new
      },
      immediate: true,
      deep: true
    },
    userServiceList: {
      handler (_new, _old) {
        this.filterServiceUserList = _new
      },
      immediate: true,
      deep: true
    },
    friendAll: {
      handler (_new, _old) {
        // 全部好友
        console.log('全部好友或者待添加好友')
        console.log(this.friendAll)
        if (_new.length !== 0) {
          const hxids = [...new Set(_new.map(item => {
            return item.name || item.from
          })), this.globalUserInfo.hxusername].join()
          this.fetchAuthorImgUserName(hxids)
        }
      },
      immediate: true,
      deep: true
    },
    // 监听当前router是否在当前房源
    '$route': {
      handler (to, from) {
        if (to.name === 'listing-details') {
          if (to.params) {
            this.isShowHouseInfo = false
            const houseInfos = to.params
            this.fetchHouseInfo(houseInfos.houseId)
          } else {
            this.isShowHouseInfo = true
          }
        } else {
          this.isShowHouseInfo = true
        }
      },
      immediate: true
    },
    // 搜索用户
    searchUserKeyWord (_new, _old) {
      this.filterList(_new)
    },
    token (_new, _old) {
      if (!_new) {
        this.closeMessage()
      }
    },
    messageList: {
      handler (_new, _old) {
        this.scrollBottom()
      },
      deep: true
    },
    messageServiceList: {
      handler (_new, _old) {
        this.scrollBottom()
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations({
      openMessages: 'openMessage',
      UPDATE_CURRENT_USER_MESSAGE_LIST: 'UPDATE_CURRENT_USER_MESSAGE_LIST',
      UPDATE_CURRENT_USER_SERVICE_LIST: 'UPDATE_CURRENT_USER_SERVICE_LIST',
      UPDATE_CURRENT_MESSAGE_INFO: 'UPDATE_CURRENT_MESSAGE_INFO',
      UPDATE_CURRENT_SERVICE_INFO: 'UPDATE_CURRENT_SERVICE_INFO',
      UPDATE_CURRENT_USER_INFO: 'UPDATE_CURRENT_USER_INFO',
      UPDATE_CURRENT_TYPE: 'UPDATE_CURRENT_TYPE',
      UPDATE_USER_PROCESSED_LIST: 'UPDATE_USER_PROCESSED_LIST',
      UPDATE_USER_MESSAGE_LIST: 'UPDATE_USER_MESSAGE_LIST',
      UPDATE_USER_SERVICE_LIST: 'UPDATE_USER_SERVICE_LIST'
    }),
    // 返回选中的对象
    selectObj () {
      return this[this.currentType.current]
    },
    // 过滤指定显示
    filterDesignation (_hxid, _name) {
      // console.log(this.userInfoList)
      let desig = null
      if (this.currentType.type === 1) {
        if (this.userServiceList.length === 0) return ''
        desig = this.userServiceList.filter(item => {
          return _hxid === item.hxusername
        })
        desig = desig.length !== 0 ? desig[0][_name] : ''
      } else {
        if (this.userInfoList.length === 0) return ''
        desig = this.userInfoList.filter(item => {
          return _hxid === item.hxusername
        })
        desig = desig.length !== 0 ? desig[0][_name] : ''
      }
      // if () {}
      return desig
    },
    // 模块红点消息提示
    isModuleSignet (_info) {
      switch (_info.id) {
        case 0:
          return this.userMessageList.some(item => {
            return item.signet
          })
        case 1:
          return this.userServiceList.some(item => {
            return item.signet
          })
        case 2:
          return this.userUnprocessedList.length !== 0
      }
    },
    // 切换模块类型
    switchUserModuleChange (_info) {
      // 更新store
      this.UPDATE_CURRENT_TYPE(_info)
      // 关闭历史记录
      this.switchCloseHistoryWindow()
    },
    // 同意好友请求
    handlerFriendChange (_info) {
      // console.log(_info)
      if (this.token) {
        this.$imConn.subscribed({
          to: _info.from,
          message: '[resp:true]'
        })
        // 需要反向添加对方好友
        this.$imConn.subscribe({
          to: _info.to,
          message: '[resp:true]'
        })
        this.UPDATE_USER_PROCESSED_LIST(Object.assign({}, _info, {type: 'ok'}))
      }
    },
    // 删除好友
    handlerFriendDeleteChange (_info) {
      const _this = this
      _this.$imConn.removeRoster({
        to: _info.name,
        success: function () { // 删除成功
          _this.$imConn.unsubscribed({
            to: _info.name
          })
          _this.$message.success('You have successfully deleted your friend!')
          _this.handlerDesignationDeleteChange(_info.name)
          _this.UPDATE_CURRENT_USER_INFO({})
        },
        error: function () { // 删除失败
          _this.$message.error('Failed to delete!')
        }
      })
    },
    // 通过指定hx-id删除消息列表
    handlerDesignationDeleteChange (_hxid) {
      const cloneUserMessageList = this.userMessageList.filter(item => {
        return item.from !== _hxid
      })
      // 如果当前删除的是正在聊天的
      if (_hxid === this.currentMessageInfo.from) {
        this.UPDATE_CURRENT_MESSAGE_INFO({})
      }
      this.UPDATE_USER_MESSAGE_LIST(cloneUserMessageList)
    },
    // 列表过滤功能
    filterList (_keyword) {
      if (_keyword) {
        // this.currentType
        switch (this.currentType.id) {
          case 0:
            this[this.currentType.filter] = this.userMessageList.filter(item => {
              return this.filterDesignation(item.from, 'nickname').toLowerCase().indexOf(_keyword.toLowerCase()) !== -1
            })
            break
          case 1:
            this[this.currentType.filter] = this.userServiceList.filter(item => {
              return item.accountName.toLowerCase().indexOf(_keyword.toLowerCase()) !== -1
            })
            break
          case 2:
            this[this.currentType.filter] = this.userFriendList.filter(item => {
              console.log(this.filterDesignation(item.name, 'nickname'))
              return this.filterDesignation(item.name, 'nickname').toLowerCase().indexOf(_keyword.toLowerCase()) !== -1
            })
            break
        }
      } else {
        switch (this.currentType.id) {
          case 0:
            this[this.currentType.filter] = this.userMessageList
            break
          case 1:
            this[this.currentType.filter] = this.userServiceList
            break
          case 2:
            this[this.currentType.filter] = this.userFriendList
            break
        }
      }
    },
    // 通过hx-username获取头像以及用户名称
    fetchAuthorImgUserName (_hxids) {
      this.$axios.get(`${this.XT_PROD_PATH}customer/select/hx/user/head`, {params: {hxId: _hxids}})
        .then(res => {
          this.userInfoList = res.data.data
          console.log(this.userInfoList)
        })
    },
    // 选择当前消息进行聊天
    switchMessageChange (_info) {
      // 关闭历史记录
      this.switchCloseHistoryWindow()
      this.UPDATE_CURRENT_MESSAGE_INFO(_info)
      this.scrollBottom()
    },
    // 选择当前客服进行聊天
    switchMessageServiceChange (_info) {
      // 关闭历史记录
      this.switchCloseHistoryWindow()
      this.UPDATE_CURRENT_SERVICE_INFO(_info)
      this.scrollBottom()
    },
    // 选择当前用户进行聊天
    userContactChange () {
      const status = this.userMessageList.filter(item => {
        return item.from === this.currentUserInfo.name
      })
      if (status.length === 0) {
        const creactMessageInfo = Object.assign({}, this.currentUserInfo, {from: this.currentUserInfo.name, to: this.globalUserInfo.hxusername})
        // console.log(creactMessageInfo)
        this.UPDATE_USER_MESSAGE_LIST(creactMessageInfo)
        this.UPDATE_CURRENT_MESSAGE_INFO(creactMessageInfo)
      } else {
        this.UPDATE_CURRENT_MESSAGE_INFO(status[0])
      }
      this.UPDATE_CURRENT_TYPE(this.userModules[0])
    },
    input () {
      const v = this.$refs['execInput'].innerHTML
      this.msgBold = v
    },
    // 粘贴消息到输入框
    paste (e) {
      console.log(e)
      e.preventDefault()
      if (e.clipboardData && e.clipboardData.types) {
        if (e.clipboardData.items.length > 0) {
          if (/^image\/\w+$/.test(e.clipboardData.items[0].type)) {
            const blob = e.clipboardData.items[0].getAsFile()
            const url = window.URL.createObjectURL(blob)
            let insertImg = {}
            insertImg[url] = blob
            this.pasteImgList.push(insertImg)
            // console.log(blob, url)
            document.execCommand('insertImage', false, url)
          }
        }
      }
      // e.preventDefault()
      const html = e.clipboardData.getData('text/html')
      document.execCommand('insertHTML', false, html)
      this.input()
    },
    // 拖拽图片操作
    dragInputChange (e) {
      e.preventDefault()
      console.log(e.dataTransfer)
    },
    // 清除消息输入框
    clearMsg () {
      this.$refs['execInput'].innerHTML = null
    },
    // 初始化Emoji表情
    initEmoji (_WebIM) {
      console.log(_WebIM.Emoji)
      const baseUrl = _WebIM.Emoji.path
      Object.keys(_WebIM.Emoji.map).map((item, index) => {
        this.EmojiList.push({
          id: '1-' + index,
          type: 'img',
          img: baseUrl + _WebIM.Emoji.map[item],
          name: _WebIM.Emoji.map[item],
          emoji: item
        })
      })
      _WebIM.NewEmoji.map.map((item, index) => {
        this.EmojiList.push({
          id: '2-' + index,
          type: 'emoji',
          img: item,
          name: item,
          emoji: item
        })
      })
      console.log(_WebIM.NewEmoji)
    },
    // 格式化发送的数据
    formatToSendMessage (_string) {
      const _this = this
      return _string.replace(/(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g, function (params, info) {
        // console.log(params, info)
        return _this.encodeUnicode(params)
      }).replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, params) {
        console.log(params)
        let handlerString = params
        params.replace(/[^/]+(?=$)/g, function (_params) {
          // console.log(_params)
          _this.EmojiList.map(item => {
            if (item.name === _params) {
              handlerString = item.emoji
            }
          })
        })
        return handlerString
      })
      // return this.encodeUnicode(_string)
    },
    // 格式化本地图片表情转换
    formatLocalImgEmojiToEmoji (_string) {
      const _this = this
      return _string.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, params) {
        // console.log(params)
        let handlerString = params
        params.replace(/[^/]+(?=$)/g, function (_params) {
          // console.log(_params)
          _this.EmojiList.map(item => {
            if (item.name === _params) {
              handlerString = item.emoji
            }
          })
        })
        // console.log(params)
        if (handlerString === params) {
          handlerString = `img:[${handlerString}]`
        }
        return handlerString
      })
    },
    // unicode转码
    encodeUnicode (str) {
      var res = []
      for (var i = 0; i < str.length; i++) {
        res[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4)
      }
      return '\\u' + res.join('\\u')
    },
    // 格式化返回消息对象参数
    formatMessage (_info, _type) {
      const _this = this
      _info['createTime'] = this.formatTime()
      if (!_type) {
        _info['data'] = _this.formatMessageTxt(_info['data'])
      }
      return _info
    },
    // 格式化返回的表情
    formatMessageTxt (_string) {
      const _this = this
      return _string.replace(/\[.*?\]/g, function (params) {
        const baseUrl = _this.$WebIM.Emoji.path
        if (Object.keys(_this.$WebIM.Emoji.map).includes(params)) {
          return `<img src="${baseUrl + _this.$WebIM.Emoji.map[params]}"/>`
        } else {
          return params
        }
        // console.log(_this.EmojiList.includes(params))
        // console.log(params)
        // console.log(_this.EmojiList.includes(params))
      })
    },
    // 缩放弹窗
    zoomMessage () {
      this.isFullScreen = !this.isFullScreen
      this.customerListStatus = false
      if (this.isFullScreen) {
        window.document.body.style.overflowY = 'hidden'
      } else {
        window.document.body.style.overflowY = 'auto'
      }
    },
    // 关闭弹窗
    closeMessage (e) {
      if (e) {
        e.stopPropagation()
        e.preventDefault()
      }
      // this.conn.close('下线处理')
      window.document.body.style.overflowY = 'auto'
      this.openMessages(false)
    },
    // 格式化时间方法
    formatTime (_timers) {
      // return
      if (_timers) {
        const time = new Date(_timers * 1000)
        return `${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}:${time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()} ${time.getMonth() + 1}/${time.getDate()}`
      } else {
        const time = new Date()
        return `${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}:${time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()} ${time.getMonth() + 1}/${time.getDate()}`
      }
    },
    // unicodeToUtf8
    unicodeToUtf8 (unicode) {
      unicode = unicode.replace(/\\/g, '%')
      unicode = unescape(unicode)
      unicode = unicode.replace(/%/g, '\\')
      unicode = unicode.replace(/\\/g, '')
      return unicode
    },
    // 如果用户不存在则重新拉取用户列表
    userIsUserList (_msg) {
      let includesStatus = false
      this.OnlineUserList.map(item => {
        // console.log(JSON.stringify(item))
        // console.log(item.fromName)
        // console.log(_msg.from, _msg.to)
        if (item.fromName === _msg.from) {
          includesStatus = true
        }
      })
      if (!includesStatus) {
        // this.filterList()
      }
    },
    // 如果没有处于当前对话消息中 显示提醒红点
    addBadgeChange (_msg) {
      // console.log(this.CurrentUser.fromName, _msg.from)
      if (this.CurrentUser.fromName.toUpperCase() !== _msg.from.toUpperCase()) {
        this.OnlineUserList = this.OnlineUserList.map(item => {
          if (item.fromName.toUpperCase() === _msg.from.toUpperCase()) {
            item['badge']++
          }
          return item
        })
        console.log(this.OnlineUserList)
      } else {
        this.reply(this.CurrentUser.fromUserId)
      }
    },
    // 清除当前红点
    clearBadgeChange () {
      this.OnlineUserList = this.OnlineUserList.map(item => {
        if (item.fromName.toUpperCase() === this.CurrentUser.fromName.toUpperCase()) {
          item['badge'] = 0
          item['messageNum'] = 0
        }
        return item
      })
    },
    // 按住shift+enter发送消息
    shiftAndEnterSend (event) {
      if (event.keyCode === 13 && !event.shiftKey && this[this.currentType.current].from) {
        this.sendMessage()
        event.preventDefault()
        event.stopPropagation()
      }
    },
    // 发送文本消息
    sendMessage () {
      // console.log(!this.isNoUser)
      // console.log(this.msgBold)
      // console.log(!this.msgBold, this.msgBold.replace(/&nbsp;|\s/g, ''))
      if (!this.msgBold || !(this.msgBold.replace(/&nbsp;|\s/g, ''))) {
        this.$message.info('The content sent cannot be empty')
        return
      }
      if (!this[this.currentType.current].from) {
        this.$message.info('Please select a chat object')
        return
      }
      const _this = this
      const messageContext = this.msgBold
      const filterMsg = _this.sendPasteImg(_this.formatHTML(_this.formatLocalImgEmojiToEmoji(messageContext)))
      console.log('------------------分割线-------------------')
      if (!filterMsg) {
        this.msgBold = null
        this.clearMsg()
        return
      }
      const id = this.$imConn.getUniqueId() // 生成本地消息id
      // eslint-disable-next-line new-cap
      let msg = new this.$WebIM.message('txt', id) // 创建文本消息
      // console.log(_this.formatHTML(_this.formatLocalImgEmojiToEmoji(messageContext)))
      msg.set({
        msg: filterMsg,
        to: _this[_this.currentType.current].from,
        type: 'chat',
        // 消息发送成功回调
        success: function (_id, serverMsgId) {
          _this.scrollBottom()
          if (_this.currentType.id === 0) {
            _this.UPDATE_CURRENT_USER_MESSAGE_LIST(Object.assign({}, {to: _this[_this.currentType.current].from, from: _this[_this.currentType.current].to, data: _this.formatMessageTxt(filterMsg)}))
          } else if (_this.currentType.id === 1) {
            _this.UPDATE_CURRENT_USER_SERVICE_LIST(Object.assign({}, {to: _this[_this.currentType.current].from, from: _this[_this.currentType.current].to, data: _this.formatMessageTxt(filterMsg)}))
          }
        }
      })
      this.$imConn.send(msg.body)
      this.msgBold = null
      this.clearMsg()
    },
    // 通过id获取图片详细信息
    fetchIdToFile (_fileId) {
      return this.pasteImgList.filter(item => {
        console.log(Object.keys(item))
        // console.log(item)
        return Object.keys(item)[0] === _fileId
      })
    },
    // 查询文本框中是否存在图片 如果是的话则将其转化成贴图消息发送
    sendPasteImg (_msg) {
      const _this = this
      let regImg = /img:\[?(.*?)\].*?/gi
      console.log('获取图片')
      return _msg.replace(regImg, function (match, params) {
        console.log('图片' + params)
        // console.log(_this.fetchIdToFile(params))
        try {
          const imgFile = _this.fetchIdToFile(params)[0]
          var id = _this.$imConn.getUniqueId() // 生成本地消息id
          // eslint-disable-next-line new-cap
          var msg = new _this.$WebIM.message('img', id) // 创建图片消息
          msg.set({
            apiUrl: _this.$WebIM.config.apiURL,
            file: {data: imgFile[params], url: params},
            to: _this[_this.currentType.current].from, // 接收消息对象
            roomType: false,
            onFileUploadError: function (error) {
              console.log(error)
            },
            onFileUploadComplete: function (data) {
              console.log(data)
              // let localFile = {}
              // localFile[]
              _this.localImgUrlObjct[params] = `<img src="${data.uri}/${data.entities[0].uuid}" />`
              console.log('Complete')
            },
            success: function (id) {
              console.log(id)
              console.log('Success')
              _this.scrollBottom()
              if (_this.currentType.id === 0) {
                _this.UPDATE_CURRENT_USER_MESSAGE_LIST(Object.assign({}, {to: _this[_this.currentType.current].from, from: _this[_this.currentType.current].to, data: _this.localImgUrlObjct[params]}))
              } else if (_this.currentType.id === 1) {
                _this.UPDATE_CURRENT_USER_SERVICE_LIST(Object.assign({}, {to: _this[_this.currentType.current].from, from: _this[_this.currentType.current].to, data: _this.localImgUrlObjct[params]}))
              }
            }
          })
          _this.$imConn.send(msg.body)
          return ''
        } catch (error) {
          return params
        }
      })
      // console.log('结束')
    },
    // 文件包括图片消息回调
    autoSendFileChange (__this, _type) {
      if (!this[this.currentType.current].from) {
        this.$message.info('Please select a chat object')
        return
      }
      // console.log(__this, _type)
      const _this = this
      const id = _this.$imConn.getUniqueId() // 生成本地消息id
      const file = _this.$WebIM.utils.getFileUrl(__this.target)
      // file['file_length'] = file.data.size
      // eslint-disable-next-line new-cap
      let msg = new _this.$WebIM.message(_type, id) // 创建图片消息
      // console.log(_this.$WebIM.utils.getFileUrl(__this.target))
      msg.set({
        apiUrl: _this.$WebIM.config.apiURL,
        file: file,
        to: _this[_this.currentType.current].from, // 接收消息对象
        roomType: false,
        ext: {
          file_length: file.data.size
        },
        onFileUploadError: function () { // 消息上传失败
          console.log('onFileUploadError')
        },
        onFileUploadComplete: function (data) { // 消息上传成功
          console.log('onFileUploadComplete')
          if (_type === 'img') {
            _this.localImgUrlObjct[id] = `<img src="${data.uri}/${data.entities[0].uuid}" />`
          } else if (_type === 'file') {
            _this.localImgUrlObjct[id] = `<a href="${data.uri}/${data.entities[0].uuid}" download="${data.uri}/${data.entities[0].uuid}" style="display: flex; width: 150px; height: 80px; border-radius: 5px; justify-content: center; align-items: center; flex-direction: column; color: #1281fc; background: #fff;"><i class="iconfont icon-nav_article1" style="font-size: 30px"></i><span style="font-size: 14px">Click Me Download File</span></a>`
          } else if (_type === 'audio') {
            _this.localImgUrlObjct[id] = `<audio src="${data.uri}/${data.entities[0].uuid}" controls><source src="${data.uri}/${data.entities[0].uuid}" type="audio/mp3" /></audio>`
          } else if (_type === 'video') {
            _this.localImgUrlObjct[id] = `<video src="${data.uri}/${data.entities[0].uuid}" controls><source src="${data.uri}/${data.entities[0].uuid}" type="video/mp4" /></video>`
          }
        },
        success: function () { // 消息发送成功
          console.log('Success')
          if (_this.currentType.id === 0) {
            _this.UPDATE_CURRENT_USER_MESSAGE_LIST(Object.assign({}, {to: _this[_this.currentType.current].from, from: _this[_this.currentType.current].to, data: _this.localImgUrlObjct[id]}))
          } else if (_this.currentType.id === 1) {
            _this.UPDATE_CURRENT_USER_SERVICE_LIST(Object.assign({}, {to: _this[_this.currentType.current].from, from: _this[_this.currentType.current].to, data: _this.localImgUrlObjct[id]}))
          }
          _this.scrollBottom()
          __this.target.value = null
        },
        flashUpload: _this.$WebIM.flashUpload
      })
      _this.$imConn.send(msg.body)
    },
    // 发送房源信息
    sendHouseMessage (_info) {
    },
    // 用户列表-切换用户
    currentUserChange (_info) {
      this.UPDATE_CURRENT_USER_INFO(_info)
      // 选择用户
      // this.isNoUser = true
      // console.log(_info.fromUserId)
      // this.updateMessageUserInfo(_info)
      // this.scrollBottom()
      // this.fetchHistoryListList(_info)
      // this.reply(_info.fromUserId)
      // this.switchCloseHistoryWindow()
    },
    scrollBottom () {
      const _this = this
      setTimeout(() => {
        _this.$refs.messageBox.scrollTop = _this.$refs.messageBox.scrollHeight
      }, 100)
    },
    fetchHouseInfo (_id) {
    },
    openHouseInfo (_info) {
      // this.$router.push({
      //   path: '/listing/details/' + _info.houseId
      // })
      // 关闭当前聊天
      this.closeMessage()
    },
    addEmoji (_emoji) {
      console.log(_emoji)
      if (_emoji.type === 'img') {
        document.execCommand('insertImage', false, _emoji.img)
      } else if (_emoji.type === 'emoji') {
        // debugger
        // this.$refs['execInput'].execCommand('insertText', false, _emoji.emoji)
        // document.execCommand('insertHorizontalRule', false, _emoji.emoji)
        this.$refs['execInput'].innerHTML += _emoji.emoji
        this.msgBold = this.$refs['execInput'].innerHTML
        // document.execCommand('justifyRight')
      }
    },
    // 在线客服列表
    lineServiceChange () {
      let mocker = [
        {
          'accountName': '对方的名字',
          'accountType': 1,
          'createTime': 1548307877000,
          'createUserId': '1',
          'headUrl': 'https://zjcebuyhouse.s3.amazonaws.com/ebuyhouse_images/1547450220133_346.png',
          'hierarchy': '0',
          'hxusername': 'hx-7123456789',
          'id': 1,
          'isActivity': 1,
          'loginType': 1,
          'phone': '1233211100'
        }]
      // this.customerList = res.data.data
      this.UPDATE_USER_SERVICE_LIST(mocker.map(item => {
        item['from'] = item.hxusername
        item['to'] = this.globalUserInfo.hxusername
        item['nickname'] = item.accountName
        return item
      }) || [])
    },
    // 关闭历史记录操作并清空分页数据
    switchCloseHistoryWindow () {
      this.isShowHistoryList = false
      this.historyPageConfig.pageNum = 1
      this.historyPageConfig.pageSize = 12
    },
    // 打开历史纪录操作
    switchOpenHistoryWindow () {
      if (!this.isShowHistoryList && this[this.currentType.current].from) {
        this.fetchHistoryList()
        this.isShowHistoryList = true
      }
    },
    // 获取历史纪录接口
    fetchHistoryList () {
      // select/tourist/all/list
      // CurrentUser
      this.$axios.get(`/////customer/select/hx/chat`, {params: {
        fromId: this[this.currentType.current].to,
        toId: this[this.currentType.current].from,
        pageNum: this.historyPageConfig.pageNum,
        pageSize: this.historyPageConfig.pageSize
        // jId: this.guid
      }})
        .then(res => {
          // console.log(res)
          this.historyList = res.data.data.rows
          this.historyPageConfig.pageTotal = res.data.data.total
        })
    },
    // 跳转指定页面
    jumpHistoryPageContent (_type) {
      const maxPageNum = Math.ceil(this.historyPageConfig.pageTotal / this.historyPageConfig.pageSize)
      switch (_type) {
        case 0:
          if (this.historyPageConfig.pageNum !== 1) {
            this.historyPageConfig.pageNum = 1
            this.fetchHistoryList()
          }
          break
        case 1:
          if (this.historyPageConfig.pageNum > 1) {
            this.historyPageConfig.pageNum--
            this.fetchHistoryList()
          }
          break
        case 2:
          if (this.historyPageConfig.pageNum < maxPageNum) {
            this.historyPageConfig.pageNum++
            this.fetchHistoryList()
          }
          break
        default:
          if (this.historyPageConfig.pageNum !== maxPageNum) {
            this.historyPageConfig.pageNum = maxPageNum
            this.fetchHistoryList()
          }
          break
      }
    },
    // 去除HTML tag
    formatHTML (_string) {
      _string = _string.replace(/<\/?.+?>/g, '')
      _string = _string.replace(/(\n)/g, '')
      _string = _string.replace(/(\t)/g, '')
      _string = _string.replace(/(\r)/g, '')
      _string = _string.replace(/<\/?[^>]*>/g, '')
      _string = _string.replace(/\s/g, ' ')
      _string = _string.replace(/&nbsp;/g, ' ')
      _string = _string.replace(/&rsquo;/g, '’')
      _string = _string.replace(/&lsquo;/g, '‘')
      _string = _string.replace(/&hellip;/g, '…')
      _string = _string.replace(/&ndash;/g, '–')
      _string = _string.replace(/&mdash;/g, '—')
      _string = _string.replace(/&sbquo;/g, '‚')
      _string = _string.replace(/&ldquo;/g, '“')
      _string = _string.replace(/&rdquo;/g, '”')
      _string = _string.replace(/&bdquo;/g, '„')
      _string = _string.replace(/&dagger;/g, '†')
      _string = _string.replace(/&Dagger;/g, '‡')
      _string = _string.replace(/&bull;/g, '•')
      _string = _string.replace(/&permil;/g, '‰')
      _string = _string.replace(/&prime;/g, '′')
      _string = _string.replace(/&Prime;/g, '″')
      _string = _string.replace(/&lsaquo;/g, '‹')
      _string = _string.replace(/&rsaquo;/g, '›')
      _string = _string.replace(/&oline;/g, '‾')
      _string = _string.replace(/&frasl;/g, '⁄')
      console.log(_string)
      return _string
    }
  },
  mounted () {
    this.lineServiceChange()
    this.switchUserModuleChange(this.userModules[0])
    this.initEmoji(this.$WebIM)
  }
}
</script>
<style lang="sass" scoped>
.message-container
  position: fixed
  z-index: 99
  width: 100%
  height: 0
  top: 0
  left: 0
  // display: flex
  // justify-content: center
  // align-items: center
  // 主容器
  .main-container
    width: 1040px
    height: 700px
    display: flex
    margin: 2cm auto
    border-radius: 5px
    box-shadow: 1px 1px 10px -1px #999
    position: relative
    overflow: hidden
    z-index: 99
    // transition: width .5s ease
    &.history-active
      width: 1500px
      // transition: width .5s ease
    &.fullScreen
      width: 100vw !important
      height: 100vh !important
      top: 0 !important
      left: 0 !important
      margin: 0 !important
    // 左侧控制面板
    .contact-left-list
      width: 248px
      flex: 0 0 248px
      height: 100%
      background-color: #1281FC
      display: flex
      flex-direction: row
      // 左侧列表类型选择
      .contack-message-modules
        flex: 0 0 64px
        background-color: #0E68CB
        .contack-me-info
          width: 64px
          height: 64px
          display: flex
          justify-content: center
          align-items: center
          .contack-me-author-img
            width: 30px
            height: 30px
            display: flex
            justify-content: center
            align-items: center
            border-radius: 50%
            overflow: hidden
            img
              max-width: 100%
        .contack-user-type-list
          .contack-user-type-box
            display: flex
            flex-direction: column
            .contack-user-type-item
              margin: 2.5px 0
              display: flex
              justify-content: center
              align-items: center
              padding: 10px 0
              &:hover,&.active
                background-color: #084E9B
                cursor: pointer
              &.signet
                i
                  position: relative
                  &::after
                    content: ''
                    width: 8px
                    height: 8px
                    background-color: #e51f1f
                    border-radius: 50%
                    position: absolute
                    right: -5px
                    top: 0
              i
                font-size: 25px
                color: #fff
      // 左侧搜索+用户列表
      .current-user-list
        display: flex
        flex-direction: column
        flex: 1
        .search-info
          height: 60px
          // margin-bottom: 10px
          display: flex
          justify-content: center
          align-items: center
          background-color: #1273DE
          .search-box
            background-color: #1A60AD
            height: 30px
            margin: 0 10px
            border-radius: 5px
            .search-user-input
              height: 100%
              display: flex
              align-items: center
              /deep/ input
                height: 100%
                color: #444
                font-size: 14px
                outline: none
                line-height: 30px
              /deep/ .el-input__suffix
                display: flex
                align-items: center
                cursor: pointer
                span.el-input__suffix-inner
                  display: flex
                  align-items: center
                  >i
                    width: 12px
                    height: 12px
                    font-size: 12px
                    color: #444
                    display: flex
                    align-items: center
        .user-list-box
          flex: 1
          // padding: 0 3px
          overflow-y: scroll
          overflow-x: hidden
          &::-webkit-scrollbar
            width: 0px
            height: 0px
          &::-webkit-scrollbar-thumb
            border-radius: 0px
            -webkit-box-shadow: 0
            background: #1281FC
          &::-webkit-scrollbar-track
            // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2)
            border-radius: 0
            background: transparent
          .user-list
            height: 100%
            .user-item
              height: 48px
              display: flex
              justify-content: space-between
              padding: 0
              align-items: center
              cursor: pointer
              margin-bottom: 5px
              &.Offline
                // filter: grayscale(100%)
                opacity: 0.8
              >i
                display: none
              &:hover,&.active
                border-radius: 0
                background-color: #0067D9
              &.no-data
                text-align: center
                color: #fff
                padding-left: 10px
                span
                  font-size: 14px
              &:hover
                >i
                  display: inline-block
                  color: #444
              .user-item-author-info
                display: flex
                .user-item-author-img
                  width: 30px
                  height: 30px
                  overflow: hidden
                  border-radius: 50%
                  margin: 0 10px
                  &.iconfont
                    font-size: 30px
                    color: #fff
                .user-item-author-name
                  color: #fff
                  font-size: 14px
                  display: flex
                  align-items: center
                  position: relative
                  &.signet::after
                    content: ''
                    width: 8px
                    height: 8px
                    background-color: #e51f1f
                    border-radius: 50%
                    position: absolute
                    right: -5px
                    top: 0
    // 右侧内容区
    .contack-right-content
      flex: 1
      display: flex
      flex-direction: column
      background-color: #fff
      .contack-user-name-tools-bar
        height: 80px
        padding: 0 20px
        background-color: #F4F4F4
        display: flex
        width: 100%
        justify-content: space-between
        align-items: center
        .to-user-name
          font-size: 30px
          color: #333
          cursor: pointer
          i
            display: none
          i.online
            color: #1281FC
            margin-left: 10px
            display: inline-block
          i.offline
            color: #444444
            margin-left: 10px
            display: inline-block
        .tools-bar
          .tools-item
            i
              font-size: 30px
              color: #333
              cursor: pointer
      .contack-right-content-header
        background-color: #fff
        height: 60px
        display: flex
        justify-content: space-between
        padding: 0 20px
        border-bottom: 1px solid #E0E0E0
        .title
          color: #444444
          font-size: 24px
          align-self: center
        .tools
          align-self: center
          cursor: pointer
          >span i
            font-size: 30px
            font-weight: bold
      .contack-right-new-friend-list
        flex: 1
        background-color: #fff
        max-height: calc( 100% - 60px )
        overflow-y: scroll
        .new-card-friend
          height: 120px
          display: flex
          align-items: center
          padding: 30px
          .author-img
            height: 60px
            width: 60px
            border-radius: 50%
            overflow: hidden
            img
              max-width: 100%
          .card-content
            padding: 0 10px
            flex: 1
            .theme-color
              color: #1281FC
          .tools
            flex: 0 0 120px
            display: flex
            align-items: center
            justify-content: center
            .agree-btn
              background-color: #1281FC
              border: 1px solid #1281FC
              height: 40px
              width: 100px
              line-height: 40px
              justify-content: center
              color: #fff
              text-align: center
              cursor: pointer
              &:hover
                background-color: #fff
                border-color: #1281FC
                color: #1281FC
      .tools
        i
          cursor: pointer
          position: absolute
          right: 10px
          top: 10px
          font-size: 30px
          font-weight: bold
      .info-card-desc
        flex: 1
        display: flex
        justify-content: center
        align-items: center
        .info-author-img
          display: flex
          flex-direction: column
          align-items: center
          .img
            width: 200px
            height: 200px
            overflow: hidden
            border-radius: 50%
            margin: 5px 0
            img
              width: 100%
          .user-name
            color: #444
            font-size: 36px
            text-align: center
            margin: 5px 0
          .btn-tools
            display: flex
            justify-content: space-between
            margin: 5px 0
            .btn-delete,
            .btn-contact
              background-color: #F3F4F6
              color: #444
              font-size: 14px
              width: 100px
              height: 30px
              border-radius: 15px
              line-height: 30px
              text-align: center
              margin: 0 10px
              cursor: pointer
            .btn-contact
              color: #1281FC
    .contack-content
      display: flex
      flex: 1
      background-color: #fff
      width: 100%
      max-height: calc(-80px + 100%)
      .contack-message-container
        flex: 1
        display: flex
        flex-direction: column
        .contack-message-content
          display: flex
          flex: 1
          flex-direction: column
          max-height: calc(-215px + 100%)
          .contack-message-content-fixed-power
            height: 40px
            margin: 10px
            background-color: #F4F4F4
            display: flex
            justify-content: space-between
            padding: 0 5px
            align-items: center
            flex: 0 0 40px
            .contack-message-content-fixed-power-left
              width: 16px
              height: 16px
              margin: 0 5px
            .contack-message-content-fixed-power-title,
            .contack-message-content-fixed-power-close
              color: #333333
              font-size: 16px
              cursor: pointer
          .contack-message-content-list-box
            flex: 1
            padding: 0 10px
            overflow-y: scroll
            overflow-x: hidden
            &::-webkit-scrollbar
              width: 0px
              height: 0px
            &::-webkit-scrollbar-thumb
              border-radius: 0px
              -webkit-box-shadow: 0
              background: #1281FC
            &::-webkit-scrollbar-track
              // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2)
              border-radius: 0
              background: transparent
            .current-user-message-list-box
              height: 100%
              .current-user-message-item
                display: flex
                margin: 15px 0
                .user-author-img
                  width: 30px
                  height: 30px
                  margin: 5px
                  display: flex
                  align-items: center
                  .author-img
                    border-radius: 50%
                    max-width: 100%
                    height: 100%
                .message-card-item-house-info
                  display: flex
                  flex-direction: column
                  max-width: 80%
                  .message-content-style
                    padding: 10px 10px
                    border-radius: 5px
                  >span
                    color: #999999
                    font-size: 14px
                    margin: 10px 0
                &.message-left
                  justify-content: flex-start
                  .message-card-item-house-info
                    margin-left: 35px
                    .message-content-style
                      background-color: #f0f0f0
                      position: relative
                      &::before
                        width: 0
                        height: 0
                        border-top: 1px solid transparent
                        border-right: 10px solid #f0f0f0
                        border-bottom: 5px solid transparent
                        content: ''
                        position: absolute
                        left: -10px
                        top: 50%
                        transform: translateY(-5px)
                      .message-html-content
                        word-break: break-word
                        display: flex
                        flex-wrap: wrap
                        align-items: center
                        /deep/ img,
                        /deep/ video,
                        /deep/ audio
                          max-width: 100%
                    >span
                      text-align: left
                &.message-right
                  justify-content: flex-start
                  flex-direction: row-reverse
                  .message-card-item-house-info
                    margin-right: 35px
                    .message-content-style
                      background-color: #1281fc
                      position: relative
                      &::before
                        width: 0
                        height: 0
                        border-top: 1px solid transparent
                        border-left: 10px solid #1281fc
                        border-bottom: 5px solid transparent
                        content: ''
                        position: absolute
                        right: -10px
                        top: 50%
                        transform: translateY(-5px)
                      .message-html-content
                        color: #fff
                        word-break: break-word
                        display: flex
                        flex-wrap: wrap
                        align-items: center
                        /deep/ img,
                        /deep/ video,
                        /deep/ audio
                          max-width: 100%
                    >span
                      text-align: right
        .contack-message-insert
          height: 215px
          flex: 0 0 215px
          display: flex
          flex-direction: column
          .contack-message-insert-tools-bar
            height: 40px
            display: flex
            justify-content: space-between
            .tools-bar-box,
            .contack-message-insert-history
              display: flex
              align-items: center
              margin: 0 10px
              .tools-item
                font-size: 0
                margin: 0 5px
                cursor: pointer
                >input
                  display: none
                i
                  cursor: pointer
                  font-size: 22px
              .tools-btn-history
                cursor: pointer
                font-size: 14px
                color: #444
                padding: 5px
                &:hover,&.active
                  background-color: #E0E0E0
                >i
                  marign-right: 5px
          >cite
            flex: 1
            padding: 10px 20px
            font-style: normal
            word-break: break-word
            overflow-y: scroll
            overflow-x: hidden
            height: inherit
            max-height: calc( 215px - 40px - 64px )
            outline: none
            // display: flex
            // flex-wrap: wrap
            // align-items: center
            &::-webkit-scrollbar
              width: 0px
              height: 0px
            &::-webkit-scrollbar-thumb
              border-radius: 0px
              -webkit-box-shadow: 0
              background: #1281FC
            &::-webkit-scrollbar-track
              // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2)
              border-radius: 0
              background: transparent
            /deep/ img,video,audio
              max-width: 200px
          .contack-message-buttom-btn
            height: 65px
            display: flex
            align-items: center
            justify-content: flex-end
            .contack-message-buttom-btn-close,
            .contack-message-buttom-btn-send
              padding: 10px 25px
              color: #fff
              background-color: #1281FC
              margin-right: 10px
              font-size: 14px
              cursor: pointer
      .contack-message-history
        display: flex
        flex-direction: column
        flex: 0 0 460px
        transition: all .5s ease
        border-left: 1px solid #E0E0E0
        .contack-message-history-header
          height: 50px
          border-bottom: 1px solid #E0E0E0
          display: flex
          align-items: center
          padding-left: 20px
          >span
            font-size: 14px
            color: #444
            >i
              margin-left: 30px
              cursor: pointer
        .contack-message-history-content
          flex: 1
          overflow-y: scroll
          overflow-x: hidden
          &::-webkit-scrollbar
            width: 0px
            height: 0px
          &::-webkit-scrollbar-thumb
            border-radius: 0px
            -webkit-box-shadow: 0
            background: #1281FC
          &::-webkit-scrollbar-track
            // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2)
            border-radius: 0
            background: transparent
          .history-scroll-box
            height: 100%
            display: flex
            flex-direction: column
            .history-item
              margin: 10px 0
              padding: 10px 20px
              cursor: pointer
              &:hover
                background-color: #F4F4F4
              &.left
                .history-item-user-info
                  .history-item-user-info-username,
                  .history-item-user-time
                    color: #1281FC
              &.right
                .history-item-user-info
                  .history-item-user-info-username,
                  .history-item-user-time
                    color: #44AD1A
              .history-item-user-info
                display: flex
                .history-item-user-info-username
                  font-size: 16px
                .history-item-user-time
                  font-size: 14px
                  margin-left: 20px
              .history-item-body
                max-width: 100%
                overflow: hidden
                padding: 10px
                word-break: break-word
                .history-item-body-content
                  color: #444
                  font-size: #333
                  text-indent: 2em
        .contack-message-history-pageconfig
          height: 50px
          display: flex
          justify-content: center
          align-items: center
          font-size: 14px
          .pageconfig-tools-bar
            display: flex
            justify-content: center
            align-items: center
            font-size: 14px
            .page-tools-bar-item
              margin: 0 10px
              cursor: pointer
              padding: 5px
              &:hover
                background-color: #F4F4F4

</style>
<style lang="sass" scoped>
.message-card-item-house-info,
.history-item
  // .sendMsgClass
  //   max-width: 600px
  //   display: inline-block
  //   /deep/ img,audio,video
  //     max-width: 100%
  .message-content-style,
  .history-item-body
    .card-list-item
      width: 16.25em
      height: 19.375em
      background-color: #fff
      border-radius: 5px
      overflow: hidden
      border: 1px solid #E9E9E9
      .header-img
        height: 12.1875em
        width: 100%
        display: flex
        justify-content: center
        align-items: center
        overflow: hidden
        img
          // min-width: 100%
      .footer-intro
        height: 7.1875em
        padding: 0.375em
        display: flex
        flex-direction: column
        h4
          font-size: 1.25em
          font-weight: bold
          color: #444
          height: 1.5em
          line-height: 1.5em
          .mini
            font-size: .875em
        .intro
          display: flex
          justify-content: flex-start
          align-items: center
          height: 1.5em
          font-size: 1em
          width: 100%
          color: #666
          margin-bottom: .5em
          position: relative
          &:before
            position: absolute
            content: ''
            width: calc( 100% + 0.375em * 2 )
            height: 1px
            background: #E9E9E9
            bottom: -0.25em
            left: -0.375em
          .padding-5
            padding: 0 5px
          .icons-items
            display: flex
            // flex: 0 0 calc( 100% / 3 )
            justify-content: flex-start
            align-items: center
            img
              margin-right: 5px
              width: 1em
              height: 1em
        .art-itro
          article
            font-size: 14px
            color: #999
</style>
<style lang="sass" scoped>
/* 推荐房源消息的样式集合 */
.showHouseInfoClassOffsetHeight
  margin-bottom: 50px !important
  padding: 0 !important
  background-color: transparent
  border: none
  .card-list-item
    width: 16.25em
    height: 19.375em
    background-color: #fff
    border-radius: 5px
    overflow: hidden
    border: 1px solid #E9E9E9
    transition: all .3s ease
    &:hover
      box-shadow: 1px 1px 10px -2px #666
      transition: all .3s ease
    .header-img
      height: 12.1875em
      width: 100%
      display: flex
      justify-content: center
      align-items: center
      overflow: hidden
      img
        // min-width: 100%
    .footer-intro
      height: 7.1875em
      padding: 0.375em
      display: flex
      flex-direction: column
      h4
        font-size: 1.25em
        font-weight: bold
        color: #444
        height: 1.5em
        .mini
          font-size: .875em
      .intro
        display: flex
        justify-content: flex-start
        align-items: center
        height: 1.5em
        font-size: 1em
        width: 100%
        color: #666
        margin-bottom: .5em
        position: relative
        &:before
          position: absolute
          content: ''
          width: calc( 100% + 0.375em * 2 )
          height: 1px
          background: #E9E9E9
          bottom: -0.25em
          left: -0.375em
        .padding-5
          padding: 0 5px
        .icons-items
          display: flex
          // flex: 0 0 calc( 100% / 3 )
          justify-content: flex-start
          align-items: center
          img
            margin-right: 5px
            width: 1em
            height: 1em
      .art-itro
        article
          font-size: 14px
          color: #999
</style>
<style lang="sass">
  // Emoji
  .Emoji
    width: 280px
    border: none !important
    padding: 0
    border-color: none !important
    .popper__arrow
      display: none !important
    .emojiType
      .tab-customer-emoji
        .el-tabs__content
          padding: 10px
        .el-tabs__nav
          display: flex
          .el-tabs__item
            display: flex
            align-items: center
          .label-sty
            display: flex
            align-items: center
            font-size: 24px
            img
              width: 32px
              height: 32px
        .tab-emoji
          max-height: 200px
          overflow-y: scroll
          height: 200px
          &::-webkit-scrollbar
            width: 0px
            height: 0px
          &::-webkit-scrollbar-thumb
            border-radius: 0px
            -webkit-box-shadow: 0
            background: #1281FC
          &::-webkit-scrollbar-track
            // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2)
            border-radius: 0
            background: transparent
          .emoji-box
            display: flex
            flex-wrap: wrap
            .emoji-item
              cursor: pointer
              height: 32px
              width: 32px
              display: flex
              align-items: center
              justify-content: center
              &:hover
                background-color: gainsboro
              span
                font-size: 24px
</style>
<style lang="sass">
.showHouseInfoClassOffsetHeight
  padding: 0
  border: none
.customer-dom-box
  padding: 12px
  overflow-y: scroll
  max-height: 500px
  &::-webkit-scrollbar
    width: 4px
    height: 0px
  &::-webkit-scrollbar-thumb
    border-radius: 0px
    -webkit-box-shadow: 0
    background: #1281FC
  &::-webkit-scrollbar-track
    // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2)
    border-radius: 0
    background: transparent
  .service-box
    display: flex
    flex-direction: column
    .customer-service-item
      height: 45px
      width: 100%
      background-color: #fff
      border-radius: 5px
      overflow: hidden
      display: flex
      align-items: center
      margin: 5px 0
      cursor: pointer
      border: 1px solid #1281FC
      // justify-content: center
      &.Offline
        border: 1px solid #B1B1B1
        filter: grayscale(100%)
        >i
          color: #B1B1B1
        >span
          color: #B1B1B1
          font-size: 14px
      &.Online:hover
        background-color: #E0EFFF
      >i
        font-size: 24px
        color: #1281FC
        margin: 0 8px
      >span
        color: #1281FC
        font-size: 14px
</style>
