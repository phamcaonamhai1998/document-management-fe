<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import { notification, type FormInstance, type TreeProps } from 'ant-design-vue';
import type { NRole } from '../../interface/role';
import { SERVER_RESOURCE } from '../../constants/index.constant';
import axios from 'axios';

export default defineComponent({
    props: {
        visibleDrawer: Boolean,
        emitCloseDrawer: Function,
        roleId: String || null,
        refreshAsync: Function
    },
    watch: {
        roleId: String,
    },

    setup(props) {

        onMounted(() => {
            if (props.roleId) {
                getById(props.roleId);
            }

        })

        const getById = async (id: string) => {
            await axios.get(
                `${SERVER_RESOURCE}/role/${id}`
            ).then((res) => {
                if (res.data) {
                    formState.name = res.data.name;
                    formState.permissions = res.data.permissions;
                }
            })
                .catch((error) => {
                    notification.error({
                        message: `An error has occurred`,
                        type: 'error'
                    });
                    console.log(error);
                });
        }
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
        // const expandedKeys = ref<string[]>(['0-0-0', '0-0-1']);
        const selectedKeys = ref<string[]>(['0-0-0', '0-0-1']);
        const checkedKeys = ref<string[]>(['0-0-0', '0-0-1']);
        //
        const formRef = ref<FormInstance>();
        const formState = reactive<NRole.ICreateRole>({
            name: '',
            permissions: []
        });

        // watch(expandedKeys, () => {
        // });
        watch(selectedKeys, () => {
        });
        watch(checkedKeys, () => {
        });

        const closeDrawer = () => {
            formRef.value?.resetFields();
            checkedKeys.value = [];
            props.emitCloseDrawer && props.emitCloseDrawer();
        }

        const onCreate = async () => {
            try {
                const values = await formRef.value?.validateFields();
                if (values) {
                    createRole(values as NRole.ICreateRole);

                }
            } catch (error) {
                console.log('Failed:', error);
            }
        }

        const createRole = async (roleDto: NRole.ICreateRole) => {
            roleDto.permissions = [];
            checkedKeys.value.forEach((item) => {
                if (item.split('-').length === 2) {
                    const itemSplited = item.split('-');
                    roleDto.permissions.push({
                        code: itemSplited[0],
                        name: itemSplited[1],
                        groupCode: itemSplited[1],
                    })
                }
            });

            axios.post(`${SERVER_RESOURCE}/role`, roleDto)
                .then((res) => {
                    if (res) {
                        notification.success({
                            message: 'Create successfully',
                            type: 'success'
                        });
                        closeDrawer();
                        props.refreshAsync && props.refreshAsync();
                        checkedKeys.value = []
                    }
                })
                .catch((error) => {
                    console.error(error);
                    notification.error({
                        message: 'An error has occurred',
                        type: 'error'
                    });
                });
        }

        return {
            closeDrawer,
            onCreate,
            formState,
            props,
            formRef,
            treeData,
            selectedKeys,
            checkedKeys,
        };
    },
});

</script>

<template>
    <a-drawer v-model:visible="props.visibleDrawer" class="custom-class" title="Create Role" placement="right" width="500"
        @close="closeDrawer">
        <template #extra>
            <a-button type="primary" @click="onCreate">Save</a-button>
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