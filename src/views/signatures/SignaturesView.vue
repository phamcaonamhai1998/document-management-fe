<script lang="ts">
import type { MenuProps, TableProps } from 'ant-design-vue';
import { useMenu } from '../../stores/use-menu';
import { usePagination } from 'vue-request';
import type { IApi } from '../../interface/api-param';
import axios from 'axios';
import { computed } from 'vue';
import CreateButton from '../../components/create-button/CreateButton.vue'


const columns = [
  {
    title: '#',
    key: 'index'
  },
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    width: '20%',
  },
  {
    title: 'Public key',
    dataIndex: 'publicKey',
  },
  {
    title: 'Private key',
    dataIndex: 'privateKey',
  },
  {
    title: '',
    key: 'action',
    fixed: 'right',
    width: 100,
  },
];

const queryData = (params: IApi.APIParams) => {
  return axios.get<IApi.APIResult>('https://randomuser.me/api?noinfo', { params });
};

export default {
  components: {
    CreateButton
  },
  setup() {
    const store = useMenu();
    store.onSelectedKeys(['signatures'])

    const { data: dataSource, run, loading, current, pageSize, } = usePagination(queryData, {
      // formatResult: res => res.data.results,
      pagination: {
        currentKey: "page",
        pageSizeKey: "results",
      },
    });


    const pagination = computed(() => ({
      total: 200,
      current: current.value,
      pageSize: pageSize.value,
    }));

    const handleTableChange: TableProps["onChange"] = (
      // pagination: { pageSize: number; current: number },
      filters: any, sorter: any) => {
      // console.log("filters", filters);
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

    const handleMenuClick = (id: string, event: any) => {
      console.log('click', id);
      console.log("Event Key", event.key);
    };


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
      <a-table :columns="columns" :data-source="dataSource?.data.results" :pagination="pagination" :loading="loading"
        :scroll="{ x: 576 }" @change="handleTableChange">
        <template #bodyCell="{ column, index, text }">
          <template v-if="column.key === 'index'">{{ index + 1 }}</template>
          <template v-if="column.dataIndex === 'name'">{{ text.first }} {{ text.last }}</template>
          <template v-if="column.key === 'action'">
            <div class="dropdown-wrap">
              <a-dropdown-button>
                <template #overlay>
                  <a-menu @click="(event: MenuProps) => handleMenuClick(text.id.value, event)">
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
