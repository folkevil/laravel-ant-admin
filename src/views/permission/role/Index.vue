<template>
    <page-header-wrapper>
        <a-card :body-style="{ padding: 0 }">
            <div class="table-operator-right">
                <a-button v-action:addRole type="primary" icon="plus" @click="onAddRole">新建</a-button>
                <a-divider type="vertical"/>
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

            <p slot="expandedRowRender" slot-scope="row">
                <a-row>
                    <a-col class="rule-list" span="12" v-for="(item, index) in rules" :key="index">
                    <a-row style="margin-top:5px;">
                        <a-col span="4">{{ item.title }}：</a-col>
                        <a-col span="20">
                        <template v-if="!item.actions.length">-</template>
                        <template v-for="(action, i) in item.actions">
                            <a-tag color="blue" :key="i" v-if="row.permissions.indexOf(action.id) !== -1">
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
            </p>

            <template slot="status" slot-scope="row">
                <a-badge :status="row.status | statusTypeFilter" :text="row.status | statusFilter" />
            </template>

            <template slot="fulltitle" slot-scope="row">
                <span v-html="row.title"></span>
            </template>

            <template slot="tools" slot-scope="row">
                <a v-action:editRole @click="showRoleModal(row)">编辑</a>
                <a-divider type="vertical" />
                <a v-action:deleteRole @click="handleRoleDeleteConfirm(row.id)">删除</a>
            </template>
      </s-table>
    </a-card>

    <RoleForm
        ref="roleForm"
        :title="roleFormTitle"
        :rules="rules"
        :visible="roleVisible"
        :confirmLoading="confirmLoading"
        @changeRole="filterRuleAction"
        @checkAllActionChange="onCheckAllActionChange"
        @changeAction="onChangeAction"
        @changeAll="onChangeAll"
        @submit="handleRoleSubmit"
        @cancel="handleRoleCancel"
    />

  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import RoleForm from './components/RoleForm'
import { fetchRole, addRole, updateRole, deleteRole } from '@/api/role'
const statusMap = {
    0: {
        status: 'default',
        text: '已禁用'
    },
    1: {
        status: 'processing',
        text: '使用中'
    }
}

