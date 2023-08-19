export declare namespace NOrganization {
  export interface IOrganization {
    id: string
    name: string
    email: string
    phone: string
  }

  export interface FormStateOrganizationDto {
    name: string
    email: string
    phone: string
  }

  export interface ICreateOrganizationRequest extends FormStateUserDto {}

  export interface IUpdateOrganizationRequest {
    name: string
    phone: string
    email: string
  }
}
