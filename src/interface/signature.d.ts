export declare namespace NSignature {
  export interface ISignature {
    id: string
    name: string
    isDefault: boolean
  }

  export interface FormStateSignatureDto {
    fileId: string | null
    password: string
    confirmPassword: string
  }

  export interface ICreateSignatureRequest {
    fileId: string | null
    password: string
  }
}
