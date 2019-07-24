<template>
  <section class="AppComponent">
    <vue-hx-message-component></vue-hx-message-component>
  </section>
</template>

<script>
import VueHxMessageComponent from '@/components/hxmessage'
export default {
  name: 'App',
  components: {
    'vue-hx-message-component': VueHxMessageComponent
  },
  data () {
    return {}
  },
  mounted () {
    console.log('开启环信即时聊天通讯')
    // 更新环信用户
    this.$WebImOptions.user = 'username'
    // 登录操作
    this.$imConn.open(this.$WebImOptions)
  }
}
</script>
<style lang="sass">
  @import url('//at.alicdn.com/t/font_1313448_8is417ayo1o.css')
</style>
