<template>
  <a-modal
    :title="title"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="$emit('submit')"
    @cancel="$emit('cancel')"
    >
    <a-form :form="form" layout="inline" labelAlign="left">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="登录账号" hasFeedback>
            <a-input
              :disabled="selecteId !== 0"
              placeholder="请入登录账号"
              v-decorator="[
                'account',
                {
                  rules: [{ required: true, message: '请输入登录账号!' }]
                }
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="登录密码" hasFeedback>
            <a-input
              :placeholder="selecteId ? '请入登录密码' : '请输入修改密码'"
              v-decorator="[
                'password',
                {
                  rules: [{ required: selecteId === 0, message: '请输入登录密码!' }, { min:8, message: '密码最少长度为8位!' }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="用户昵称" hasFeedback>
            <a-input
              placeholder="请入用户昵称"
              v-decorator="[
                'nickname',
                {
                  rules: [{ required: true, message: '请输入用户名称!' }]
                }
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="选择角色" hasFeedback>
            <a-select
              style="min-width:171px"
              placeholder="请选择角色"
              v-decorator="[
                'role_id',
                {
                  rules: [{ required: true, message: '请选择角色!' }]
                }
              ]"
            >
                <a-select-option :value="item.name" v-for="(item, key) in roles" :key="key">{{ item.title }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="状态" hasFeedback>
            <a-select
              style="min-width:171px"
              v-decorator="[
                'status',
                {
                  rules: [{ required: true, message: '请选择状态!' }]
                }
              ]"
              placeholder="请选择"
            >
              <a-select-option :value="1">
                正常
              </a-select-option>
              <a-select-option :value="0">
                禁用
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: {
    selecteId: {
      type: Number,
      default: 0
    },
    roles: {
      type: Array,
      default: () => {
        return []
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    confirmLoading: {
      type: Boolean,
      default: false
    },
    title: {
        type: String,
        default: '用户表单'
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'user_form' })
  }
}
</script>
