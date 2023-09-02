export declare namespace NDocument {
  export interface IDocument {
    id: string
    title: string
    content: string
    path: string
    isActive: boolean
    orgId: string
    departmentId: string
    description: string
    driveDocId: string
    orgName: string
    departmentNam: string
    procedureName: string
    procedureId: string
    userFullName: string
    step: IAssignStep
    userId: string
    status: string
  }

  export interface FormStateDocumentDto {
    procedureId: string | null
    title: string | null
    description?: null
    driveDocId: string | null
  }

  export interface FormRejectDocumentDto {
    reason: string | null
  }

  export interface ICreateDocumentRequest extends FormStateDocumentDto {
    driveDocId: string
  }

  export interface IUpdateDocumentRequest {
    name: string
    phone: string
    email: string
  }

  export interface IAssignDocument {
    id: string
    userId: string
    title: string
    path: string
    isActive: boolean
    orgId: string
    departmentId: string
    description: string
    driveDocId: string
    orgName: string
    departmentNam: string
    procedureName: string
    procedureId: string
    userFullName: string
    step: IAssignStep
  }

  export interface IAssignStep {
    id: string
    depscription: string
    priority: number
    assignId: string
    procedureId: string
  }
}
