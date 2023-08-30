<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useMenu } from '../../stores/use-menu';
import '../../styles/_variables.scss';
import { notification, type FormInstance, type SelectProps } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/lib/form/interface';
import axios from 'axios';
import { useRoute } from 'vue-router';
import type { NUser } from '../../interface/user';
import type { NOrganization } from '../../interface/organization';
import type { NDepartment } from '../../interface/department';
import { ADMIN_ID, ORG_OWNER_ID, SERVER_RESOURCE, TOKEN_KEY } from '../../constants/index.constant';
import type { NRole } from '../../interface/role';
import router from '../../router';
import jwt_decode from 'jwt-decode';
import type { SelectValue } from 'ant-design-vue/lib/select';


interface getRoleRequest {
    departmentId: string
}


export default defineComponent({

    setup() {
        const store = useMenu();
        store.onSelectedKeys(["users"]);
        const roles = ref<NRole.IRole[]>([]);
        const organizations = ref<NOrganization.IOrganization[]>([]);
        const departments = ref<NDepartment.IDepartment[]>([]);
        const isDisableRole = ref<boolean>(true);
        // const isDisableDep = ref<boolean>(false);
        const token = localStorage.getItem(TOKEN_KEY)
        const decodeToken: any = token && jwt_decode(token);
        const depIdState = ref<string>('');
        // const orgIdState = ref<string>('');


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
        const orgClaim = decodeToken?.org ? JSON.parse(decodeToken?.org) : null;
        const depClaim = decodeToken?.department ? JSON.parse(decodeToken?.department) : null;

        const role = JSON.parse(decodeToken?.role);

        onMounted(() => {
            if (orgClaim && role.Id === ORG_OWNER_ID) {
                getAvailableDepsToCreateOwner(orgClaim.Id);
            }
            if (orgClaim && depClaim) {
                isDisableRole.value = false;
                getRole();
            }
        })

        onMounted(() => {
            if (id) {
                getById(id);
            }
        })

        const getById = async (id: string) => {
            await axios.get(
                `${SERVER_RESOURCE}/user/${id}`
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
            if (decodeToken?.id === ADMIN_ID) {
                axios.get(`${SERVER_RESOURCE}/organization/create-owner`)
                    .then((res) => {
                        if (res.data.length) {
                            organizations.value = res.data;
                        } else {
                            notification.error({
                                message: 'All organizations have owners',
                                type: 'error'
                            });
                        }
                    }).catch((err) => {
                        console.error(err);
                        notification.error({
                            message: 'Can not get organizations',
                            type: 'error'
                        });
                    })
            }
        })

        const getRole = () => {
            const getRoleRequest: getRoleRequest = {
                departmentId: depIdState.value || '',
            }
            axios.get(`${SERVER_RESOURCE}/role/available`, { params: getRoleRequest })
                .then((res) => {
                    if (res.data) {
                        roles.value = res.data;
                        isDisableRole.value = false;
                    }
                }).catch((err) => {
                    console.error(err);
                    notification.error({
                        message: 'Can not get roles',
                        type: 'error'
                    });
                })
        }

        const getAvailableDepsToCreateOwner = (orgId: string) => {
            axios.get(`${SERVER_RESOURCE}/department/create-owner/${orgId}`)
                .then((res) => {
                    if (res.data) {
                        departments.value = res.data;
                        // isDisableDep.value = false;
                    } else
                        return departments.value = [];
                }).catch((err) => {
                    console.error(err);
                    notification.error({
                        message: 'Can not get departments',
                        type: 'error'
                    });
                })
        }

        // const onSelectOrg: SelectProps['onChange'] = (orgId: SelectValue) => {
        //     formState.departmentId = null;
        //     formState.roleId = null;
        //     if (orgId) {
        //         orgIdState.value = orgId.toString();
        //         getRole();
        //         getDep(orgId.toString());
        //     }
        // };

        const onSelectDep: SelectProps['onChange'] = (depId: SelectValue) => {
            formState.roleId = null;
            isDisableRole.value = true;
            if (depId && orgClaim?.Id) {
                isDisableRole.value = false;
                depIdState.value = depId.toString();
                getRole();
            }
        }

        const onSubmit = async () => {
            try {
                const createUserRequest: NUser.ICreateUserRequest = await formRef.value?.validateFields() as NUser.ICreateUserRequest;
                if (decodeToken.id === ADMIN_ID) {
                    createUserRequest.roleId = ORG_OWNER_ID;
                }
                else if (orgClaim) {
                    createUserRequest.orgId = orgClaim.Id;
                }

                if (orgClaim && depClaim) {
                    createUserRequest.orgId = orgClaim.Id
                    createUserRequest.departmentId = depClaim.Id;
                }
                createUser(createUserRequest);
            } catch (errorInfo) {
                console.log('Failed:', errorInfo);
            }
        };


        const createUser = (userDto: NUser.ICreateUserRequest) => {
            axios.post(`${SERVER_RESOURCE}/user`, userDto)
                .then((res) => {
                    if (res) {
                        notification.success({
                            message: 'Create successfully',
                            type: 'success'
                        });
                        router.push('/users');
                    }
                })
                .catch((error) => {
                    let titleError: string = '';
                    switch (error.response?.data?.message) {
                        case 'user_email_is_existed':
                            titleError = 'User email is existed';
                            break;
                        case 'password_is_empty':
                            titleError = 'Password is empty';
                            break;
                        case 'role_is_empty':
                            titleError = 'Role is empty';
                            break;
                        case 'invalid_role':
                            titleError = 'Invalid role';
                            break;
                        case 'org_is_empty':
                            titleError = 'Organization is empty';
                            break;
                        case 'invalid_org':
                            titleError = 'Invalid organization';
                            break;
                        case 'invalid_department':
                            titleError = 'Invalid department';
                            break;
                        default:
                            titleError = 'An error has occurred';
                            break;
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
            axios.put(`${SERVER_RESOURCE}/user/${id}`, userUpdateDto)
                .then((res) => {
                    if (res) {
                        notification.success({
                            message: 'Update successfully',
                            type: 'success'
                        });
                        router.push('/users');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    let titleError: string = '';
                    if (error.response?.data?.message === "payload_is_empty") {
                        titleError = 'Payload is empty';
                    }
                    else if (error.response?.data?.message === "id_is_empty") {
                        titleError = 'Id is empty'
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
            ADMIN_ID,
            depClaim,
            decodeToken,
            roles,
            organizations,
            departments,
            formState,
            formRef,
            isDisableRole,
            // isDisableDep,
            onSubmit,
            onUpdate,
            validatePassword,
            filterOption,
            // onSelectOrg,
            onSelectDep,

        };
    },
});

</script>


<template>
    <div class="block-container">
        <div class="block-heading">
            <span v-if="!id">Create User</span>
            <span v-if="id">Update User</span>
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
                                <template v-if="decodeToken?.id === ADMIN_ID">
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
                                </template>

                                <template v-if="decodeToken?.id !== ADMIN_ID && !depClaim?.Id">
                                    <a-form-item label="Department:" name="departmentId">
                                        <a-select :allowClear="true" v-model:value="formState.departmentId" show-search
                                            placeholder="Select Department" style="width: 400px"
                                            :filter-option="filterOption" @change="onSelectDep">
                                            <a-select-option v-for="dep in departments" :key="dep.id" :value="dep.id">
                                                {{ dep.name }}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </template>

                                <template v-if="decodeToken?.id !== ADMIN_ID">
                                    <a-form-item label="Role:" name="roleId"
                                        :rules="[{ required: true, message: 'Please select user role', trigger: 'change' }]">
                                        <a-select :allowClear="true" v-model:value="formState.roleId" show-search
                                            placeholder="Select role" style="width: 400px" :filter-option="filterOption"
                                            :disabled="isDisableRole">
                                            <a-select-option v-for="role in roles" :key="role.id" :value="role.id">
                                                {{ role.name }}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </template>

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