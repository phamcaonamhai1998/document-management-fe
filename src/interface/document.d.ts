export declare namespace NDocument {
  export interface IDocument {
    id: string
    title: string
    content: string
    isActive: boolean
  }

  export interface FormStateDocumentDto {
    procedureId: string | null
    title: string | null
    description?: null
    driveDocId: string | null
  }

  export interface ICreateDocumentRequest extends FormStateDocumentDto {
    driveDocId: string
  }

  export interface IUpdateDocumentRequest {
    name: string
    phone: string
    email: string
  }
}
