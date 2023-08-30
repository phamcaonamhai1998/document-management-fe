
<script lang="ts">
import axios from 'axios';
import { reactive } from 'vue';
import { SERVER_RESOURCE, TOKEN_KEY } from '../../constants/index.constant';
import { notification } from 'ant-design-vue';
import type { AuthParams } from '../../interface/auth';
import router from '../../router';

interface FormStateLogin {
    email: string | null;
    password: string | null;
    isRemember: boolean;
}

export default {
    setup() {
        const formState = reactive<FormStateLogin>({
            email: null,
            password: null,
            isRemember: true,
        });

        const onLogin = (values: AuthParams) => {
            if (values) {
                login(values);
            }
        };

        const login = async (values: AuthParams) => {
            await axios.post(`${SERVER_RESOURCE}/auth/login`, values)
                .then((res) => {
                    if (res.data.accessToken) {
                        localStorage.setItem(TOKEN_KEY, res.data.accessToken);
                        router.push('/')
                    }
                })
                .catch((error) => {
                    let titleError: string = '';
                    if (error.response?.data?.message) {
                        switch (error.response?.data?.message) {
                            case 'user_is_not_found':
                                titleError = 'User is not exist';
                                break;
                            case 'password_is_incorrect':
                                titleError = 'Password is incorrect'
                                break;
                            default:
                                titleError = 'An error has occurred';
                        }
                    }
                    else {
                        titleError = 'An error has occurred';
                    }
                    notification.error({
                        message: titleError,
                        type: 'error'
                    });
                });
        }

        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo);
        };


        return {
            formState,
            onLogin,
            onFinishFailed,
        };
    },
}
</script>

<template>
    <div class="login-container">
        <div class="login-box">
            <a-form :model="formState" name="basic" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" autocomplete="off"
                @finish="onLogin" @finishFailed="onFinishFailed">
                <div class="logo-container flex justify-center">
                    <img alt="Vue logo" class="logo-img" src="@/assets/logo.png" width="125" height="100" />
                </div>
                <a-form-item label="Email" name="email"
                    :rules="[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Email format is incorrect' }]">
                    <a-input placeholder="Email" v-model:value="formState.email" />
                </a-form-item>

                <a-form-item label="Password" name="password"
                    :rules="[{ required: true, message: 'Please input your password!' }]">
                    <a-input-password placeholder="Password" v-model:value="formState.password" />
                </a-form-item>
                <div class="flex justify-between items-center login-bottom">
                    <a-form-item name="isRemember">
                        <a-checkbox v-model:checked="formState.isRemember">Remember me</a-checkbox>
                    </a-form-item>
                    <span>Forgot your password?</span>
                </div>


                <a-form-item>
                    <a-button class="login-button" type="primary" html-type="submit">Login</a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<style lang="scss">
.login-container {
    height: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    justify-items: center;
    background-image: url("src/assets/background-img.jpeg");
    background-size: cover
}

.login-box {
    height: 650px;
    width: 450px;
    margin: auto;
    padding: 24px;

    border-radius: 4px;
    background: #FFFFFF;
    box-shadow: 0px 0px 10px 5px #f0f0f0;

    .login-bottom {
        margin-bottom: 24px;

        .ant-form-item {
            margin-bottom: unset;
        }
    }

    .logo-container {
        border: none;
    }

    .ant-form-item-label>label {
        color: #344054;
        font-weight: 700;
        font-size: 16px;
    }

    .ant-input,
    .ant-select-selector,
    .ant-input-password {
        height: 54px;
        border-radius: 4px;
        background-color: #F4F5F5;
        border: 1px solid #E9EAEC;
        font-weight: 400d;
        font-size: 14px;

        .ant-input {
            height: 100%;
        }
    }

    .login-button {
        margin-left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        border-radius: 4px;
    }
}
</style>

