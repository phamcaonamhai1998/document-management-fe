<!-- eslint-disable vue/require-v-for-key -->
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { useMenu } from '../../stores/use-menu';
import '../../styles/_variables.scss';
import { notification, type TableProps } from 'ant-design-vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { SERVER_RESOURCE } from '../../constants/index.constant';
import type { NDocument } from '../../interface/document';
import type { IApi } from '../../interface/api-param';
import { usePagination } from 'vue-request';
import { DownloadOutlined } from '@ant-design/icons-vue';



interface IDocStep {
    id: string;
    status: string;
    isSigned: boolean;
    docSignedPath: string;
    docSignedId: string;
    procedureId: string;
    documentId: string;
    procedureStepId: string;
    assigner: string;
}

const columns = [
    {
        title: 'Step number',
        key: 'index',
        width: '10%',
    },
    {
        title: 'Approver',
        dataIndex: 'assigner',
    },
    {
        title: 'Step status',
        dataIndex: 'isSigned',
        filters: [
            { text: 'Sign', value: true },
            { text: 'Not Sign', value: false },
        ],
        onFilter: (value: boolean, record: IDocStep) => record.isSigned === value
    },
    {
        title: 'Path',
        key: 'path',
    },
    {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        width: 180,
    },
];

export default defineComponent({
    components: {
        DownloadOutlined
    },
    setup() {
        const store = useMenu();
        store.onSelectedKeys(["organizations"]);
        const route = useRoute();
        const docId: string = route.params.id as string;


        const dataSteps = ref<IDocStep[]>();

        const queryData = (params: IApi.APIParams) => {
            return axios.get<NDocument.IDocument[]>(`${SERVER_RESOURCE}/document/doc-steps/${docId}`, { params });
        };

        const { data: dataSource, run, loading, current, pageSize, refreshAsync } = usePagination(queryData, {
            pagination: {
                currentKey: "page",
                pageSizeKey: "results",
                totalKey: 'data.total'
            },
        });

        const pagination = computed(() => ({
            total: dataSteps,
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

        const checkSign = (text: IDocStep) => {

            const request = {
                docId: docId,
                procedureStepId: text.procedureStepId
            }

            axios.post(`${SERVER_RESOURCE}/document/verify-signature`, request)
                .then((res) => {
                    if (res) {
                        notification.success({
                            message: 'Valid signature',
                            type: 'success'
                        });
                    }
                })
                .catch((error) => {
                    let titleError: string = '';
                    if (error.response?.data?.message) {
                        switch (error.response?.data?.message) {
                            case 'document_was_not_signed':
                                titleError = 'Document was not signed';
                                break;
                            default:
                                titleError = 'An error has occurred';
                        }
                    }
                    else {
                        titleError = 'An error has occurred';
                    }
                    console.error(error);
                    notification.error({
                        message: titleError,
                        type: 'error'
                    });
                });
        }

        return {
            dataSource,
            docId,
            pagination,
            loading,
            dataSteps,
            columns,
            checkSign,
            handleTableChange,
        };
    },
});

</script>


<template>
    <div className="box">
        <div class="block-container">
            <a-table :columns="columns" :data-source="dataSource?.data" :pagination="pagination" :loading="loading"
                :scroll="{ x: 576 }" @change="handleTableChange">
                <template #bodyCell="{ column, index, text }">
                    <template v-if="column.key === 'index'">{{ index + 1 }}</template>
                    <template v-if="column.key === 'path' && text.isSigned">
                        <a-button type="primary" :href="text.docSignedPath">
                            <DownloadOutlined />View
                        </a-button>
                    </template>
                    <template v-if="column.key === 'action'">
                        <a-button type="primary" @click="checkSign(text)">Check Signature</a-button>
                    </template>

                    <template v-if="column.dataIndex === 'isSigned'">
                        <div v-if="text" className="status-container active">
                            <!-- <span className="dot"></span> -->
                            <p className="status-text active">Sign</p>
                        </div>
                        <div v-if="!text" class="status-container inactive">
                            <p className="status-text inactive">Not Sign</p>
                        </div>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<style lang="scss">
.box {
    .block-container {
        padding: 10px;
        margin: 10px 0;
    }
}
</style>