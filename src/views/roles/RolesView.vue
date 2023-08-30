
<script lang="ts">
import { notification, type MenuProps, type TableProps } from 'ant-design-vue';
import { usePagination } from 'vue-request';
import { computed, defineComponent, ref, watch } from 'vue';
import axios from 'axios';
import { useMenu } from '../../stores/use-menu';
import type { IApi } from '../../interface/api-param';
import type { NRole } from '../../interface/role';
import { DEP_OWNER_ID, SERVER_RESOURCE } from '../../constants/index.constant';
import router from '../../router';
import CreateButton from '../../components/create-button/CreateButton.vue'


const columns = [
    {
        title: 'Number',
        key: 'index',
        width: '10%',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        width: '80%',
        sorter: (a: NRole.IRole, b: NRole.IRole) => a.name.localeCompare(b.name),
    },
    {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        width: '10%',
    },
];

const queryData = (params: IApi.APIParams) => {
    return axios.get<NRole.IRole[]>(`${SERVER_RESOURCE}/role/all`, { params });
};

export default defineComponent({
    components: {
        CreateButton
    },

    setup() {
        const store = useMenu();
        store.onSelectedKeys(["roles"]);
        const visibleDrawer = ref<boolean>(false);
        const roleId = ref<string>('');

        const { data: dataSource, run, loading, current, pageSize, refreshAsync } = usePagination(queryData, {
            pagination: {
                currentKey: "page",
                pageSizeKey: "results",
            },
        });

        watch(roleId, () => {

        });

        const pagination = computed(() => ({
            total: dataSource.value?.data.length,
            current: current.value,
            pageSize: pageSize.value,
        }));

        const handleTableChange: TableProps["onChange"] = (
            filters: any, sorter: any) => {
            run({
                results: pageSize,
                page: filters.current,
                sortField: sorter.field,
                sortOrder: sorter.order,
                ...filters,
            });
        };

        const handleMenuClick = (role: NRole.IRole, event: any) => {
            if (event.key === 'edit') {
                router.push(`roles/edit/${role.id}`)
            } else if (event.key === 'delete') {
                remove(role.id)
            };
        }

        const remove = async (id: string) => {
            await axios.delete(`${SERVER_RESOURCE}/role/${id}`).then((res) => {
                if (res) {
                    notification.success({
                        message: 'Delete successfully',
                        type: 'success'
                    });
                    refreshAsync();
                }
            }).catch((error) => {
                console.error(error);
                notification.error({
                    message: 'An error has occurred',
                    type: 'error'
                });
            });;
        }

        const showDrawer = () => {
            visibleDrawer.value = true;
        };

        const emitCloseDrawer = () => {
            visibleDrawer.value = false;
        }




        return {
            DEP_OWNER_ID,
            roleId,
            visibleDrawer,
            dataSource,
            pagination,
            loading,
            columns,
            handleTableChange,
            handleMenuClick,
            showDrawer,
            emitCloseDrawer,
            refreshAsync,

        };
    },
});
</script>

<template>
    <div className="list-header">
        <CreateButton createText="Create Role" url="roles/create"></CreateButton>
    </div>
    <div className="overflow-hidden">
        <div className="list-content table-wrapper">
            <a-table :columns="columns" :data-source="dataSource?.data" :pagination="pagination" :loading="loading"
                :scroll="{ x: 576 }" @change="handleTableChange">
                <template #bodyCell="{ column, index, text }">
                    <template v-if="column.key === 'index'">{{ index + 1 }}</template>
                    <template v-if="column.key === 'action'">
                        <div class="dropdown-wrap">
                            <a-dropdown-button>
                                <template #overlay>
                                    <a-menu @click="(event: MenuProps) => handleMenuClick(text, event)">
                                        <template v-if="text?.id !== DEP_OWNER_ID">
                                            <a-menu-item key="edit">
                                                Edit
                                            </a-menu-item>
                                            <a-menu-item key="delete">
                                                Delete
                                            </a-menu-item>
                                        </template>
                                    </a-menu>
                                </template>
                                <template #icon>
                                    <img src="@/assets/icons/dots-vertical.svg" alt="more" className="cursor-pointer" />
                                </template>
                            </a-dropdown-button>
                        </div>
                    </template>
                </template>

            </a-table>
        </div>
    </div>


    <!-- <CreateRoleDetail :visibleDrawer="visibleDrawer" :emitCloseDrawer="emitCloseDrawer" :roleId="roleId"
        :refreshAsync="refreshAsync" /> -->
</template>