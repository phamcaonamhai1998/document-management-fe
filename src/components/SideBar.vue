<script lang="ts">
import { defineComponent } from 'vue';
import { UserOutlined, FileOutlined, AuditOutlined, AppstoreOutlined, ProfileOutlined, PartitionOutlined, CodeSandboxOutlined, ForkOutlined } from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';
import { useMenu } from '../stores/use-menu';
import { storeToRefs } from 'pinia';
import { useTitle } from '../stores/use-title';
export default defineComponent({
  components: {
    UserOutlined,
    FileOutlined,
    AuditOutlined,
    AppstoreOutlined,
    ProfileOutlined,
    PartitionOutlined,
    CodeSandboxOutlined,
    ForkOutlined
  },
  setup() {
    //store
    const store = useMenu();
    const storeTitle = useTitle();


    const handleClick: MenuProps['onClick'] = e => {
      const title = e.key.toString().charAt(0).toUpperCase() + e.key.toString().slice(1).toString()
      storeTitle.onClickTitle(title);
    };

    return {
      ...storeToRefs(store),
      ...storeToRefs(storeTitle),
      handleClick,
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

    <a-menu-item key="organizations">
      <template #icon>
        <code-sandbox-outlined />
      </template>
      <RouterLink to="/organizations">Organizations</RouterLink>
    </a-menu-item>

    <a-menu-item key="departments">
      <template #icon>
        <fork-outlined />
      </template>
      <RouterLink to="/departments">Departments</RouterLink>
    </a-menu-item>

    <a-menu-item key="procedures">
      <template #icon>
        <partition-outlined />
      </template>
      <RouterLink to="/procedures">Procedures</RouterLink>
    </a-menu-item>

    <a-menu-item key="roles">
      <template #icon>
        <profile-outlined />
      </template>
      <RouterLink to="/roles">Roles</RouterLink>
    </a-menu-item>

    <a-menu-item key="users">
      <template #icon>
        <user-outlined />
      </template>
      <RouterLink to="/users">Users</RouterLink>
    </a-menu-item>

    <a-menu-item key="documents">
      <template #icon>
        <file-outlined />
      </template>
      <RouterLink to="/documents">Documents</RouterLink>
    </a-menu-item>

    <a-menu-item key="signatures">
      <template #icon>
        <audit-outlined />
      </template>
      <RouterLink to="/signatures">Signatures</RouterLink>
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

