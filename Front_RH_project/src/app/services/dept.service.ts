import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeptService {


  private apiUrl = 'http://localhost:8080/api/departments';

  constructor(private http: HttpClient) { }

  // 1. GET ALL (Used for the Dropdown in Employee Form)
  getAllDepartments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 2. GET BY ID
  getDepartmentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // 3. ADD NEW DEPARTMENT
  addDepartment(dept: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, dept);
  }

  // 4. UPDATE DEPARTMENT

  updateDepartment(dept: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${dept.id}`, dept);
  }

  // 5. DELETE DEPARTMENT
  deleteDepartment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}