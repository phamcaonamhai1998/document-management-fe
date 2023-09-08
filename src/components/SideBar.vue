<script lang="ts">
import { defineComponent } from 'vue';
import { UserOutlined, FileOutlined, AuditOutlined, AppstoreOutlined, ProfileOutlined, PartitionOutlined, CodeSandboxOutlined, ForkOutlined,FileProtectOutlined } from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';
import { useMenu } from '../stores/use-menu';
import { storeToRefs } from 'pinia';
import { useTitle } from '../stores/use-title';
import { TOKEN_KEY, ADMIN_ID } from '../constants/index.constant';
import jwt_decode from 'jwt-decode';
import { PERMISSIONS } from '../constants/permission'

export default defineComponent({
  components: {
    UserOutlined,
    FileOutlined,
    AuditOutlined,
    AppstoreOutlined,
    ProfileOutlined,
    PartitionOutlined,
    CodeSandboxOutlined,
    ForkOutlined,
    FileProtectOutlined,
  },
  setup() {
    //store
    const store = useMenu();
    const storeTitle = useTitle();
    const token = localStorage.getItem(TOKEN_KEY);
    const decodeToken: any = token && jwt_decode(token);
    const userRights: string[] = decodeToken?.rights || [];
    if (userRights?.length) {
      console.log("userRights", userRights);
    }
    if (decodeToken) {
      console.log("Claims", decodeToken);
    }
    if (decodeToken?.org) {
      console.log("Organization", JSON.parse(decodeToken?.org));
    }
    if (decodeToken?.department) {
      console.log("Department", JSON.parse(decodeToken?.department));
    }

    const handleClick: MenuProps['onClick'] = e => {
      const title = e.key.toString()?.charAt(0)?.toUpperCase() + e.key.toString().slice(1).toString()
      storeTitle.onClickTitle(title);
    };

    return {
      ...storeToRefs(store),
      ...storeToRefs(storeTitle),
      handleClick,
      userRights,
      PERMISSIONS,
      decodeToken,
      ADMIN_ID
    };
  },
});
</script>

<template>
  <a-menu id="sider-bar" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline"
    @click="handleClick">
    <a-menu-item key="dashboard">
      <template #icon>
        <appstore-outlined />
      </template>
      <RouterLink to="/">Dashboard</RouterLink>
    </a-menu-item>

    <a-menu-item v-if="(userRights || []).includes(PERMISSIONS.ORGANIZATION_LIST)" key="organizations">
      <template #icon>
        <code-sandbox-outlined />
      </template>
      <RouterLink to="/organizations">Organizations</RouterLink>
    </a-menu-item>

    <a-menu-item v-if="(userRights || []).includes(PERMISSIONS.DEPARTMENT_LIST)" key="departments">
      <template #icon>
        <fork-outlined />
      </template>
      <RouterLink to="/departments">Departments</RouterLink>
    </a-menu-item>

    <a-menu-item v-if="(userRights || []).includes(PERMISSIONS.ROLE_LIST) && decodeToken?.id !== ADMIN_ID" key="roles">
      <template #icon>
        <profile-outlined />
      </template>
      <RouterLink to="/roles">Roles</RouterLink>
    </a-menu-item>

    <a-menu-item v-if="(userRights || []).includes(PERMISSIONS.USER_LIST)" key="users">
      <template #icon>
        <user-outlined />
      </template>
      <RouterLink to="/users">Users</RouterLink>
    </a-menu-item>

    <a-menu-item v-if="(userRights || []).includes(PERMISSIONS.PROCEDURE_LIST) && decodeToken?.id !== ADMIN_ID"
      key="procedures">
      <template #icon>
        <partition-outlined />
      </template>
      <RouterLink to="/procedures">Procedures</RouterLink>
    </a-menu-item>

    <a-menu-item v-if="(userRights || []).includes(PERMISSIONS.DOCUMENT_LIST)" key="documents">
      <template #icon>
        <file-outlined />
      </template>
      <RouterLink to="/documents">Documents</RouterLink>
    </a-menu-item>

    <a-menu-item v-if="decodeToken?.id !== ADMIN_ID" key="signatures">
      <template #icon>
        <audit-outlined />
      </template>
      <RouterLink to="/signatures">Digital signatures</RouterLink>
    </a-menu-item>

    <a-menu-item key="public-documents">
      <template #icon>
        <FileProtectOutlined />
      </template>
      <RouterLink to="/public-documents">Public Document</RouterLink>
    </a-menu-item>
  </a-menu>
</template>

<style lang="scss">
.ant-menu {
  width: 100% !important;
  height: 100%;
  padding: 0 16px;

  ::after {
    opacity: 0 !important;
  }

  .ant-menu-item {
    border-radius: 6px;
    font-size: 16px;

    &:hover {
      background-color: #E6F7FA !important;
    }

    .anticon svg {
      font-size: 18px;
    }

    a {
      color: #344054 !important;

      &:hover {
        background-color: unset;
      }
    }

    .ant-menu-submenu-arrow {
      color: #344054;
    }

    .ant-menu-title-content {
      a {
        font-weight: 500;
      }
    }
  }
}
</style>

