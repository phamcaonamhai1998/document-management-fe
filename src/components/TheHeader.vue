<script lang="ts">
import { defineComponent } from 'vue';
import { useTitle } from '../stores/use-title';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import type { MenuProps } from 'ant-design-vue';
import { TOKEN_KEY } from '../constants/index.constant';
import jwt_decode from "jwt-decode";
import { UserOutlined, LogoutOutlined } from '@ant-design/icons-vue';

export default defineComponent({
    components: {
        UserOutlined,
        LogoutOutlined
    },
    setup() {
        //store
        const route = useRoute();
        const title = route.name ? route?.name?.toString().charAt(0).toUpperCase() + route.name.toString().slice(1).toString() : "Dashboard";
        const token = localStorage.getItem(TOKEN_KEY)
        const decodeToken: any = token && jwt_decode(token);

        const titleStore = useTitle();
        if (!titleStore.title) {
            titleStore.title = title;
        }

        const handleDropDownClick: MenuProps['onClick'] = e => {
            console.log('click', e.key);
            if (e.key === 'logout') {
                localStorage.removeItem(TOKEN_KEY);
                location.reload();
            }
        };

        return {
            ...storeToRefs(titleStore),
            handleDropDownClick,
            decodeToken
        };
    },
});
</script>




<template>
    <div class="header-container">
        <div class="title-container">
            <h1 class="title-text">{{ title }}</h1>
        </div>
        <div class="avatar-container">
            <a-dropdown-button :open="true" class="avatar-button">
                <template #overlay>
                    <a-menu @click="handleDropDownClick">
                        <a-menu-item key="profile">
                            <UserOutlined />
                            <span class="ml-3">{{ `${decodeToken?.firstName} ${decodeToken?.lastName}` }}</span>
                        </a-menu-item>
                        <a-menu-item key="logout">
                            <logout-outlined />
                            <span class="ml-3">Logout</span>

                        </a-menu-item>
                    </a-menu>
                </template>
                <template #icon>
                    <a-avatar size="large" style="background-color: #f56a00">{{
                        (decodeToken?.firstName).toUpperCase().charAt(0)
                    }}</a-avatar>
                </template>
            </a-dropdown-button>
        </div>
    </div>
</template>
<style lang="scss">
.ant-dropdown-menu-item {
    height: 44px;
    display: flex;
    justify-items: center;

    a,
    .ant-btn {
        width: 100%;
        padding: 0;

    }

    .anticon svg {
        font-size: 18px;
    }

    .ant-dropdown-menu-title-content {
        font-size: 14px;
    }

    .ant-btn {
        border: 0;
        background: transparent;
    }
}

.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    min-height: 72px;
    border-bottom: 1.5px solid #eaecf0;

    .title-container {
        .title-text {
            color: #000;
            font-size: 24px;
            font-weight: 600;
            margin: 0;
        }
    }

    .avatar-container {
        .avatar-button {
            border: none;

            .ant-btn {
                width: 50px;
                height: 50px;
                border: none;
            }
        }
    }
}
</style>