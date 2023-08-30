<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import { notification, type FormInstance, type TreeProps } from 'ant-design-vue';
import type { NRole } from '../../interface/role';
import { SERVER_RESOURCE, TOKEN_KEY } from '../../constants/index.constant';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useMenu } from '../../stores/use-menu';
import router from '../../router';
import type { NPermission } from '../../interface/permission';
import jwt_decode from 'jwt-decode';


export default defineComponent({
    setup(props) {
        const store = useMenu();
        store.onSelectedKeys(["roles"]);
        const route = useRoute();
        const id: string = route.params.id as string;
        const token = localStorage.getItem(TOKEN_KEY);
        const decodeToken: any = token && jwt_decode(token);
        // const orgClaim = decodeToken?.org ? JSON.parse(decodeToken?.org) : null;
        const depClaim = decodeToken?.department ? JSON.parse(decodeToken?.department) : null;

        const treeData: TreeProps['treeData'] = [
            {
                title: 'Role',
                key: 'role',
                children: [
                    {
                        title: 'List Role',
                        key: 'List-Role',
                    },
                    {
                        title: 'Create Role',
                        key: 'Create-Role',
                    },
                    {
                        title: 'Update Role',
                        key: 'Update-Role',
                    },
                    {
                        title: 'Delete Role',
                        key: 'Delete-Role',
                    }
                ],
            },
            {
                title: 'User',
                key: 'user',
                children: [
                    {
                        title: 'List User',
                        key: 'List-User',
                    },
                    {
                        title: 'Create User',
                        key: 'Create-User',
                    },
                    {
                        title: 'Update User',
                        key: 'Update-User',
                    },
                    {
                        title: 'Delete User',
                        key: 'Delete-User',
                    },
                    {
                        title: 'Assign User',
                        key: 'Assign-User'
                    }
                ],
            },
            {
                title: 'Document',
                key: 'document',
                children: [
                    {
                        title: 'List Document',
                        key: 'List-Document',
                    },
                    {
                        title: 'Create Document',
                        key: 'Create-Document',
                    },
                    {
                        title: 'Update Document',
                        key: 'Update-Document',
                    },
                    {
                        title: 'Delete Document',
                        key: 'Delete-Document',
                    },
                    {
                        title: 'Approve Document',
                        key: 'Approve-Document',
                    },
                ],
            },
            {
                title: 'Department',
                key: 'department',
                children: [
                    {
                        title: 'List Department',
                        key: 'List-Department',
                    },
                    {
                        title: 'Create Department',
                        key: 'Create-Department',
                    },
                    {
                        title: 'Update Department',
                        key: 'Update-Department',
                    },
                    {
                        title: 'Delete Department',
                        key: 'Delete-Department',
                    }
                ],
            },
            {
                title: 'Procedure',
                key: 'procedure',
                children: [
                    {
                        title: 'List Procedure',
                        key: 'List-Procedure',
                    },
                    {
                        title: 'Create Procedure',
                        key: 'Create-Procedure',
                    },
                    {
                        title: 'Update Procedure',
                        key: 'Update-Procedure',
                    },
                    {
                        title: 'Delete Procedure',
                        key: 'Delete-Procedure',
                    }
                ],
            },
            // {
            //     title: 'Signature',
            //     key: 'signature',
            //     children: [
            //         {
            //             title: 'Create Signature',
            //             key: 'Create-Signature',
            //         },
            //         {
            //             title: 'Update Signature',
            //             key: 'Update-Signature',
            //         },
            //         {
            //             title: 'Delete Signature',
            //             key: 'Delete-Signature',
            //         },
            //     ],
            // },
        ];
        const selectedKeys = ref<string[]>([]);
        const checkedKeys = ref<string[]>([]);
        //
        const formRef = ref<FormInstance>();
        const formState = reactive<NRole.ICreateRole>({
            name: '',
            permissions: []
        });

        watch(selectedKeys, () => {
        });

        watch(checkedKeys, () => {
        });

        onMounted(() => {
            if (id) {
                getById(id);
            }

        })

        const getById = async (id: string) => {
            await axios.get(
                `${SERVER_RESOURCE}/role/${id}`
            ).then((res) => {
                if (res.data) {
                    formState.name = res.data.name;
                    formState.permissions = res.data.permissions;

                    const mapListPermission: string[] = [];
                    formState.permissions.forEach((item) => {
                        mapListPermission.push(`${item.code}-${item.name}`)
                    })
                    if (mapListPermission.length) {
                        checkedKeys.value = mapListPermission;
                    }
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
            roleDto.permissions = mapDataPermissions(checkedKeys.value);
            axios.post(`${SERVER_RESOURCE}/role`, roleDto)
                .then((res) => {
                    if (res) {
                        notification.success({
                            message: 'Create successfully',
                            type: 'success'
                        });
                        router.push('/roles')
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

        const onUpdate = async () => {
            try {
                const values = await formRef.value?.validateFields();
                if (values) {
                    updateRole(values as NRole.IUpdateRole);
                }
            } catch (errorInfo) {
                console.log('Failed:', errorInfo);
            }
        };

        const updateRole = (roleUpdateDto: NRole.IUpdateRole) => {
            roleUpdateDto.permissions = mapDataPermissions(checkedKeys.value);
            axios.put(`${SERVER_RESOURCE}/role/${id}`, roleUpdateDto)
                .then((res) => {
                    if (res) {
                        notification.success({
                            message: 'Update successfully',
                            type: 'success'
                        });
                    }
                    router.push('/roles')
                })
                .catch((error) => {
                    notification.error({
                        message: 'An error has occurred',
                        type: 'error'
                    });
                    console.log(error);
                });
        }

        const mapDataPermissions = (checkedKeys: string[]): any[] => {
            const permissions: NPermission.ICreatePermission[] = [];
            checkedKeys.forEach((item) => {
                if (item.split('-').length === 2) {
                    const itemSplited = item.split('-');
                    permissions.push({
                        code: itemSplited[0],
                        name: itemSplited[1],
                        groupCode: itemSplited[1],
                    })
                }
            });
            return permissions;
        }

        return {
            id,
            onCreate,
            onUpdate,
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
    <div class="block-container">
        <div class="block-heading">
            <span v-if="!id">Create Role</span>
            <span v-if="id">Update Role</span>
            <div className="header-actions">
                <a-button type="primary">
                    <router-link :to="{ name: 'roles' }">
                        Back
                    </router-link>
                </a-button>
                <a-button v-if="!id" type="primary" @click="onCreate">Add</a-button>
                <a-button v-if="id" type="primary" @click="onUpdate">Update</a-button>
            </div>
        </div>

        <div class="section">
            <a-form ref="formRef" :model="formState" layout="vertical" name="dynamic_rule">
                <a-form-item label="Name:" name="name" :rules="[{ required: true, message: 'Please input role name' }]">
                    <a-input v-model:value="formState.name" />
                </a-form-item>
                <a-tree v-model:selectedKeys="selectedKeys" v-model:checkedKeys="checkedKeys" checkable
                    :tree-data="treeData">
                    <!-- <template #title="{ title, key }">
                        <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
                        <template v-else>{{ title }}</template>
                    </template> -->
                </a-tree>
            </a-form>

        </div>
    </div>
</template>


<style lang="scss">
.ant-input {
    height: 44px;
    width: 100%;
    line-height: 42px;
}
</style>