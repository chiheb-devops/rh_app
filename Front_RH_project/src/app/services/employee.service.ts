import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API}/get_emp_byID/${id}`);
  }
  add(employee: any): Observable<any> {
    return this.http.post(`${this.API}/add`, employee);
  }

  update(employee: any): Observable<any> {
    return this.http.put(`${this.API}/update`, employee);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/Delete_emp/${id}`);
  }
}
