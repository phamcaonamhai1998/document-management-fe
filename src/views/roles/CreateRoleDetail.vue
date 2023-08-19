<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue';
import { notification, type FormInstance, type TreeProps } from 'ant-design-vue';
import type { NRole } from '../../interface/role';

export default defineComponent({
    props: {
        visibleDrawer: Boolean,
        emitCloseDrawer: Function || undefined,
    },

    setup(props) {

        //
        const treeData: TreeProps['treeData'] = [
            {
                title: 'Users',
                key: 'users',
                children: [
                    {
                        title: 'List User',
                        key: 'list-user',
                    },
                    {
                        title: 'Create User',
                        key: 'create-user',
                    },
                    {
                        title: 'Edit User',
                        key: 'edit-user',
                    },
                    {
                        title: 'Delete User',
                        key: 'delete-user',
                    }
                ],
            },
            {
                title: 'Documents',
                key: 'documents',
                children: [
                    {
                        title: 'List Document',
                        key: 'list-document',
                    },
                    {
                        title: 'Create Document',
                        key: 'create-document',
                    },
                    {
                        title: 'Edit Document',
                        key: 'edit-document',
                    },
                    {
                        title: 'Delete Document',
                        key: 'delete-document',
                    },
                    {
                        title: 'Approve Document',
                        key: 'approve-document',
                    },
                ],
            },
            {
                title: 'Signatures',
                key: 'signatures',
                children: [
                    {
                        title: 'Create Signatures',
                        key: 'create-signatures',
                    },
                    {
                        title: 'Edit Signatures',
                        key: 'edit-signatures',
                    },
                    {
                        title: 'Delete Signatures',
                        key: 'delete-signatures',
                    }
                ],
            },
        ];
        const expandedKeys = ref<string[]>(['0-0-0', '0-0-1']);
        const selectedKeys = ref<string[]>(['0-0-0', '0-0-1']);
        const checkedKeys = ref<string[]>(['0-0-0', '0-0-1']);
        //

        const formRef = ref<FormInstance>();
        const formState = reactive<NRole.ICreateRole>({
            name: '',
            permissions: []
        });

        const openNotification = () => {
            notification.open({
                message: 'Notification',
                description:
                    'Create Role successfully.',
            });
        };
        watch(expandedKeys, () => {
            console.log('expandedKeys', expandedKeys);
        });
        watch(selectedKeys, () => {
            console.log('selectedKeys', selectedKeys);
        });
        watch(checkedKeys, () => {
            console.log('checkedKeys', checkedKeys);
        });

        const createRole = async () => {
            try {
                console.log("Value selected", selectedKeys)
                console.log("Checked key", checkedKeys);
                const values = await formRef.value?.validateFields();
                openNotification();
                console.log('Success:', values);
            } catch (errorInfo) {
                console.log('Failed:', errorInfo);
            }
        }

        const closeDrawer = () => {
            props.emitCloseDrawer && props.emitCloseDrawer();
        }

        return {
            closeDrawer,
            createRole,
            formState,
            props,
            formRef,
            treeData,
            selectedKeys,
            checkedKeys
        };
    },
});

</script>

<template>
    <a-drawer v-model:visible="props.visibleDrawer" class="custom-class" title="Create Role" placement="right" width="500"
        @close="closeDrawer">
        <template #extra>
            <a-button type="primary" @click="createRole">Save</a-button>
        </template>
        <a-form ref="formRef" :model="formState" layout="vertical" name="dynamic_rule">
            <a-form-item label="Name:" name="name" :rules="[{ required: true, message: 'Please input role name' }]">
                <a-input v-model:value="formState.name" />
            </a-form-item>
            <a-tree v-model:selectedKeys="selectedKeys" v-model:checkedKeys="checkedKeys" checkable :tree-data="treeData">
                <template #title="{ title, key }">
                    <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
                    <template v-else>{{ title }}</template>
                </template>
            </a-tree>
        </a-form>
    </a-drawer>
</template>


<style lang="scss">
.ant-input {
    height: 44px;
    width: 100%;
    line-height: 42px;
}
</style>