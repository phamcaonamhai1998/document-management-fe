<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useMenu } from '../../stores/use-menu';
import '../../styles/_variables.scss';
import { notification, type FormInstance } from 'ant-design-vue';
import axios from 'axios';
import { SERVER_RESOURCE } from '../../constants/index.constant';
import type { NOrganization } from '../../interface/organization';
import { useRoute } from 'vue-router';
import type { NDepartment } from '../../interface/department';
import router from '../../router';

export default defineComponent({
    components: {
    },
    setup() {
        const store = useMenu();
        store.onSelectedKeys(["departments"]);
        const route = useRoute();
        const id: string = route.params.id as string;
        const organizations = ref<NOrganization.IOrganization[]>([]);
        const formRef = ref<FormInstance>();
        const formState = reactive<NDepartment.FormStateDepartmentDto>({
            name: '',
            email: '',
            phone: '',
            organizationId: ''
        });


        onMounted(() => {
            axios.get(`${SERVER_RESOURCE}/organization`)
                .then((res) => {
                    if (res.data) {
                        organizations.value = res.data;
                    }
                }).catch((err) => {
                    console.error(err);
                    notification.error({
                        message: 'Can not get organization',
                        type: 'error'
                    });
                })
        })

        onMounted(() => {
            if (id) {
                getById(id);
            }
        })

        const getById = async (id: string) => {
            await axios.get(
                `${SERVER_RESOURCE}/department/${id}`
            ).then((res) => {
                if (res.data) {
                    formState.name = res.data.name;
                    formState.phone = res.data.phone;
                    formState.email = res.data.email;
                }
            })
                .catch((error) => {
                    notification.error({
                        message: `An error has occurred`,
                        type: 'error'
                    });
                    console.log(error);
                });
        }

        const onCreate = async () => {
            try {
                const values = await formRef.value?.validateFields();
                if (values) {
                    createDep(values as NDepartment.ICreateDepartmentRequest);
                }
            } catch (errorInfo) {
                console.log('Failed:', errorInfo);
            }
        };

        const createDep = (depDto: NDepartment.ICreateDepartmentRequest) => {
            axios.post(`${SERVER_RESOURCE}/department`, depDto)
                .then((res) => {
                    if (res) {
                        notification.success({
                            message: 'Create successfully',
                            type: 'success'
                        });
                        router.push('/departments')
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


        const onUpdate = async () => {
            try {
                const values = await formRef.value?.validateFields();
                if (values) {
                    updateDep(values as NDepartment.IUpdateDepartmentRequest);
                }
            } catch (err) {
                console.log('Failed:', err);
            }
        };


        const updateDep = (orgUpdateDto: NDepartment.IUpdateDepartmentRequest) => {
            axios.put(`${SERVER_RESOURCE}/department/${id}`, orgUpdateDto)
                .then((res) => {
                    if (res) {
                        notification.success({
                            message: 'Update successfully',
                            type: 'success'
                        });
                        router.push('/departments')
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

        return {
            id,
            formState,
            formRef,
            onCreate,
            onUpdate,
            organizations,
        };
    },
});

</script>


<template>
    <div class="block-container">
        <div class="block-heading">
            <span>Create Department</span>
            <div className="header-actions">
                <a-button type="primary">
                    <router-link :to="{ name: 'departments' }">
                        Back
                    </router-link>
                </a-button>
                <a-button v-if="!id" type="primary" @click="onCreate">Add</a-button>
                <a-button v-if="id" type="primary" @click="onUpdate">Update</a-button>
            </div>
        </div>

        <div class="section">
            <a-form ref="formRef" :model="formState" layout="vertical" name="dynamic_rule">
                <a-row :gutter="16">
                    <a-col class="gutter-row" :span="16">
                        <div class="gutter-box">
                            <teamplate v-if="!id">
                                <a-form-item label="Organization:" name="organizationId"
                                    :rules="[{ required: true, message: 'Please select organization', trigger: 'change' }]">
                                    <a-select :allowClear="true" v-model:value="formState.organizationId" show-search
                                        placeholder="Select role" style="width: 300px" :filter-option="null">

                                        <a-select-option v-for="org in organizations" :key="org.id" :value="org.id">
                                            {{ org.name }}
                                        </a-select-option>

                                    </a-select>
                                </a-form-item>
                            </teamplate>

                            <a-form-item label="Department name:" name="name"
                                :rules="[{ required: true, message: 'Please input organization name' }]">
                                <a-input v-model:value="formState.name" />
                            </a-form-item>

                            <a-form-item label="Phone Number:" name="phone"
                                :rules="[{ required: true, message: 'Please input phone number' },]">
                                <a-input v-model:value="formState.phone" />
                            </a-form-item>

                            <a-form-item label="Email:" name="email"
                                :rules="[{ required: true, message: 'Please input organization email' }, { type: 'email' }]">
                                <a-input v-model:value="formState.email" />
                            </a-form-item>

                        </div>
                    </a-col>
                </a-row>

            </a-form>
        </div>

    </div>
</template>

<style lang="scss"></style>