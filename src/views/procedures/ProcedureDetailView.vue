<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useMenu } from '../../stores/use-menu';
import '../../styles/_variables.scss';
import { notification, type FormInstance } from 'ant-design-vue';
import axios from 'axios';
import type { NProcedure } from '../../interface/procedure';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { SERVER_RESOURCE, TOKEN_KEY } from '../../constants/index.constant';
import type { NUser } from '../../interface/user';
import { useRoute } from 'vue-router';
import type { NDepartment } from '../../interface/department';
import type { NProcedureStep } from '../../interface/procedure-step';
import router from '../../router';
import jwt_decode from 'jwt-decode';


export default defineComponent({
    components: {
        MinusCircleOutlined,
        PlusOutlined
    },
    setup() {
        const store = useMenu();
        store.onSelectedKeys(["procedures"]);
        const departments = ref<NDepartment.IDepartment[]>([]);
        const approvers = ref<NUser.IUser[]>([]);
        const formRef = ref<FormInstance>();
        const route = useRoute();
        const id: string = route.params.id as string;
        const token = localStorage.getItem(TOKEN_KEY)
        const decodeToken: any = token && jwt_decode(token);
        const orgClaim = decodeToken?.org ? JSON.parse(decodeToken?.org) : null;
        const depClaim = decodeToken?.department ? JSON.parse(decodeToken?.department) : null;

        onMounted(() => {
            if (id) {
                getById(id);
            }
        })

        const getById = async (id: string) => {
            await axios.get(
                `${SERVER_RESOURCE}/procedure/${id}`
            ).then((res) => {
                if (res.data) {
                    formState.name = res.data.name;
                    formState.departmentId = res.data.departmentId;
                    if (res.data.procedureSteps.length) {
                        formState.procedureSteps = res.data.procedureSteps.sort(function (a: NProcedureStep.IProcedureStep, b: NProcedureStep.IProcedureStep) { return a.priority - b.priority });
                    }
                    else {
                        formState.procedureSteps = [];
                    }
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
            axios.get(`${SERVER_RESOURCE}/user/can-assigns`)
                .then((res) => {
                    if (res.data) {
                        approvers.value = res.data;
                    }
                }).catch((err) => {
                    console.error(err);
                    notification.error({
                        message: 'Can not get users',
                        type: 'error'
                    });
                })
            if (!depClaim) {
                axios.get(`${SERVER_RESOURCE}/department`)
                    .then((res) => {
                        if (res.data) {
                            departments.value = res.data;
                        }
                    }).catch((err) => {
                        console.error(err);
                        notification.error({
                            message: 'Can not get departments',
                            type: 'error'
                        });
                    })
            }

        })

        const formState = reactive<NProcedure.FormStateProcedureDto>({
            name: '',
            departmentId: null,
            procedureSteps: [],
            // isActive: false,
        });

        const filterOption = (input: string, option: any) => {
            return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        };

        const removeStep = (item: NProcedureStep.ICreateProcedureStep) => {
            let index = formState.procedureSteps.indexOf(item);
            if (index !== -1) {
                formState.procedureSteps.splice(index, 1);
            }
        };

        // add first step 
        onMounted(() => {
            if (!id) {
                addStep();
            }

        })

        const addStep = () => {
            formState.procedureSteps.push({
                assignId: null,
                description: undefined || '',
                id: Date.now(),
            });
        };

        const onCreate = async () => {
            try {
                const values = await formRef.value?.validateFields() as NProcedure.ICreateProcedureRequest;
                if (values) {
                    if (depClaim?.Id) {
                        values.departmentId = depClaim.Id
                    }
                    createProc(values);
                }
            } catch (errorInfo) {
                console.log('Failed:', errorInfo);
            }
        };

        const createProc = async (procDto: NProcedure.ICreateProcedureRequest) => {
            axios.post(`${SERVER_RESOURCE}/procedure`, procDto)
                .then((res) => {
                    if (res) {
                        notification.success({
                            message: 'Create successfully',
                            type: 'success'
                        });
                        router.push('/procedures')
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
                    updateOrg(values as NProcedure.IUpdateProcedureRequest);
                }
            } catch (errorInfo) {
                console.log('Failed:', errorInfo);
            }
        };

        const updateOrg = (procUpdateDto: NProcedure.IUpdateProcedureRequest) => {
            axios.put(`${SERVER_RESOURCE}/procedure/${id}`, procUpdateDto)
                .then((res) => {
                    if (res) {
                        notification.success({
                            message: 'Update successfully',
                            type: 'success'
                        });
                    }
                    router.push('/procedures')
                })
                .catch((error) => {
                    notification.error({
                        message: 'An error has occurred',
                        type: 'error'
                    });
                });
        }


        return {
            depClaim,
            id,
            approvers,
            formRef,
            formState,
            departments,
            filterOption,
            onCreate,
            removeStep,
            addStep,
            onUpdate
        };


    },
});

</script>

<template>
    <div class="block-container">
        <div class="block-heading">
            <span v-if="!id">Create Procedure</span>
            <span v-if="id">Update Procedure</span>
            <div className="header-actions">
                <a-button type="primary">
                    <router-link :to="{ name: 'procedures' }">
                        Back
                    </router-link>
                </a-button>
                <a-button v-if="!id" type="primary" @click="onCreate">Add</a-button>
                <a-button v-if="id" type="primary" @click="onUpdate">Update</a-button>
            </div>
        </div>

        <div class="section">
            <a-form ref="formRef" layout="vertical" name="dynamic_form_nest_item" :model="formState">
                <h1 class="title-detail">Procedure Details</h1>

                <!-- <a-form-item label="Status:" name="isActive">
                    <a-switch v-model:checked="formState.isActive" />
                </a-form-item> -->

                <a-form-item label="Name:" name="name"
                    :rules="[{ required: true, message: 'Please input procedure name' }]">
                    <a-input placeholder="Input procedure name" v-model:value="formState.name" />
                </a-form-item>

                <template v-if="!depClaim">
                    <a-form-item label="Department:" name="departmentId"
                        :rules="[{ required: true, message: 'Please select procedure', trigger: 'change' }]">
                        <a-select :allowClear="true" v-model:value="formState.departmentId" show-search
                            placeholder="Select department" style="width: 400px" :filter-option="filterOption">
                            <a-select-option v-for="dep in departments" :key="dep.id" :value="dep.id">
                                {{ dep.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </template>

                <div className="btn-add-container">
                    <a-button className="add-step-btn" @click="addStep">
                        <PlusOutlined />
                        Add Step
                    </a-button>
                </div>

                <div class="step-procedure-detail-container">
                    <h1 class="title-detail">Step Procedure Details</h1>
                    <a-space v-for="(step, index) in formState.procedureSteps" :key="step.id"
                        style="display: flex; margin-bottom: 8px">
                        <p class="step-text"> +Step {{ index + 1 }}:</p>
                        <div>
                            <a-col class="gutter-row" :span="24">
                                <a-form-item label="Description:" :name="['procedureSteps', index, 'description']" :rules="{
                                    required: true,
                                    message: 'Please input description this step',
                                }">
                                    <a-input v-model:value="step.description" placeholder="Description" />
                                </a-form-item>
                            </a-col>

                            <a-col class="gutter-row" :span="24">
                                <a-form-item label="Approver:" :name="['procedureSteps', index, 'assignId']" :rules="{
                                    required: true,
                                    message: 'Please select approver',
                                }">
                                    <a-select :allowClear="true" v-model:value="step.assignId" show-search
                                        placeholder="Select approver" style="width: 400px" :filter-option="filterOption">
                                        <a-select-option v-for="approver in approvers" :key="approver.id"
                                            :value="approver.id">
                                            {{ `${approver?.firstName || ''} ${approver?.lastName || ''}` }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                        </div>
                        <div v-if="index > 0" class="flex items-center cursor-pointer" @click="removeStep(step)">
                            <span class="mr-2">Remove</span>
                            <MinusCircleOutlined />
                        </div>
                    </a-space>
                </div>
            </a-form>

        </div>
    </div>
</template>

<style lang="scss">
.step-procedure-detail-container {
    .step-text {
        font-size: 14px;
        font-weight: 500;
        color: red;
    }
}

.title-detail {
    color: #101828;
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 12px;
}

.btn-add-container {
    .add-step-btn {
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.5rem;
    }
}
</style>