import { NPermission } from './permission'

export declare namespace NRole {
  interface IRole {
    id: string
    code: string
    permissions: string[]
    name: string
  }

  interface ICreateRole {
    name: string
    permissions: NPermission.ICreatePermission[]
  }

  interface IUpdateRole {
    name: string
    permissions: NPermission.ICreatePermission[]
  }
}
