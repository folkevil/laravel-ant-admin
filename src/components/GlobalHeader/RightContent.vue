<template>
    <div>
        <div :class="wrpCls">
            <header-notice></header-notice>
            <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
        </div>
    </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import HeaderNotice from '../NoticeIcon'

export default {
    name: 'RightContent',
    components: {
        AvatarDropdown,
        HeaderNotice
    },
    props: {
        prefixCls: {
            type: String,
            default: 'ant-pro-global-header-index-action'
        },
        isMobile: {
            type: Boolean,
            default: () => false
        },
        topMenu: {
            type: Boolean,
            required: true
        },
        theme: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            showMenu: true,
            currentUser: {}
        }
    },
    computed: {
        wrpCls() {
            return {
                'ant-pro-global-header-index-right': true,
                [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
            }
        },
        userInfo() {
            return this.$store.getters.userInfo
        }
    },
    mounted() {
        this.currentUser = this.userInfo
    }

}
</script>
