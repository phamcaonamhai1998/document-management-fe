export declare namespace NProcedure {
  export interface IProcedure {
    id: string
    name: string
    procedureSteps: ProcedureSteps[]
  }

  export interface FormStateProcedureDto {
    name: string
    departmentId: string | null
    procedureSteps: ProcedureSteps[]
  }

  export interface ProcedureSteps {
    id: number
    description: string
    assignId: string | null
  }

  export interface ICreateProcedureRequest extends FormStateProcedureDto {}

  export interface IUpdateProcedureRequest {
    name: string
    procedureSteps: ProcedureSteps[]
  }
}
