<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="$emit('submit')"
    @cancel="$emit('cancel')"
  >
    <div class="role-from">
        <a-form :form="form" layout="inline">
            <a-form-item label="识别码" hasFeedback>
                <a-input
                    placeholder="唯一识别码（英文）"
                    style="width: 200px"
                    v-decorator="[
                        'name',
                        {
                        rules: [{ required: true, message: '请输入唯一识别码!' }]
                        }
                    ]"
                />
            </a-form-item>

        <a-form-item label="角色名称" hasFeedback :span="8">
            <a-input
            placeholder="请入角色名称"
            style="width: 200px"
            v-decorator="[
                'title',
                {
                rules: [{ required: true, message: '请输入角色名称!' }]
                }
            ]"
            />
        </a-form-item>

        <a-form-item label="状态" hasFeedback :span="8">
            <a-select
            style="width: 200px"
            v-decorator="[
                'status',
                {
                rules: [{ required: true, message: '请选择状态!' }]
                }
            ]"
            placeholder="请选择"
            >
            <a-select-option :value="1">
                启用
            </a-select-option>
            <a-select-option :value="0">
                禁用
            </a-select-option>
            </a-select>
        </a-form-item>

        <a-divider dashed> 权限设置 </a-divider>

            <a-collapse v-model="activeKey" expand-icon-position="right">
                <a-collapse-panel header="请选择权限" key="1">
                    <a-table :columns="columns" :dataSource="rules" :pagination="false" size="small" :showHeader="false">
                        <span slot="permission" slot-scope="row">
                            <a-checkbox-group @change="$emit('changeAction', row)" v-model="row.selected">
                                <a-checkbox :value="action.id" :disabled="action.disabled" v-for="(action, i) in row.actions" :key="i">
                                    {{ action.title }}
                                </a-checkbox>
                            </a-checkbox-group>
                        </span>

                        <span slot="checkAll" slot-scope="row">
                            <a-checkbox
                            :indeterminate="row.indeterminate"
                            :checked="row.checkedAll"
                            @change="$emit('checkAllActionChange', $event, row)"
                            ></a-checkbox>
                        </span>
                    </a-table>

                    <!-- <div @click="e => {e.stopPropagation()}" slot="extra">
                        <a-checkbox>全部</a-checkbox>
                    </div> -->
                </a-collapse-panel>
            </a-collapse>
        </a-form>
    </div>
  </a-modal>
</template>

<script>
const columns = [
    {
        title: '表单',
        dataIndex: 'title'
    },
    {
        title: '权限',
        scopedSlots: {
            customRender: 'permission'
        }
    },
    {
        title: '全选',
        scopedSlots: {
            customRender: 'checkAll'
        }
    }
]

export default {
    props: {
        rules: {
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
            default: '表单'
        }
    },
    data() {
        return {
            columns,
            activeKey: ['1']
        }
    },
    methods: {

    },
    beforeCreate() {
        this.form = this.$form.createForm(this, {
            name: 'role_from'
        })
    }
}
</script>

<style lang="less" scoped>
    .role-from /deep/ .ant-collapse {
        background-color: #fff;
    }
    .role-from /deep/ .ant-table-small {
        border: none;
    }
    .role-from /deep/ .ant-collapse-content > .ant-collapse-content-box {
        padding: 0;
    }
</style>
