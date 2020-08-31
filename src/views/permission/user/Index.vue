<template>
    <page-header-wrapper :content="description">
        <a-card :body-style="{ padding: 0 }">
            <div class="table-operator-right">
                <a-button v-action:addAdmin type="primary" icon="plus" @click="userFromVisible = true">新建</a-button>
                <a-divider type="vertical" />
                <span class="ant-pro-table-toolbar-item-icon">
                    <a-tooltip placement="top">
                        <template slot="title">
                            <span>刷新</span>
                        </template>
                        <a-icon type="reload" @click="refreshTable()"/>
                    </a-tooltip>
                </span>
            </div>

            <s-table
            ref="table"
            size="default"
            :rowKey="(record) => record.id"
            :columns="columns"
            :data="loadData"
            :expandRowByClick="true"
            :showPagination="false"
            :expandIcon="expandIcon"
            >
                <template slot="status" slot-scope="row">
                    <template v-if="row.status === 1">
                        <a-badge status="processing" text="启用中"/>
                    </template>

                    <template v-else>
                        <a-badge status="default" text="禁用中" />
                    </template>
                </template>

                <template slot="expandedRowRender" slot-scope="row">
                    <a-row>
                        <a-col class="rule-list" span="12" v-for="(item, index) in rules" :key="index">
                            <a-row style="margin-top: 5px;">
                                <a-col span="4">{{ item.title }}：</a-col>
                                <a-col span="20">
                                    <template v-if="!item.actions.length">-</template>

                                    <template v-for="(action, i) in item.actions">
                                        <a-tag color="blue" :key="i" v-if="row.rules.indexOf(action.id) !== -1">
                                            {{ action.title }}
                                        </a-tag>
                                        <a-tag :key="i" v-else>
                                            {{ action.title }}
                                        </a-tag>
                                    </template>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                </template>

                <template slot="tools" slot-scope="row">
                    <a v-action:editAdmin @click="editUserForm(row)">编辑</a>
                    <a-divider type="vertical" />
                    <a v-action:deleteAdmin @click="showDeleteConfirm(row.id)">删除</a>
                </template>
            </s-table>

        </a-card>

        <userForm
            ref="userForm"
            :title="userFormTitle"
            :rules="rules"
            :roles="roles"
            :selecteId="selecteId"
            :visible="userFromVisible"
            :confirmLoading="confirmLoading"
            @submit="handleUserSubmit"
            @cancel="handleUserCancel"
        />

    </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import UserForm from './components/UserForm'
import { fetchAccount, deleteAccount, createAccount, updateAccount } from '@/api/admin'
const columns = [{
        title: '帐号昵称',
        dataIndex: 'nickname'
    },
    {
        title: '登录账号',
        dataIndex: 'account'
    },
    {
        title: '账号角色',
        dataIndex: 'role.title'
    },
    {
        title: '账号状态',
        scopedSlots: { customRender: 'status' }
    },
    {
        title: '更新时间',
        dataIndex: 'updated_at'
    },
    {
        title: '创建时间',
        dataIndex: 'created_at'
    },
    {
        title: '操作',
        scopedSlots: { customRender: 'tools' }
    }
]

export default {
    data() {
        return {
            description: '后台管理账号列表',
            visible: false,
            userFromVisible: false,
            confirmLoading: false,
            selecteId: 0,
            rules: [],
            roles: [],
            columns,
            userFormTitle: '新建',
            loadData: parameter => {
                return fetchAccount().then(res => {
                    const { users, rules, roles } = res.data
                    this.rules = rules
                    this.roles = roles
                    return {
                        data: users
                    }
                })
            }
        }
    },
    components: { STable, UserForm },
    methods: {
        refreshTable(bool = false) {
            this.$refs.table.refresh(bool)
        },
        showDeleteConfirm(id) {
            this.$confirm({
                title: '确定删除此用户吗?',
                content: '',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk: () => {
                    const hide = this.$message.loading('删除中..', 0)
                    deleteAccount(id).then(res => {
                        this.$message.success('删除成功！')
                        this.refreshTable()
                    }).finally(() => {
                        hide()
                    })
                }
            })
        },
        handleUserCancel() {
            this.userFromVisible = false
            this.$refs.userForm.form.resetFields()
            this.selecteId = 0
        },
        handleUserSubmit() {
            this.$refs.userForm.form.validateFields((err, values) => {
                if (!err) {
                    !values.password && delete values.password
                    console.log('values', values)
                    const request = this.selecteId === 0 ? createAccount(values) : updateAccount(this.selecteId, values)
                    request.then(res => {
                        this.$message.success(this.selecteId === 0 ? '添加成功！' : '更新成功！')
                        this.handleUserCancel()
                        this.refreshTable()
                    })
                }
            })
        },

        editUserForm(row) {
            this.selecteId = row.id
            this.userFromVisible = true
            this.userFormTitle = '编辑'
            this.$nextTick(() => {
                this.$refs.userForm.form.setFieldsValue({
                    account: row.account,
                    nickname: row.nickname,
                    role_id: row.role_id,
                    status: row.status
                })
            })
        },

        expandIcon({ expanded }) {
            if (expanded === true) {
                return <a-icon type = 'down' />
            }
            return <a-icon type = 'right' />
        }
    }
}
</script>

<style lang="less">

</style>
