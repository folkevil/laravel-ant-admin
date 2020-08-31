<template>
    <page-header-wrapper>
        <a-card :body-style="{ padding: 0 }">
            <div class="table-operator-right">
                <a-button type="primary" icon="delete">清空</a-button>
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
                :showPagination="true"
                :expandRowByClick="true"
                :expandIcon="expandIcon"
            >

            <template slot="guard_name" slot-scope="row">
                <span v-if="row.guard_name === 'admin'">管理员</span>
            </template>

            <template slot="status" slot-scope="row">
                <a-badge :status="row.status | statusFilter"/>
                {{ row.status }}
            </template>

            <p slot="expandedRowRender" slot-scope="row">
                <a-divider v-if="row.agent">agent</a-divider>
                <a-row>{{ row.agent }}</a-row>
                <a-divider v-if="row.params">参数</a-divider>
                <a-row>{{ row.params }}</a-row>
                <a-divider v-if="row.response">响应</a-divider>
                <a-row>{{ row.response }}</a-row>
            </p>
      </s-table>
    </a-card>

  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import { fetchHandleLog } from '@/api/log'
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
        title: '身份',
        scopedSlots: { customRender: 'guard_name' }
    },
    {
        title: '账户',
        dataIndex: 'account'
    },
    {
        title: '操作',
        dataIndex: 'action'
    },
    {
        title: '方法',
        dataIndex: 'method'
    },
    {
        title: '请求',
        dataIndex: 'url'
    },
    {
        title: '状态',
        scopedSlots: { customRender: 'status' }
    },
    {
        title: 'IP',
        dataIndex: 'ip'
    },
    {
        title: '添加',
        dataIndex: 'created_at'
    }
]

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {},
  onSelect: (record, selected, selectedRows) => {},
  onSelectAll: (selected, selectedRows, changeRows) => {}
}

export default {
    data() {
        return {
            confirmLoading: false,
            info: {},
            dataAccessVisable: false,
            dataAccessDefaultExpandedKeys: [],
            queryParam: {},
            rowSelection,
            roleFormTitle: '角色表单',
            loadData: parameter => {
                return fetchHandleLog(Object.assign(parameter, this.queryParam)).then(res => {
                    return res.data
                })
            },
            selectedRows: [],
            columns
        }
    },
    components: { STable },
    watch: {},
    filters: {
        statusFilter(status) {
            if (status >= 300) {
                return 'warning'
            }
            return 'processing'
        }
    },
    methods: {
        refreshTable() {
            this.$refs.table.refresh()
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
