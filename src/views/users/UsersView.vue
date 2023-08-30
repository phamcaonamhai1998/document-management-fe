<script lang="ts">
import { notification, type MenuProps, type TableProps } from 'ant-design-vue';
import { usePagination } from 'vue-request';
import { computed, defineComponent } from 'vue';
import axios from 'axios';
import { useMenu } from '../../stores/use-menu';
import type { IApi } from '../../interface/api-param';
import CreateButton from '../../components/create-button/CreateButton.vue';
import router from '../../router';
import { SERVER_RESOURCE } from '../../constants/index.constant';
import type { NUser } from '../../interface/user';

const columns = [
  {
    title: 'Number',
    key: 'index',
    width: '10%',
  },
  {
    title: 'Full name',
    key: 'name',
    width: '20%',
    sorter: (a: NUser.IUser, b: NUser.IUser) => a.firstName.localeCompare(b.firstName),
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
    title: 'Status',
    dataIndex: 'isActive',
    filters: [
      { text: 'Active', value: true },
      { text: 'Inactive', value: false },
    ],
    onFilter: (value: boolean, record: NUser.IUser) => record.isActive === value
  },
  {
    title: 'Role',
    key: 'role',
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    width: 100,
  },
];

const queryData = (params: IApi.APIParams) => {
  return axios.get<NUser.IUser[]>(`${SERVER_RESOURCE}/user`, { params });
};

export default defineComponent({
  components: {
    CreateButton,
  },

  setup() {
    const store = useMenu();
    store.onSelectedKeys(["users"]);

    const { data, run, loading, current, pageSize, refreshAsync } = usePagination(queryData, {
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

    const handleMenuClick = (user: NUser.IUser, event: any) => {
      if (event.key === 'edit') {
        router.push(`users/edit/${user?.id}`)
      } else {
        remove(user.id)
      }
    };

    const remove = async (id: string) => {
      await axios.delete(`${SERVER_RESOURCE}/user/${id}`).then((res) => {
        if (res) {
          notification.success({
            message: 'Notification',
            type: 'success'
          });
          refreshAsync()
        }
      }).catch((error) => {
        console.error(error)
        notification.error({
          message: `Error`,
          type: 'error'
        });
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
    <CreateButton createText="Create User" url="users/create"></CreateButton>
  </div>
  <div className="overflow-hidden">
    <div className="list-content table-wrapper">
      <a-table :columns="columns" :data-source="data?.data" :pagination="pagination" :loading="loading"
        :scroll="{ x: 576 }" @change="handleTableChange">
        <template #bodyCell="{ column, index, text }">
          <template v-if="column.key === 'index'">{{ index + 1 }}</template>
          <template v-if="column.key === 'name'">{{ `${text?.firstName} ${text?.lastName}` }}</template>
          <template v-if="column.key === 'role'">{{ `${text.role?.name || ''}` }}</template>

          <template v-if="column.dataIndex === 'isActive'">
            <div v-if="text" className="status-container active">
              <!-- <span className="dot"></span> -->
              <p className="status-text active">Active</p>
            </div>
            <div v-if="!text" class="status-container inactive">
              <p className="status-text inactive">Inactive</p>
            </div>
          </template>
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

<style lang="scss">
.status-container {
  width: fit-content;

  .status-text {
    font-size: 14px;
    line-height: 21px;
    font-weight: 500;
    padding: 6px 16px;
    margin-right: 8px;
    border-radius: 16px;
  }

  .status-text {
    &.active {
      color: #027a48;
      background-color: #ecfdf3;
    }

    &.inactive {
      color: #b54708;
      background-color: #fffaeb
    }
  }
}
</style>
