<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useMenu } from '../../stores/use-menu';
import '../../styles/_variables.scss';
import { notification, type FormInstance, type UploadProps, message, type UploadChangeParam } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { RcFile } from 'ant-design-vue/lib/vc-upload/interface';
import axios from 'axios';
import { SERVER_RESOURCE } from '../../constants/index.constant';
import type { NProcedure } from '../../interface/procedure';
import type { NDocument } from '../../interface/document';

export default defineComponent({
    components: {
        UploadOutlined
    },
    setup() {

        const fileList = ref<UploadProps['fileList']>([]);
        const approveId = ref<string | undefined>(undefined);
        const procedures = ref<NProcedure.IProcedure[]>([]);
        // const driveDocId = ref<string>('')

        onMounted(() => {
            axios.get(`${SERVER_RESOURCE}/procedure`)
                .then((res) => {
                    if (res.data) {
                        procedures.value = res.data;
                    }
                }).catch((err) => {
                    console.error(err);
                    notification.error({
                        message: 'Can not get procedure',
                        type: 'error'
                    });
                })
        })

        const store = useMenu();
        store.onSelectedKeys(["documents"]);

        const formRef = ref<FormInstance>();
        const formState = reactive<NDocument.FormStateDocumentDto>({
            procedureId: null,
            title: null,
            description: null,
            driveDocId: null
        });


        const filterOption = (input: string, option: any) => {
            return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        };

        const beforeUpload: UploadProps['beforeUpload'] = (file: RcFile) => {
            const isPDFType = file.type === 'application/pdf';
            if (!isPDFType) {
                notification.error({
                    message: 'You can only upload PDF file',
                    type: 'error'
                });
            }

            const isLt2M = file.size / 1024 / 1024 < 100;
            if (!isLt2M) {
                message.error('Image must smaller than 100MB!');
            }
            const validateFile = isPDFType && isLt2M;
            return validateFile;
        };

        const handleChange = ({ file }: UploadChangeParam) => {
            console.log("File", file)
            if (file.status === 'done' && file?.response) {
                // console.log("File", file)
                // driveDocId.value = file?.response;
                formState.driveDocId = file?.response;
            }
        };

        const onCreate = async () => {
            try {
                const values = await formRef.value?.validateFields();
                console.log("values", values)
                if (values) {
                    createDocument(values as NDocument.ICreateDocumentRequest);
                }
            } catch (errorInfo) {
                console.log('Failed:', errorInfo);
            }
        };

        const createDocument = async (data: NDocument.ICreateDocumentRequest) => {

            axios.post(`${SERVER_RESOURCE}/document`, data)
                .then((res) => {
                    if (res) {
                        notification.success({
                            message: 'Create successfully',
                            type: 'success'
                        });
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



        return {
            formState,
            formRef,
            approveId,
            procedures,
            fileList,
            onCreate,
            filterOption,
            beforeUpload,
            handleChange,
        };


    },
});

</script>

<template>
    <div class="block-container">
        <div class="block-heading">
            <span>Create Document</span>
            <div className="header-actions">
                <a-button type="primary">
                    <router-link :to="{ name: 'documents' }">
                        Back
                    </router-link>
                </a-button>
                <a-button type="primary" @click="onCreate">Add new</a-button>
            </div>
        </div>

        <div class="section">
            <a-form ref="formRef" :model="formState" layout="vertical" name="dynamic_rule">
                <a-form-item label="Document:" name="driveDocId"
                    :rules="[{ required: true, message: 'Please upload file' }]">
                    <a-upload action="https://localhost:7138/document/upload" :before-upload="beforeUpload"
                        v-model:file-list="fileList" :max-count="1" @change="handleChange">
                        <a-button type="primary">
                            <UploadOutlined />
                            Upload
                        </a-button>
                    </a-upload>
                </a-form-item>

                <a-form-item label="Procedure:" name="procedureId"
                    :rules="[{ required: true, message: 'Please select procedure', trigger: 'change' }]">
                    <a-select v-model:value="formState.procedureId" show-search allowClear placeholder="Select procedure"
                        style="width: 300px" :filter-option="filterOption">
                        <a-select-option v-for="pro in procedures" :key="pro.id" :value="pro.id">
                            {{ pro.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="Document title:" name="title"
                    :rules="[{ required: true, message: 'Please input document title' }]">
                    <a-input placeholder="Input title" v-model:value="formState.title" />
                </a-form-item>


                <a-form-item label="Description:" name="description">
                    <a-textarea placeholder="Description..." v-model:value="formState.description" show-count :rows="3" />
                </a-form-item>

            </a-form>

        </div>
    </div>
</template>

<style lang="scss"></style>