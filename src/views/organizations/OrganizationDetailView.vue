<script lang="ts">
import { defineComponent, onMounted, onRenderTracked, reactive, ref } from 'vue';
import { useMenu } from '../../stores/use-menu';
import '../../styles/_variables.scss';
import { notification, type FormInstance } from 'ant-design-vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { SERVER_RESOURCE } from '../../constants/index.constant';
import type { NOrganization } from '../../interface/organization';
import router from '../../router';

interface FormOrganizationDto {
    name: string;
    email: string;
    phone: string;

}
export default defineComponent({
    components: {
    },
    setup() {
        const store = useMenu();
        store.onSelectedKeys(["organizations"]);
        const route = useRoute();
        const id: string = route.params.id as string;
        const formRef = ref<FormInstance>();
        const formState = reactive<FormOrganizationDto>({
            name: '',
            email: '',
            phone: '',
        });


        onMounted(() => {
            if (id) {
                getById(id);
            }
        })

        const getById = async (id: string) => {
            await axios.get(
                `${SERVER_RESOURCE}/organization/${id}`
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
                    createOrg(values as NOrganization.ICreateOrganizationRequest);
                }
            } catch (errorInfo) {
                console.log('Failed:', errorInfo);
            }
        };

        const createOrg = async (orgDto: NOrganization.ICreateOrganizationRequest) => {
            axios.post(`${SERVER_RESOURCE}/organization`, orgDto)
                .then((res) => {
                    if (res) {
                        notification.success({
                            message: 'Create successfully',
                            type: 'success'
                        });
                        router.push('/organizations');
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
                    updateOrg(values as NOrganization.IUpdateOrganizationRequest);
                }
            } catch (errorInfo) {
                console.log('Failed:', errorInfo);
            }
        };

        const updateOrg = (orgUpdateDto: NOrganization.IUpdateOrganizationRequest) => {
            axios.put(`${SERVER_RESOURCE}/organization/${id}`, orgUpdateDto)
                .then((res) => {
                    if (res) {
                        notification.success({
                            message: 'Update successfully',
                            type: 'success'
                        });
                        router.push('/organizations')

                    }
                })
                .catch((error) => {
                    notification.error({
                        message: 'An error has occurred',
                        type: 'error'
                    });
                    console.log(error);
                });
        }

        return {
            id,
            formState,
            formRef,
            onCreate,
            onUpdate,
            updateOrg
        };
    },
});

</script>


<template>
    <div class="block-container">
        <div class="block-heading">
            <span v-if="!id">Create Organization</span>
            <span v-if="id">Update Organization</span>
            <div className="header-actions">
                <a-button type="primary">
                    <router-link :to="{ name: 'organizations' }">
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

                            <a-form-item label="Organization name:" name="name"
                                :rules="[{ required: true, message: 'Please input organization name' }]">
                                <a-input placeholder="Input organization name" v-model:value="formState.name" />
                            </a-form-item>

                            <a-form-item label="Phone number:" name="phone"
                                :rules="[{ required: true, message: 'Please input phone number' },]">
                                <a-input placeholder="Input phone number" v-model:value="formState.phone" />
                            </a-form-item>

                            <a-form-item label="Email:" name="email"
                                :rules="[{ required: true, message: 'Please input organization email' }, { type: 'email' }]">
                                <a-input placeholder="Input email" v-model:value="formState.email" />
                            </a-form-item>

                        </div>
                    </a-col>
                </a-row>

            </a-form>
        </div>

    </div>
</template>

<style lang="scss"></style>