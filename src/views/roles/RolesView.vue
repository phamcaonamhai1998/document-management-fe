
<script lang="ts">
import { notification, type MenuProps, type TableProps } from 'ant-design-vue';
import { usePagination } from 'vue-request';
import { computed, defineComponent, ref } from 'vue';
import axios from 'axios';
import { useMenu } from '../../stores/use-menu';
import type { IApi } from '../../interface/api-param';
import CreateRoleDetail from './CreateRoleDetail.vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { NRole } from '../../interface/role';
import { SERVER_RESOURCE } from '../../constants/index.constant';
import router from '../../router';

const columns = [
    {
        title: '#',
        key: 'index',
        width: '10%',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        width: '80%',
    },
    {
        title: '',
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
        CreateRoleDetail,
        PlusOutlined,
    },

    setup() {
        const store = useMenu();
        store.onSelectedKeys(["roles"]);
        const visibleDrawer = ref<boolean>(false);

        const { data: dataSource, run, loading, current, pageSize, } = usePagination(queryData, {
            pagination: {
                currentKey: "page",
                pageSizeKey: "results",
            },
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
                // router.push(`roles/edit/${role.id}`)
            } else if (event.key === 'delete') {
                remove(role.id)
            }
        };

        const remove = async (id: string) => {
            await axios.delete(`${SERVER_RESOURCE}/role/${id}`).then((res) => {
                if (res) {
                    notification.success({
                        message: 'Delete successfully',
                        type: 'success'
                    });
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
            visibleDrawer,
            dataSource,
            pagination,
            loading,
            columns,
            handleTableChange,
            handleMenuClick,
            showDrawer,
            emitCloseDrawer,
        };
    },
});
</script>

<template>
    <div className="list-header">
        <a-button type="primary" @click="showDrawer">
            <PlusOutlined />
            <span>Create Role</span>
        </a-button>
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
                                        <a-menu-item key="edit">
                                            Edit
                                        </a-menu-item>
                                        <a-menu-item key="delete">
                                            Delete
                                        </a-menu-item>
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


    <CreateRoleDetail :visibleDrawer="visibleDrawer" :emitCloseDrawer="emitCloseDrawer" />
</template>