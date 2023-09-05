<script lang="ts">
import { usePagination } from 'vue-request';
import { useMenu } from '../../stores/use-menu';
import axios from 'axios';
import type { IApi } from '../../interface/api-param';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { notification, type MenuProps, type TableProps, type FormInstance } from 'ant-design-vue';
import CreateButton from '../../components/create-button/CreateButton.vue'
import type { NDocument } from '../../interface/document';
import { SERVER_RESOURCE, TOKEN_KEY, ADMIN_ID } from '../../constants/index.constant';
import router from '../../router';
import { FolderOpenOutlined, SearchOutlined } from '@ant-design/icons-vue';
import jwt_decode from 'jwt-decode';
import { PERMISSIONS } from '../../constants/permission';
import { DocumentStatusEnum } from '../../enums/document-status.enum';


export default {
  components: {
    CreateButton,
    SearchOutlined,
    FolderOpenOutlined
  },
  setup() {
    const token = localStorage.getItem(TOKEN_KEY)
    const decodeToken: any = token && jwt_decode(token);
    let userRights: string[] = decodeToken?.rights || [];
    const store = useMenu();
    store.onSelectedKeys(['documents']);
    const activeKey = ref<string>();
    const endpointDocument = ref<string>('');
    const filterText = ref<string>('');
    const rejectDocument = ref<NDocument.IDocument | null>();
    const approveDocument = ref<NDocument.IDocument | null>();

    const isVisibleAssignModal = ref<boolean>(false);

    const columns = ref<{ title: string, key?: string, width?: string | number, dataIndex?: string, fixed?: string, filters?: Array<any>, onFilter?: Function, sorter?: Function }[]>([
      {
        title: 'Title',
        dataIndex: 'title',
        width: '20%',
        sorter: (a: NDocument.IDocument, b: NDocument.IDocument) => a.title.localeCompare(b.title),
      },
      {
        title: 'User Name',
        dataIndex: 'userFullName',
      },

      {
        title: 'Organization name',
        dataIndex: 'orgName',
      },

      {
        title: 'Procedure Name',
        dataIndex: 'procedureName',
      },

      {
        title: 'Document Status',
        key: 'status',
        // dataIndex: 'isActive',
        filters: [
          { text: 'Published', value: DocumentStatusEnum.PUBLISHED },
          { text: 'Processing', value: DocumentStatusEnum.PROCESSING },
          { text: 'Rejected', value: DocumentStatusEnum.REJECTED },
        ],
        onFilter: (value: string, record: NDocument.IDocument) => record.status === value
      },

      {
        title: 'Step status',
        key: 'step',

      },

      {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        width: 100,
      },
    ]);

    onMounted(() => {
      if (decodeToken?.id === ADMIN_ID) {
        columns.value = columns.value.filter((item) => item.key !== 'step')
      }
      else {
        columns.value = columns.value.filter((item) => item.dataIndex !== 'orgName')
      }
    })

    const queryData = (params: IApi.APIParams) => {
      params.title = filterText.value;
      return axios.get<NDocument.IDocument[]>(`${SERVER_RESOURCE}/document/${endpointDocument.value}`, { params });
    };

    const { data: dataSource, run, loading, current, pageSize, refreshAsync } = usePagination(queryData, {
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

    const handleMenuClick = (item: NDocument.IDocument, event: any) => {
      switch (event.key) {
        case 'edit':
          router.push(`documents/edit/${item.id}`);
          break;
        case 'delete':
          remove(item.id);
          break;
        case 'approve':
          approveDoc(item);
          break;
        case 'reject':
          // rejectDoc(item);
          showModal(item);
          break;

        default:
          break;
      }
    };




    const remove = async (id: string) => {
      await axios.delete(`${SERVER_RESOURCE}/document/${id}`).then((res) => {
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

    const onChangeTab = (key: string) => {
      endpointDocument.value = key;
      refreshAsync();
    }

    const onSearch = (searchValue: string) => {
      filterText.value = searchValue;
      refreshAsync();
    };

    const isVisibleRejectModal = ref<boolean>(false);
    const showModal = (document: NDocument.IDocument) => {
      isVisibleRejectModal.value = true;
      rejectDocument.value = document;
    };

    const handleOk = async () => {
      try {
        if (rejectDocument.value) {
          rejectDoc(rejectDocument.value);
        }
      } catch (errorInfo) {
        console.log('Failed:', errorInfo);
      }
    };

    const reason = ref<string>('');

    const rejectDoc = async (document: NDocument.IDocument) => {
      const rejectDocDto = {
        procedureStepId: document?.step?.id,
        reason: reason.value
      };

      await axios.put(`${SERVER_RESOURCE}/document/reject/${document?.id}`, rejectDocDto)
        .then((res) => {
          if (res) {
            notification.success({
              message: 'Reject successfully',
              type: 'success'
            });
            refreshAsync();
            isVisibleRejectModal.value = false;
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

    const passwordCert = ref<string | null>('');
    const isSign = ref<boolean>(false);


    const handleCancel = () => {
      rejectDocument.value = null;
      approveDocument.value = null;
    }

    const onAssignSignature = () => {
      approveDocument.value && approveDoc(approveDocument.value);
    }


    const approveDoc = async (document: NDocument.IDocument) => {
      const approveDocDto = {
        procedureStepId: document?.step?.id,
        isSign: isSign.value,
        signaturePassword: passwordCert.value || null
      };

      axios.put(`${SERVER_RESOURCE}/document/approve/${document?.id}`, approveDocDto)
        .then((res) => {
          if (res) {
            notification.success({
              message: 'Approve document successfully',
              type: 'success'
            });
            refreshAsync();
          }
        })
        .catch((error) => {
          let titleError: string = '';
          switch (error.response?.data?.message) {
            case 'password_of_signature_is_invalid':
              titleError = 'Password of signature is invalid';
              break;
            default:
              titleError = 'An error has occurred';
              break;
          }

          notification.error({
            message: titleError,
            type: 'error'
          });
          console.error(error);
        });
    }

    const confirmSign = (document: NDocument.IDocument) => {
      approveDocument.value = document;
      isSign.value = true;
      isVisibleAssignModal.value = true;
    }

    const cancelSign = (document: NDocument.IDocument) => {
      isSign.value = false;
      passwordCert.value = null;
      approveDoc(document);
    }



    return {
      DocumentStatusEnum,
      decodeToken,
      activeKey,
      dataSource,
      pagination,
      loading,
      columns,
      ADMIN_ID,
      PERMISSIONS,
      userRights,
      isVisibleRejectModal,
      reason,
      onChangeTab,
      handleTableChange,
      handleMenuClick,
      onSearch,
      handleOk,
      handleCancel,
      onAssignSignature,
      isVisibleAssignModal,
      confirmSign,
      cancelSign,
      passwordCert
    };
  }
}
</script>

<template>
  <a-modal v-model:visible="isVisibleRejectModal" title="Reason" @ok="handleOk" :onCancel="handleCancel">
    <a-textarea v-model:value="reason" placeholder="Please in the reason" :rows="4" />
  </a-modal>

  <a-modal v-model:visible="isVisibleAssignModal" title="Assign Signature" @ok="onAssignSignature"
    :onCancel="handleCancel">
    <a-input-password v-model:value="passwordCert" placeholder="Please input password signature" />
  </a-modal>

  <div v-if="decodeToken?.id !== ADMIN_ID && (userRights || []).includes(PERMISSIONS.DOCUMENT_CREATE)"
    className="list-header">
    <CreateButton createText="Create Document" url="documents/create"></CreateButton>
  </div>

  <div className="overflow-hidden">
    <div className="list-content table-wrapper">
      <a-tabs v-model:activeKey="activeKey" :onChange="onChangeTab">
        <a-tab-pane key="" tab="Document"></a-tab-pane>
        <template v-if="decodeToken?.id !== ADMIN_ID && (userRights || []).includes(PERMISSIONS.DOCUMENT_APPROVE)">
          <a-tab-pane key="assigned" tab="Assigned document"></a-tab-pane>
          <a-tab-pane key="rejected" tab="Rejected document"></a-tab-pane>
        </template>
      </a-tabs>

      <a-row className="mt-2 mb-6">
        <a-col :span="6">
          <a-input-search @search="onSearch" allow-clear>
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input-search>
        </a-col>
      </a-row>


      <a-table :columns="columns" :data-source="dataSource?.data || []" :pagination="pagination" :loading="loading"
        :scroll="{ x: 576 }" @change="handleTableChange">
        <template #bodyCell="{ column, index, text }">
          <template v-if="column?.key === 'index'">{{ index + 1 }}</template>
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
          <template v-if="column?.key === 'step'">
            <div v-if="text?.step?.status === 'approved'" className="status-container active">
              <!-- <span className="dot"></span> -->
              <p className="status-text active">Approved</p>
            </div>
            <div v-if="text?.step?.status === 'processing'" class="status-container inactive">
              <p className="status-text inactive">Processing</p>
            </div>
            <div v-if="text?.step?.status === 'rejected'" class="status-container rejected">
              <p className="status-text rejected">Rejected</p>
            </div>

          </template>


          <template v-if="column?.key === 'action'">
            <div class="dropdown-wrap">
              <a-dropdown-button :open="true">
                <template #overlay>
                  <a-menu @click="(event: MenuProps) => handleMenuClick(text, event)">
                    <template v-if="!activeKey">
                      <a-menu-item v-if="(userRights || []).includes(PERMISSIONS.DOCUMENT_UPDATE)" key="edit">
                        Edit
                      </a-menu-item>
                      <a-menu-item v-if="(userRights || []).includes(PERMISSIONS.DOCUMENT_DELETE)" key="delete">
                        Delete
                      </a-menu-item>
                    </template>

                    <!-- <template v-if="activeKey === 'assigned'"> -->
                    <template v-if="text?.status === DocumentStatusEnum.PROCESSING && activeKey === 'assigned'">
                      <a-menu-item v-if="(userRights || []).includes(PERMISSIONS.DOCUMENT_APPROVE)">
                        <!-- Approve -->
                        <a-popconfirm title="Options approve" @confirm="confirmSign(text)" @cancel="cancelSign(text)"
                          okText="Approve with signature" cancelText="Approval without signature">
                          Approve
                        </a-popconfirm>
                      </a-menu-item>
                      <!-- </template> -->

                      <!-- <template v-if="activeKey === 'assigned'"> -->
                      <a-menu-item v-if="(userRights || []).includes(PERMISSIONS.DOCUMENT_APPROVE)" key="reject">
                        Reject
                      </a-menu-item>
                    </template>


                    <a-menu-item :href="text.path" key="view">
                      <a :href="text?.path" target="_blank" className="document-content w-fit flex items-center bg-none">
                        <folder-open-outlined />
                        <span className="ml-2">View</span>
                      </a>
                    </a-menu-item>

                    <!-- </template> -->
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
.ant-input-search {
  border: 1px solid #d0d5dd;
  color: #a7adb2;
  font-size: 14px;
  font-weight: 400;
  line-height: 26px;

  .ant-input-affix-wrapper:hover {
    border: unset;
  }

  .ant-input-group {}

  .ant-input-search-button {
    display: none;
  }
}


.document-content {
  :hover {
    color: unset;
    background-color: unset;
  }
}

.ant-popover-buttons {
  display: flex;
}
</style>