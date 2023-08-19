import { Permission } from './permission'

export declare namespace NRole {
  interface IRole {
    id: string
    code: string
    permissions: string[]
    name: string
  }

  interface ICreateRole {
    name: string
    permissions: Permission.ICreatePermission[]
  }
}
