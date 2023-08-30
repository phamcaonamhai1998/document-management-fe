<script lang="ts">
import jwt_decode from 'jwt-decode';
import { useMenu } from '../../stores/use-menu';
import { TOKEN_KEY } from '../../constants/index.constant';


export default {
    setup() {
        const store = useMenu();
        store.onSelectedKeys(['dashboard']);
        const token = localStorage.getItem(TOKEN_KEY)
        const decodeToken: any = token && jwt_decode(token);

        return {
            decodeToken
        }
    }
}
</script>

<template>
    <div className="introduce-container">
        <a-row>
            <a-col :span="12">
                <div className="h-full welcome-col h-full flex items-center">
                    <div>
                        <h1 className="welcome-text">
                            Welcome {{ `${decodeToken?.firstName || ''} ${decodeToken?.lastName || ''}` }}
                        </h1>
                        <p className="description-text">
                            Document Management Website with Digital Signature
                        </p>
                    </div>
                </div>
            </a-col>
            <a-col :span="12">
                <div className="h-full image-col flex justify-end">
                    <a-image className="banner-dashboard" src="/images/dashboard-background.png" :preview="false" />
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<style lang="scss">
.introduce-container {
    border: 1px solid #e9eaec;
    border-radius: 16px;

    .welcome-col {
        padding-left: 32px;
        padding-right: 32px;

        .welcome-text {
            color: #22313f;
            font-size: 40px;
            line-height: 52px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .description-text {
            color: #7a838c;
            font-size: 16px;
            line-height: 24px;
            font-weight: 400;
        }
    }

    .image-col {
        position: relative;

        .ant-image {
            .ant-image-img {
                border-radius: 16px;
            }
        }
    }
}
</style>

