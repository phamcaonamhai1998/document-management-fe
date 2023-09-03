<script lang="ts">
import { notification, type MenuProps, type TableProps } from 'ant-design-vue';
import { useMenu } from '../../stores/use-menu';
import { usePagination } from 'vue-request';
import type { IApi } from '../../interface/api-param';
import axios from 'axios';
import { computed } from 'vue';
import CreateButton from '../../components/create-button/CreateButton.vue'
import { SERVER_RESOURCE } from '../../constants/index.constant';
import type { NSignature } from '../../interface/signature';


const columns = [
  {
    title: 'Number',
    key: 'index',
    width: '10%',
  },
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    width: '75%',
  },
  {
    title: 'Status',
    key: 'status',
    width: '10%',
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    width: 100,
  },
];

const queryData = (params: IApi.APIParams) => {
  return axios.get<NSignature.ISignature[]>(`${SERVER_RESOURCE}/user/certs`, { params });
};

export default {
  components: {
    CreateButton
  },
  setup() {
    const store = useMenu();
    store.onSelectedKeys(['signatures'])

    const { data: dataSource, run, loading, current, pageSize, refreshAsync } = usePagination(queryData, {
      // formatResult: res => res.data.results,
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

    const handleButtonClick = (e: Event) => {
      console.log('click left button', e);
    };

    const handleMenuClick = (signature: NSignature.ISignature, event: any) => {
      if (event.key === 'set-default') {
        setDefault(signature?.id);
      } else {
        return;
      }
    };

    const setDefault = (id: string) => {
      axios.put(`${SERVER_RESOURCE}/user/certs-default/${id}`)
        .then((res) => {
          if (res) {
            notification.success({
              message: 'Set default signature successfully',
              type: 'success'
            });
            refreshAsync();
          }
        })
        .catch((error) => {
          notification.error({
            message: 'An error has occurred',
            type: 'error'
          });
          console.error(error);
        });
    }

    return {
      dataSource,
      pagination,
      loading,
      columns,
      handleTableChange,
      handleButtonClick,
      handleMenuClick
    };
  }
}
</script>

<template>
  <div className="list-header">
    <CreateButton createText="Create Signature" url="signatures/create"></CreateButton>
  </div>
  <div className="overflow-hidden">
    <div className="list-content table-wrapper">
      <a-table :columns="columns" :data-source="dataSource?.data" :pagination="pagination" :loading="loading"
        :scroll="{ x: 576 }" @change="handleTableChange">
        <template #bodyCell="{ column, index, text }">
          <template v-if="column.key === 'index'">{{ index + 1 }}</template>
          <template v-if="column.key === 'status'">
            <div v-if="text.isDefault" className="status-container active">
              <!-- <span className="dot"></span> -->
              <p className="status-text active">Default</p>
            </div>
            <div v-if="!text.isDefault" class="status-container inactive">
              <p className="status-text inactive">In active</p>
            </div>
          </template>
          <template v-if="column.key === 'action'">
            <div class="dropdown-wrap">
              <a-dropdown-button>
                <template #overlay>
                  <a-menu @click="(event: MenuProps) => handleMenuClick(text, event)">
                    <a-menu-item key="set-default">
                      Set default
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
