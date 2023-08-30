import type { NProcedureStep } from './procedure-step'

export declare namespace NProcedure {
  export interface IProcedure {
    id: string
    isActive: boolean
    name: string
    procedureSteps: NProcedureStep.IProcedureSteps[]
  }

  export interface FormStateProcedureDto {
    // isActive: boolean
    name: string
    departmentId: string | null
    procedureSteps: NProcedureStep.ICreateProcedureStep[]
  }

  export interface ICreateProcedureRequest extends FormStateProcedureDto {}

  export interface IUpdateProcedureRequest {
    // isActive: boolean
    name: string
    procedureSteps: NProcedureStep.IUpdateProcedureStep[]
  }
}
