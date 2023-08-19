<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useMenu } from '../../stores/use-menu';
import '../../styles/_variables.scss';
import { notification, type FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/lib/form/interface';
import axios from 'axios';
import { useRoute } from 'vue-router';
import type { NUser } from '../../interface/user';
import type { NOrganization } from '../../interface/organization';
import type { NDepartment } from '../../interface/department';
import { SERVER_RESOURCE } from '../../constants/index.constant';
import type { NRole } from '../../interface/role';


export default defineComponent({
    // components: {
    //     PlusOutlined,
    // },
    setup() {
        const store = useMenu();
        store.onSelectedKeys(["users"]);
        const roles = ref<NRole.IRole[]>([]);
        const organizations = ref<NOrganization.IOrganization[]>([]);
        const departments = ref<NDepartment.IDepartment[]>([]);

        const formRef = ref<FormInstance>();
        const formState = reactive<NUser.FormStateUserDto>({
            isActive: false,
            roleId: null,
            orgId: null,
            departmentId: null,
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            password: '',
            confirmPassword: '',

        });

        const route = useRoute();
        const id: string = route.params.id as string;

        onMounted(() => {
            if (id) {
                getById(id);
            }
        })

        const getById = async (id: string) => {
            await axios.get(
                `https://localhost:7138/user/${id}`
            ).then((res) => {
                if (res.data) {
                    formState.isActive = res.data.isActive
                    formState.firstName = res.data.firstName;
                    formState.lastName = res.data.lastName;
                    formState.phone = res.data.phone;
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

        onMounted(() => {
            axios.get(`${SERVER_RESOURCE}/role/all`)
                .then((res) => {
                    if (res.data) {
                        roles.value = res.data;
                    }
                }).catch((err) => {
                    console.error(err);
                    notification.error({
                        message: 'Can not get roles',
                        type: 'error'
                    });
                })

            axios.get(`${SERVER_RESOURCE}/organization`)
                .then((res) => {
                    if (res.data) {
                        organizations.value = res.data;
                    }
                }).catch((err) => {
                    console.error(err);
                    notification.error({
                        message: 'Can not get organizations',
                        type: 'error'
                    });
                })

            axios.get(`${SERVER_RESOURCE}/department`)
                .then((res) => {
                    if (res.data) {
                        departments.value = res.data;
                    } else
                        return departments.value = [];
                }).catch((err) => {
                    console.error(err);
                    notification.error({
                        message: 'Can not get departments',
                        type: 'error'
                    });
                })
        })




        const onSubmit = async () => {
            try {
                const values: NUser.ICreateUserRequest = await formRef.value?.validateFields() as NUser.ICreateUserRequest;
                createUser(values);
            } catch (errorInfo) {
                console.log('Failed:', errorInfo);
            }
        };


        const createUser = (userDto: NUser.ICreateUserRequest) => {
            axios.post('https://localhost:7138/user', userDto)
                .then((res) => {
                    if (res) {
                        notification.success({
                            message: 'Create successfully',
                            type: 'success'
                        });
                    }
                })
                .catch((error) => {
                    let titleError: string = '';
                    if (error.response?.data?.message === "user_email_is_existed") {
                        titleError = 'User email is existed';
                    }
                    else {
                        titleError = 'An error has occurred';
                    }
                    console.error(error);
                    notification.error({
                        message: titleError,
                        type: 'error'
                    });
                });
        }

        const onUpdate = async () => {
            try {
                const values = await formRef.value?.validateFields();
                if (values) {
                    updateUser(values as NUser.IUpdateUserRequest);
                }
            } catch (errorInfo) {
                console.log('Failed:', errorInfo);
            }
        }

        const updateUser = (userUpdateDto: NUser.IUpdateUserRequest) => {
            axios.put(`https://localhost:7138/user/${id}`, userUpdateDto)
                .then((res) => {
                    if (res) {
                        notification.success({
                            message: 'Update successfully',
                            type: 'success'
                        });
                    }
                })
                .catch((error) => {
                    console.error(error);
                    let titleError: string = '';
                    if (error.message === "user_email_is_existed") {
                        titleError = 'User email is existed';
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

        const filterOption = (input: string, option: any) => {
            return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        };

        return {
            id,
            roles,
            organizations,
            departments,
            formState,
            formRef,
            onSubmit,
            onUpdate,
            validatePassword,
            filterOption,
        };
    },
});

</script>


<template>
    <div class="block-container">
        <div class="block-heading">
            <span>Create User</span>
            <div className="header-actions">
                <a-button type="primary">
                    <router-link :to="{ name: 'users' }">
                        Back
                    </router-link>
                </a-button>
                <a-button v-if="!id" type="primary" @click="onSubmit">Add</a-button>
                <a-button v-if="id" type="primary" @click="onUpdate">Update</a-button>
            </div>
        </div>

        <div class="section">
            <a-form ref="formRef" :model="formState" layout="vertical" name="dynamic_rule">
                <a-row :gutter="16">
                    <!-- <a-col class="gutter-row" :span="8">
                        <div class="gutter-box flex justify-center">
                            <a-avatar shape="square" :size="300">
                                <template #icon>
                                    <img src="../../assets/avatar-user.png" alt="avatar" />
                                </template>
                            </a-avatar>
                        </div>
                        <div class="add-img-btn m-6 flex justify-center">
                            <a-button type="primary">
                                <PlusOutlined />
                                <span>Chọn ảnh</span>
                            </a-button>
                        </div>
                    </a-col> -->
                    <a-col class="gutter-row" :span="24">
                        <div class="gutter-box">
                            <a-form-item label="Status:" name="isActive">
                                <a-switch v-model:checked="formState.isActive" />
                            </a-form-item>
                            <template v-if="!id">
                                <a-form-item label="Role:" name="roleId"
                                    :rules="[{ required: true, message: 'Please select user role', trigger: 'change' }]">
                                    <a-select :allowClear="true" v-model:value="formState.roleId" show-search
                                        placeholder="Select role" style="width: 400px" :filter-option="filterOption">

                                        <a-select-option v-for="role in roles" :key="role.id" :value="role.id">
                                            {{ role.name }}
                                        </a-select-option>

                                    </a-select>

                                </a-form-item>

                                <a-form-item label="Organization:" name="orgId"
                                    :rules="[{ required: true, message: 'Please select organization', trigger: 'change' }]">
                                    <a-select :allowClear="true" v-model:value="formState.orgId" show-search
                                        placeholder="Select Organization" style="width: 400px"
                                        :filter-option="filterOption">

                                        <a-select-option v-for="org in organizations" :key="org.id" :value="org.id">
                                            {{ org.name }}
                                        </a-select-option>

                                    </a-select>
                                </a-form-item>

                                <a-form-item label="Department:" name="departmentId">
                                    <a-select :allowClear="true" v-model:value="formState.departmentId" show-search
                                        placeholder="Select Department" style="width: 400px" :filter-option="filterOption">

                                        <a-select-option v-for="dep in departments" :key="dep.id" :value="dep.id">
                                            {{ dep.name }}
                                        </a-select-option>

                                    </a-select>
                                </a-form-item>
                                <a-form-item label="Email:" name="email"
                                    :rules="[{ required: true, message: 'Please input user email' }, { type: 'email' }]">
                                    <a-input v-model:value="formState.email" />
                                </a-form-item>
                            </template>

                            <a-form-item label="First Name:" name="firstName"
                                :rules="[{ required: true, message: 'Please input user first name' }]">
                                <a-input v-model:value="formState.firstName" />
                            </a-form-item>
                            <a-form-item label="Last Name:" name="lastName"
                                :rules="[{ required: true, message: 'Please input user last name' }]">
                                <a-input v-model:value="formState.lastName" />
                            </a-form-item>
                            <a-form-item label="Phone Number:" name="phone"
                                :rules="[{ required: true, message: 'Please input user phone number' },]">
                                <a-input v-model:value="formState.phone" />
                            </a-form-item>

                            <template v-if="!id">
                                <a-form-item label="Password:" name="password"
                                    :rules="[{ required: true, message: 'Please input user password' }]">
                                    <a-input-password v-model:value="formState.password" />
                                </a-form-item>
                                <a-form-item label="Confirm Password:" name="confirmPassword"
                                    :rules="[{ validator: validatePassword }]">
                                    <a-input-password v-model:value="formState.confirmPassword" />
                                </a-form-item>
                            </template>
                        </div>
                    </a-col>
                </a-row>

            </a-form>
        </div>

    </div>
</template>

<style lang="scss"></style>