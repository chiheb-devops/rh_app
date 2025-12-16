import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegionService {


  private apiUrl = 'http://localhost:8080/api/regions';

  constructor(private http: HttpClient) { }

  // 1. GET ALL
  getAllRegions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get_reg`);
  }

  // 2. GET BY ID
  getRegionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_reg_byId/${id}`);
  }

  // 3. ADD
  addRegion(region: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, region);
  }

  // 4. UPDATE
  updateRegion(region: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${region.id}`, region);
  }

  // 5. DELETE
  deleteRegion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Delete_rerg/${id}`);
  }
}