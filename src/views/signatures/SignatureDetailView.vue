<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useMenu } from '../../stores/use-menu';
import '../../styles/_variables.scss';
import { notification, type FormInstance, type UploadProps, message, type UploadChangeParam } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { RcFile } from 'ant-design-vue/lib/vc-upload/interface';
import axios from 'axios';
import { SERVER_RESOURCE, TOKEN_KEY } from '../../constants/index.constant';
import { useRoute } from 'vue-router';
import router from '../../router';
import type { NSignature } from '../../interface/signature';
import type { Rule } from 'ant-design-vue/lib/form/interface';
import jwt_decode from 'jwt-decode';



export default defineComponent({
    components: {
        UploadOutlined
    },
    setup() {
        const store = useMenu();
        store.onSelectedKeys(["signatures"]);
        const route = useRoute();
        const id: string = route.params.id as string;

        const fileList = ref<UploadProps['fileList']>([]);

        const token = localStorage.getItem(TOKEN_KEY);
        const decodeToken: any = token && jwt_decode(token);
        const urlAction = `${SERVER_RESOURCE}/user/cert/upload/${decodeToken?.id}`

        const formRef = ref<FormInstance>();
        const formState = reactive<NSignature.FormStateSignatureDto>({
            password: '',
            confirmPassword: '',
            fileId: null
        });

        const beforeUpload: UploadProps['beforeUpload'] = (file: RcFile) => {
            const isPfxType = file.type === 'application/x-pkcs12';
            if (!isPfxType) {
                notification.error({
                    message: 'You can only upload Pfx file',
                    type: 'error'
                });
            }

            const isLt2M = file.size / 1024 / 1024 < 100;
            if (!isLt2M) {
                message.error('Image must smaller than 100MB!');
            }
            const validateFile = isPfxType && isLt2M;
            return validateFile;
        };

        const handleChange = ({ file }: UploadChangeParam) => {
            if (file.status === 'done' && file?.response) {
                formState.fileId = file?.response;
            }
        };

        const onCreate = async () => {
            try {
                const values = await formRef.value?.validateFields();
                if (values) {
                    createCert(values as NSignature.ICreateSignatureRequest);
                }
            } catch (errorInfo) {
                console.log('Failed:', errorInfo);
            }
        };

        const createCert = async (data: NSignature.ICreateSignatureRequest) => {

            axios.post(`${SERVER_RESOURCE}/user/cert`, data)
                .then((res) => {
                    if (res) {
                        notification.success({
                            message: 'Create successfully',
                            type: 'success'
                        });
                        router.push('/signatures')
                    }
                })
                .catch((error) => {
                    console.error(error);
                    notification.error({
                        message: 'An error has occurred',
                        type: 'error'
                    });
                });
        }

        const validatePassword = async (_rule: Rule, value: string) => {
            if (!value) {
                return Promise.reject('Please input the password again');
            } else if (value.length < 6) {
                return Promise.reject('')
            }
            else if (value !== formState.password) {
                return Promise.reject("Two passwords don't match!");
            } else {
                return Promise.resolve();
            }
        };

        return {
            id,
            urlAction,
            formState,
            formRef,
            fileList,
            onCreate,
            beforeUpload,
            handleChange,
            validatePassword,
        };


    },
});

</script>

<template>
    <div class="block-container">
        <div class="block-heading">
            <span>Create Signature</span>
            <div className="header-actions">
                <a-button type="primary">
                    <router-link :to="{ name: 'signatures' }">
                        Back
                    </router-link>
                </a-button>
                <a-button type="primary" @click="onCreate">Create</a-button>
            </div>
        </div>

        <div class="section">
            <a-form ref="formRef" :model="formState" layout="vertical" name="dynamic_rule">
                <a-form-item label="Certificate File:" name="fileId"
                    :rules="[{ required: true, message: 'Please upload file' }]">
                    <a-upload :action="urlAction" :before-upload="beforeUpload" v-model:file-list="fileList" :max-count="1"
                        @change="handleChange">
                        <a-button type="primary">
                            <UploadOutlined />
                            Upload Pfx File
                        </a-button>
                    </a-upload>
                </a-form-item>

                <template v-if="!id">
                    <a-form-item label="Password:" name="password"
                        :rules="[{ required: true, message: 'Please input password for pfx file' }]">
                        <a-input-password v-model:value="formState.password" />
                    </a-form-item>
                    <a-form-item label="Confirm Password:" name="confirmPassword"
                        :rules="[{ validator: validatePassword }]">
                        <a-input-password v-model:value="formState.confirmPassword" />
                    </a-form-item>
                </template>

            </a-form>

        </div>
    </div>
</template>

<style lang="scss"></style>