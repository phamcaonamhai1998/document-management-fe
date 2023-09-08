<script lang="ts">
import { type TableProps } from 'ant-design-vue';
import { useMenu } from '../../stores/use-menu';
import { usePagination } from 'vue-request';
import type { IApi } from '../../interface/api-param';
import axios from 'axios';
import { computed, ref } from 'vue';
import CreateButton from '../../components/create-button/CreateButton.vue'
import { SERVER_RESOURCE } from '../../constants/index.constant';
import router from '../../router';
import { type NDocument } from '../../interface/document';
import { DocumentStatusEnum } from '../../enums/document-status.enum';
import { SearchOutlined } from '@ant-design/icons-vue';



const columns = [
    {
        title: 'Title',
        dataIndex: 'title',
        width: '15%',
        sorter: (a: NDocument.IDocument, b: NDocument.IDocument) => a.title.localeCompare(b.title),
    },
    {
        title: 'Author',
        dataIndex: 'userFullName',
        width: '15%',
        sorter: (a: string, b: string) => a.localeCompare(b),
    },
    {
        title: 'Abstract',
        dataIndex: 'description',
    },

    {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        width: 150,
    },
];

export default {
    components: {
        SearchOutlined,
    },
    setup() {
        const store = useMenu();
        store.onSelectedKeys(['public-documents'])
        const filterText = ref<string>('');


        const queryData = (params: IApi.APIParams) => {
            params.filter = filterText.value;
            return axios.get<NDocument.IDocument[]>(`${SERVER_RESOURCE}/document/search`, { params });
        };

        const { data: dataSource, run, loading, current, pageSize, refreshAsync } = usePagination(queryData, {
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

        const viewDetail = (item: NDocument.IDocument) => {
            router.push(`public-documents/detail/${item.id}`)
        }

        const onSearch = (searchValue: string) => {
            filterText.value = searchValue;
            refreshAsync();
        };

        return {
            DocumentStatusEnum,
            dataSource,
            pagination,
            loading,
            columns,
            handleTableChange,
            viewDetail,
            onSearch,
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

            <a-row className="mt-2 mb-6">
                <a-col :span="6">
                    <a-input-search @search="onSearch" allow-clear>
                        <template #prefix>
                            <SearchOutlined />
                        </template>
                    </a-input-search>
                </a-col>
            </a-row>

            <a-table :columns="columns" :data-source="dataSource?.data" :pagination="pagination" :loading="loading"
                :scroll="{ x: 576 }" @change="handleTableChange">
                <template #bodyCell="{ column, index, text }">
                    <template v-if="column.key === 'index'">{{ index + 1 }}</template>

                    <template v-if="column.key === 'action'">
                        <a-button type="primary" @click="viewDetail(text)">View Detail</a-button>
                    </template>

                    <template v-if="column?.key === 'status'">
                        <div v-if="text?.status === DocumentStatusEnum.PUBLISHED" className="status-container active">
                            <p className="status-text active">Published</p>
                        </div>
                        <div v-if="text?.status === DocumentStatusEnum.PROCESSING" class="status-container inactive">
                            <p className="status-text inactive">Processing</p>
                        </div>
                        <div v-if="text?.status === DocumentStatusEnum.REJECTED" class="status-container rejected">
                            <p className="status-text rejected">Rejected</p>
                        </div>
                    </template>
                </template>

            </a-table>
        </div>
    </div>
</template>

<style lang="scss"></style>
