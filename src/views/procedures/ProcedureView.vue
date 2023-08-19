<script lang="ts">
import { notification, type MenuProps, type TableProps } from 'ant-design-vue';
import { useMenu } from '../../stores/use-menu';
import { usePagination } from 'vue-request';
import type { IApi } from '../../interface/api-param';
import axios from 'axios';
import { computed, onMounted } from 'vue';
import CreateButton from '../../components/create-button/CreateButton.vue'
import { SERVER_RESOURCE } from '../../constants/index.constant';
import type { NProcedure } from '../../interface/procedure';
import router from '../../router';


const columns = [
    {
        title: 'Number',
        key: 'index',
        width: '10%',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        width: '90%',
    },
    {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        width: 100,
    },
];

const queryData = (params: IApi.APIParams) => {
    return axios.get<NProcedure.IProcedure[]>(`${SERVER_RESOURCE}/procedure`, { params });
};

export default {
    components: {
        CreateButton
    },
    setup() {
        const store = useMenu();
        store.onSelectedKeys(['procedures'])

        const { data: dataSource, run, loading, current, pageSize } = usePagination(queryData, {
            // formatResult: res => res.data.results,
            pagination: {
                currentKey: "page",
                pageSizeKey: "results",
                totalKey: 'data.total'
            },
        });

        const pagination = computed(() => ({
            total: dataSource.value?.data?.length,
            current: current.value,
            pageSize: pageSize.value,
        }));

        const handleTableChange: TableProps["onChange"] = (
            // pagination: { pageSize: number; current: number },
            filters: any, sorter: any) => {
            run({
                results: pageSize,
                page: filters.current,
                sortField: sorter.field,
                sortOrder: sorter.order,
                ...filters,
            });
        };


        const handleMenuClick = (item: NProcedure.IProcedure, event: any) => {
            if (event.key === 'edit') {
                router.push(`procedures/edit/${item.id}`)
            } else if (event.key === 'delete') {
                remove(item.id)
            }
        };

        const remove = async (id: string) => {
            await axios.delete(`${SERVER_RESOURCE}/procedure/${id}`).then((res) => {
                if (res) {
                    notification.success({
                        message: 'Delete successfully',
                        type: 'success'
                    });
                }
            }).catch((error) => {
                notification.error({
                    message: `Error`,
                    type: 'error'
                });
            });;
        }


        return {
            dataSource,
            pagination,
            loading,
            columns,
            handleTableChange,
            handleMenuClick
        };
    }
}
</script>

<template>
    <div className="list-header">
        <CreateButton createText="Create Procedure" url="procedures/create"></CreateButton>
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
</template>

<style lang="scss"></style>
