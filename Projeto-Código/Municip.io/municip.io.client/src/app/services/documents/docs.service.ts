import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, of } from 'rxjs';
import { Citizen } from '../citizen-auth.service';

@Injectable({
  providedIn: 'root'
})
export class DocsService {


  constructor(private http: HttpClient) { }

  //get all documents
  getTemplatesFromMunicipality(municipality: string): Observable<DocumentTemplate[]> {
    const params = { municipality: municipality };
    return this.http.get<DocumentTemplate[]>('api/documents/GetTemplatesFromMunicipality', { params: params });
  }

  GetDistinctDocumentTypesFromMunicipality(municipality: string): Observable<string[]> {
    console.log(municipality + 'dasd');
    return this.http.get<string[]>(`api/documents/GetDistinctDocumentTypesFromMunicipality?municipality=${municipality}`);
  }

  //get all request documents
  getRequestsFromMunicipality(municipality: string): Observable<RequestDocument[]> {
    const params = { municipality: municipality };
    return this.http.get<RequestDocument[]>('api/documents/GetRequestsFromMunicipality', { params: params });
  }

  //get all request documents
  getRequestsFromCitizen(email: string): Observable<RequestDocument[]> {
    const params = { email: email };
    return this.http.get<RequestDocument[]>('api/documents/GetRequestsFromCitizen', { params: params });
  }

  createTemplate(template: any): Observable<any> {
    return this.http.post<any>('/api/documents/CreateTemplate', template);
  }

  editTemplate(template: DocumentTemplate, id: number): Observable<any> {
    return this.http.post<any>('/api/documents/EditTemplate', template, { params: { id: id.toString() } });
  }


  createRequest(email: string, documentRequest: RequestDocument): Observable<any> {
    let params = new HttpParams()
      .set('email', email.toString())





    return this.http.post<any>('api/documents/CreateRequest', documentRequest, { params: params });
  }



  getTemplateById(id: number): Observable<DocumentTemplate> {
    return this.http.get<DocumentTemplate>(`api/documents/GetTemplateById?id=${id}`);
  }



  activeTemplate(id: number): Observable<any> {
    return this.http.put(`api/DocumentTemplateStatus/activate?id=${id}`, id);
  }

  desactiveTemplate(id: number): Observable<any> {
    return this.http.put(`api/DocumentTemplateStatus/deactivate?id=${id}`, id);
  }

  removeTemplate(id: number): Observable<any> {
    return this.http.delete(`api/DocumentTemplateStatus/remove/${id}`);
  }

}

export interface RequestDocument {
  id?: number,
  documentTemplate: DocumentTemplate,
  name: string,
  citizen: Citizen,
  municipality: string,
  status: StatusDocument,
  date: Date,
  payUrl?: string
}


export enum StatusDocument {
  pending = 'Pending',
  approved = 'Approved',
  rejected = 'Rejeitado',
  waitingForPayment = 'WaitingForPayment',
}


//create a to string for the enum
export function statusToString(status: StatusDocument): string {
  switch (status) {
    case StatusDocument.pending:
      return "Pendente";
    case StatusDocument.approved:
      return "Aprovado";
    case StatusDocument.rejected:
      return "Rejeitado";
    case StatusDocument.waitingForPayment:
      return "À espera de pagamento";
  }
}


export enum DocumentType {
  Requirement = "Requerimento",
  Alvara = 'Alvará',
  Certeficated = 'Certificado',
  Other = 'Outro'
}

export interface DocumentTemplate {
  id?: number,
  name: string,
  description: string,
  type: string,
  price: number,
  textTemplate: string
  municipality: string,
  status?: DocumentTemplateStatus,
}

export enum DocumentTemplateStatus {
  active = 'Active',
  inactive = 'Inactive',
  notListed = 'NotListed'
}
