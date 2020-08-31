<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
  >
    <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
      <a-list-item-meta>
        <a slot="title">{{ item.title }}</a>
        <span slot="description">
          <span class="security-list-description">{{ item.description }}</span>
          <span v-if="item.value"> : </span>
          <span class="security-list-value">{{ item.value }}</span>
        </span>
      </a-list-item-meta>
      <template v-if="item.actions">
        <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
      </template>

    </a-list-item>
  </a-list>
</template>

<script>
export default {
  data () {
    return {
      data: [
        { title: '账户密码', description: '当前密码强度', value: '强', actions: { title: '修改', callback: () => { this.$message.info('This is a normal message') } } },
        { title: '开启谷歌验证', description: '登录时必须输入谷歌令牌，可有效保护账号安全', value: '', actions: { title: '设置', callback: () => { this.$message.error('暂未开启') } } },
        { title: '异地登录报警', description: '登录地区与上次不同时，将发送邮件通知', value: '', actions: { title: '设置', callback: () => { this.$message.error('暂未开启') } } },
        { title: '登录失败限制', description: '限定登录失败次数，多次失败登录后在限定时间内无法登录', value: '', actions: { title: '设置', callback: () => { this.$message.error('暂未开启') } } }
      ]
    }
  }
}
</script>

<style scoped>

</style>
