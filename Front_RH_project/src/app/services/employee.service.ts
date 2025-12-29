import { Injectable } from '@angular/core';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private API = 'http://localhost:8080/api/employees';
 
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${this.API}/get_emp`);
  }
getById(ID: number): Observable<any> {
    return this.http.get<any>(`${this.API}/get_emp_byID/${ID}`);
  }
  add(employee: any): Observable<any> {
    return this.http.post(`${this.API}/add`, employee);
  }

  update(employee: any): Observable<any> {
    return this.http.put(`${this.API}/update`, employee);
  }

  delete(ID: number): Observable<any> {
    return this.http.delete(`${this.API}/Delete_emp/${ID}`);
  }

  //export to PDF
  exportPdf(reportName: string, region_id?: number, dept_id?: number, id?: number): Observable<Blob> {
      let params = new HttpParams();
      if (region_id) {
    params = params.set('region_id', region_id.toString());
  }
  if (dept_id) {
    params = params.set('deptId', dept_id.toString());
  }
  if (id) {
    params = params.set('id', id.toString());
  }
      
    return this.http.get(`http://localhost:8080/api/reports/${reportName}`, {
    params: params,
    responseType: 'blob'
  });
}



}