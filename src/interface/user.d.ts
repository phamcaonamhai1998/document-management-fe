export declare namespace NUser {
  export interface IUser {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    avatarUrl?: string
    roleId: string | null
    isActive: boolean
    orgId: string | null
    departmentId: string | null
  }

  export interface FormStateUserDto {
    roleId: string | null
    isActive: boolean
    email: string
    firstName: string
    lastName: string
    phone: string
    password: string
    confirmPassword: string
    orgId: string | null
    departmentId: string | null
  }

  export interface ICreateUserRequest extends FormStateUserDto {}

  export interface IUpdateUserRequest {
    isActive: boolean
    firstName: string
    lastName: string
    phone: string
  }
}
