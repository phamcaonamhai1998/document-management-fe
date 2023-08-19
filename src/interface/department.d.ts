export declare namespace NDepartment {
  export interface IDepartment {
    id: string
    name: string
    email: string
    phone: string
    organizationId: string
  }

  export interface FormStateDepartmentDto {
    name: string
    email: string
    phone: string
    organizationId: string
  }

  export interface ICreateDepartmentRequest extends FormStateDepartmentDto {}

  export interface IUpdateDepartmentRequest {
    name: string
    phone: string
    email: string
  }
}
