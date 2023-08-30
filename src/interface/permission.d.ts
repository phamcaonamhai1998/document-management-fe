export declare namespace NPermission {
  interface IPermission {
    id: string
    code: string
    groupCode: string
    name: string
  }

  interface ICreatePermission {
    name: string
    code: string
    groupCode: string
  }
}
