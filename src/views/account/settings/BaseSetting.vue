<template>
    <div class="account-settings-info-view">
        <a-row :gutter="16">
            <a-col :md="24" :lg="16">

                <a-form layout="vertical" :form="form" @submit="handleSubmit">
                    <a-form-item label="昵称">
                        <a-input
                            v-decorator="['nickname']"
                            placeholder="给自己起个名字吧"
                        />
                    </a-form-item>

                    <a-form-item label="邮箱">
                        <a-input
                            v-decorator="['email']"
                            placeholder="输入要绑定的邮箱"
                        />
                    </a-form-item>

                    <a-form-item>
                        <a-button type="primary" html-type="submit" :loading="updating">更新资料</a-button>
                    </a-form-item>
                </a-form>

            </a-col>
            <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
                <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
                    <a-icon type="cloud-upload-o" class="upload-icon" />
                    <div class="mask">
                        <a-icon type="plus" />
                    </div>
                    <img :src="option.img" />
                </div>
            </a-col>

        </a-row>

        <avatar-modal ref="modal" @ok="setavatar" />

    </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import { modifyProfile } from '@/api/admin'
import { mapActions } from 'vuex'

export default {
    components: {
        AvatarModal
    },
    data() {
        return {
            loading: true,
            updating: false,
            uploading: false,
            avatar: '',
            // cropper
            preview: {},
            option: {
                img: '/avatar2.jpg',
                info: true,
                size: 1,
                outputType: 'jpeg',
                canScale: false,
                autoCrop: true,
                // 只有自动截图开启 宽度高度才生效
                autoCropWidth: 180,
                autoCropHeight: 180,
                fixedBox: true,
                // 开启宽度和高度比例
                fixed: true,
                fixedNumber: [1, 1]
            }
        }
    },
    created() {
        this.form = this.$form.createForm(this, {
            mapPropsToFields: () => {
                return {
                    email: this.$form.createFormField({
                        value: this.userInfo.email
                    }),
                    nickname: this.$form.createFormField({
                        value: this.userInfo.nickname
                    })
                }
            }
        })
    },
    mounted() {
        this.option.img = this.userInfo.avatar
    },
    computed: {
        userInfo() {
            return this.$store.getters.userInfo
        }
    },
    methods: {
        ...mapActions(['GetInfo']),
        setavatar(image) {
            this.option.img = image.domain + '/' + image.path
            this.avatar = image.path
        },
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (this.avatar) values['avatar'] = this.avatar
                if (!err) {
                    this.updating = true
                    const hide = this.$message.loading('更新中..', 0)
                    modifyProfile(values).then(res => {
                        this.$message.success('更新成功')
                        this.GetInfo()
                    }).finally(() => {
                        hide()
                        this.updating = false
                    })
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.avatar-upload-wrapper {
    height: 200px;
    width: 100%;
}

.ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    .upload-icon {
        position: absolute;
        top: 0;
        right: 10px;
        font-size: 1.4rem;
        padding: 0.5rem;
        background: rgba(222, 221, 221, 0.7);
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
        opacity: 0;
        position: absolute;
        background: rgba(0, 0, 0, 0.4);
        cursor: pointer;
        transition: opacity 0.4s;
        &:hover {
            opacity: 1;
        }
        i {
            font-size: 2rem;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -1rem;
            margin-top: -1rem;
            color: #d6d6d6;
        }
    }
    img,
    .mask {
        width: 100%;
        max-width: 180px;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
    }
}
</style>