const columns = [{
        title: '唯一识别码',
        dataIndex: 'name'
    },
    {
        title: '角色名称',
        scopedSlots: { customRender: 'fulltitle' }
    },
    {
        title: '角色状态',
        scopedSlots: { customRender: 'status' }
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
            confirmLoading: false,
            info: {},
            rules: [],
            roleVisible: false,
            roles: [],
            dataAccessVisable: false,
            dataAccessDefaultExpandedKeys: [],
            selectedId: 0,
            roleTree: [],
            queryParam: {},
            roleFormTitle: '角色表单',
            loadData: parameter => {
                return fetchRole().then(res => {
                    const { roles, rules } = res.data
                    this.roles = roles
                    this.rules = rules
                    this.rulesSelectedInit(rules)

                    return {
                        data: roles
                    }
                })
            },
            selectedRows: [],
            allActionIds: [],
            columns
        }
    },
    components: { STable, RoleForm },
    watch: {},
    filters: {
        statusFilter(type) {
            return statusMap[type].text
        },
        statusTypeFilter(type) {
            return statusMap[type].status
        }
    },
    methods: {
        onAddRole() {
            this.roleFormTitle = '新建'
            this.roleVisible = true
            this.filterRuleAction()
            this.$nextTick(() => {
                this.$refs.roleForm.form.setFieldsValue()
            })
        },
        showRoleModal(row) {
            this.roleVisible = true
            this.selectedId = row.id
            this.info = row
            this.roleFormTitle = '编辑'

            this.filterRuleAction()

            this.$nextTick(() => {
                this.$refs.roleForm.form.setFieldsValue({
                    name: row.name,
                    title: row.title,
                    status: row.status
                })
            })
        },
        handleRoleCancel() {
            this.roleVisible = false
            this.$refs.roleForm.form.resetFields()
            this.selectedId = 0
            this.rules.map(rule => {
                rule.selected = []
                rule.indeterminate = false
                rule.checkedAll = false
                rule.disabled = false
                rule.actions.map(action => {
                    action.disabled = false
                })
            })
        },
        handleRoleSubmit() {
            this.$refs.roleForm.form.validateFields((err, values) => {
                if (!err) {
                    const checkedList = []
                    const { selectedId, rules } = this
                    rules.map(item => {
                        item.selected.map(s => {
                            checkedList.push(s)
                        })
                    })
                    values.rules = checkedList
                    const promise = selectedId === 0 ? addRole(values) : updateRole(selectedId, values)
                    this.confirmLoading = true
                    const hide = this.$message.loading('执行中..', 0)
                    promise.then(res => {
                        this.$message.success(this.selectedId === 0 ? '添加成功！' : '更新成功！')
                        this.handleRoleCancel()
                        this.refreshTable()
                    }).finally(() => {
                        hide()
                        this.confirmLoading = false
                    })
                }
            })
        },
        handleRoleDeleteConfirm(id) {
            this.$confirm({
                title: '确定删除此角色吗?',
                content: '',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk: () => {
                    const hide = this.$message.loading('删除中..', 0)
                    deleteRole(id).then(res => {
                        this.$message.success('删除成功！')
                        this.refreshTable()
                    }).finally(r => {
                        hide()
                    })
                }
            })
        },

        expandedDept(depts) {
            const expandedKeys = []
            depts.map(dept => {
                expandedKeys.push(dept.value)
                if (dept.children !== undefined) {
                    expandedKeys.push(...this.expandedDept(dept.children))
                }
            })

            return expandedKeys
        },

        onChangeAction(permission) {
            let notDisabledLen = 0
            permission.actions.map(action => {
                if (action.disabled === false) {
                    notDisabledLen = notDisabledLen + 1
                }
            })
            permission.indeterminate = !!permission.selected.length && (permission.selected.length < notDisabledLen)
            permission.checkedAll = permission.selected.length === notDisabledLen
            this.rules = [...this.rules]
        },

        onCheckAllActionChange(e, permission) {
            console.log(e)
            // 记录有权限的操作
            const hasPermissionAction = []
            permission.actions.map(action => {
                if (action.disabled === false) {
                    hasPermissionAction.push(action.id)
                }
            })
            Object.assign(permission, {
                selected: e.target.checked ? hasPermissionAction : [],
                indeterminate: false,
                checkedAll: e.target.checked
            })
            this.rules = [...this.rules]
        },
        onChangeAll() {

        },
        refreshTable() {
            this.$refs.table.refresh()
        },
        filterRuleAction() {
            const { rules } = this
            let allPermissionActionsIds = []
            allPermissionActionsIds = this.allActionIds
            // 更新时 自动勾选已选择的权限
            if (this.selectedId > 0) {
                const { info: { permissions } } = this
                rules.map(rule => {
                    rule.selected = []
                    // 记录当前菜单可选操作数量
                    let ruleSelectCount = 0

                    rule.actions.map(action => {
                        if (permissions.indexOf(action.id) !== -1) {
                            rule.selected.push(action.id)
                        }
                        action.disabled = allPermissionActionsIds.indexOf(action.id) === -1
                        if (action.disabled === false) {
                            ruleSelectCount = ruleSelectCount + 1
                        }
                    })

                    rule.indeterminate = !!rule.selected.length && (rule.selected.length < ruleSelectCount)
                    if (rule.selected.length) {
                        rule.checkedAll = rule.selected.length === ruleSelectCount
                    }
                })
            } else {
                // 创建时
                rules.map(rule => {
                    rule.actions.map(action => {
                        action.disabled = allPermissionActionsIds.indexOf(action.id) === -1
                    })
                })
            }
            this.rules = [...rules]
        },
        rulesSelectedInit(rules) {
            const allActionIds = []
            this.rules = rules.map(item => {
                Object.assign(item, {
                    selected: [],
                    indeterminate: false,
                    checkedAll: false,
                    disabled: false
                })
                // 初始化状态
                if (item.actions.length > 0) {
                    item.actions.map(action => {
                        allActionIds.push(action.id)
                        action.disabled = false
                    })
                }
                return item
            })
            this.allActionIds = allActionIds
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
