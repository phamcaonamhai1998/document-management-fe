<script lang="ts">
import { notification, type MenuProps, type TableProps } from 'ant-design-vue';
import { usePagination } from 'vue-request';
import { computed, defineComponent, onMounted } from 'vue';
import axios from 'axios';
import { useMenu } from '../../stores/use-menu';
import type { IApi } from '../../interface/api-param';
import CreateButton from '../../components/create-button/CreateButton.vue';
import router from '../../router';
import { SERVER_RESOURCE } from '../../constants/index.constant';
import type { NOrganization } from '../../interface/organization';

const columns = [
    {
        title: 'Number',
        key: 'index',
        width: '10%',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        width: '20%',
        sorter: (a: NOrganization.IOrganization, b: NOrganization.IOrganization) => a.name.localeCompare(b.name),

    },
    {
        title: 'Phone Number',
        dataIndex: 'phone',
        width: '20%',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        width: 100,
    },
];

const queryData = (params: IApi.APIParams) => {
    return axios.get<NOrganization.IOrganization[]>(`${SERVER_RESOURCE}/organization`, { params });
};

export default defineComponent({
    components: {
        CreateButton,
    },

    setup() {
        const store = useMenu();
        store.onSelectedKeys(["organizations"]);

        const { data: data, run, loading, current, pageSize, refresh, refreshAsync } = usePagination(queryData, {
            pagination: {
                currentKey: "page",
                pageSizeKey: "results",
            },
        });

        const pagination = computed(() => ({
            total: data.value?.data.length,
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

        const handleMenuClick = (item: NOrganization.IOrganization, event: any) => {
            if (event.key === 'edit') {
                router.push(`organizations/edit/${item.id}`)
            } else if (event.key === 'delete') {
                remove(item.id)
            }
        };

        const remove = async (id: string) => {
            await axios.delete(`${SERVER_RESOURCE}/organization/${id}`).then((res) => {
                if (res) {
                    notification.success({
                        message: 'Delete successfully',
                        type: 'success'
                    });
                    refreshAsync();
                }
            }).catch((error) => {
                notification.error({
                    message: `Error`,
                    type: 'error'
                });
                console.log(error);
            });;
        }

        return {
            data,
            pagination,
            loading,
            columns,
            handleTableChange,
            handleMenuClick,
        };
    },
});
</script>

<template>
    <div className="list-header">
        <CreateButton createText="Create Organization" url="organizations/create"></CreateButton>
    </div>
    <div className="overflow-hidden">
        <div className="list-content table-wrapper">
            <a-table :columns="columns" :data-source="data?.data" :pagination="pagination" :loading="loading"
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
</template>

<style lang="scss"></style>
