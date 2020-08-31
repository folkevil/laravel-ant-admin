<template>
    <div class="main">
        <div class="desc">
            {{ hitokoto }}
        </div>
        <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
            <a-tabs :activeKey="customActiveKey" :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }">
                <a-tab-pane key="tab1" tab="开始起航">
                    <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" message="账户或密码错误" />
                    <a-form-item>
                        <a-input
                            size="large"
                            type="text"
                            placeholder="请输入管理员账户"
                            v-decorator="[
                                'account',
                                {rules: [{ required: true, message: '请输入帐户名' }], validateTrigger: 'blur'}
                            ]"
                        >
                            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
                        </a-input>
                    </a-form-item>

                    <a-form-item>
                        <a-input
                            size="large"
                            type="password"
                            autocomplete="false"
                            placeholder="请输入密码"
                            v-decorator="[
                                'password',
                                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
                            ]"
                        >
                            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
                        </a-input>
                    </a-form-item>
                </a-tab-pane>
            </a-tabs>

            <a-form-item style="margin-top:24px">
                <a-button size="large" type="primary" htmlType="submit" class="login-button" :loading="state.loginBtn" :disabled="state.loginBtn">登录</a-button>
            </a-form-item>
        </a-form>

        <two-step-captcha v-if="requiredTwoStepCaptcha" :visible="stepCaptchaVisible" @success="stepCaptchaSuccess" @cancel="stepCaptchaCancel"></two-step-captcha>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { getHitokoto } from '@/api/tools'

export default {
    components: {},
    data() {
        return {
            customActiveKey: 'tab1',
            loginBtn: false,
            isLoginError: false,
            requiredTwoStepCaptcha: false,
            stepCaptchaVisible: false,
            form: this.$form.createForm(this),
            state: {
                time: 60,
                loginBtn: false,
                smsSendBtn: false
            },
            hitokoto: ''
        }
    },
    created () {
        getHitokoto('c=d').then(res => {
            this.hitokoto = res.hitokoto
        })
    },
    methods: {
        ...mapActions(['Login', 'Logout']),
        // handler
        handleSubmit(e) {
            e.preventDefault()
            const {
                form: { validateFields },
                state,
                Login
            } = this

            state.loginBtn = true

            const validateFieldsKey = ['account', 'password']

            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    const loginParams = { ...values }

                    Login(loginParams)
                        .then(res => this.loginSuccess(res))
                        .catch(err => this.requestFailed(err))
                        .finally(() => {
                            state.loginBtn = false
                        })
                } else {
                    setTimeout(() => {
                        state.loginBtn = false
                    }, 600)
                }
            })
        },
        // 登录成功
        loginSuccess(res) {
            this.isLoginError = false
            this.$router.push({ path: '/' })
            // 延迟 1 秒显示欢迎信息
            setTimeout(() => {
                this.$notification.success({
                    message: '欢迎',
                    description: `${timeFix()}，欢迎回来`
                })
            }, 1000)
        },
        requestFailed() {
            this.isLoginError = true
        }
    }
}
</script>

<style lang="less" scoped>
.user-layout-login {
    label {
        font-size: 14px;
    }
    .getCaptcha {
        display: block;
        width: 100%;
        height: 40px;
    }
    .forge-password {
        font-size: 14px;
    }
    button.login-button {
        padding: 0 15px;
        font-size: 16px;
        height: 40px;
        width: 100%;
    }
    .user-login-other {
        text-align: left;
        margin-top: 24px;
        line-height: 22px;
        .item-icon {
            font-size: 24px;
            color: rgba(0, 0, 0, 0.2);
            margin-left: 16px;
            vertical-align: middle;
            cursor: pointer;
            transition: color 0.3s;
            &:hover {
                color: #1890ff;
            }
        }
        .register {
            float: right;
        }
    }
}
.desc {
    display: flex;
    margin-top: 20px;
    margin-bottom: 20px;
    justify-content: center;
}
</style>
