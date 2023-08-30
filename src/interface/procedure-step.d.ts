export declare namespace NProcedureStep {
  export interface IProcedureStep {
    id: string
    description: string
    assignId: string | null
    priority: number
  }

  export interface ICreateProcedureStep {
    id: number
    description: string
    assignId: string | null
  }

  export interface IUpdateProcedureStep extends ICreateProcedureStep {}
}
