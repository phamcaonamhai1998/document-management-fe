export declare namespace Permission {
  interface IPermission {
    id: string
    code: string
    groupCode: string
    name: string
  }

  interface ICreatePermission {
    code: string
    groupCode: string
  }
}
