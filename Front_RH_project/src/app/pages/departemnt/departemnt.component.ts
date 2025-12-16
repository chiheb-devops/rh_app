import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeptService } from '../../services/dept.service';
import { RegionService } from '../../services/region.service'; 
import { EmployeeService } from '../../services/employee.service';
@Component({
  selector: 'app-dept',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './departemnt.component.html',
  styleUrls: ['./departemnt.component.css']
})
export class DeptComponent implements OnInit {

  //vars
  departments: any[] = [];
  regions: any[] = []; 
  showEmpList: boolean = false;
  searchId: any = '';
  foundDept: any = null; 
  form: any = {
    id: null,
    name: '',
    region_id: null 
  };
  //filtre
  selectedEmployee: any = null;
  isModalOpen: boolean = false;
  isViewModalOpen: boolean = false;
  selectedDept: any = null;
  isEmpDetailModalOpen: boolean = false;
  //sort
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

   // NEW: Toast Notification State
  toastMessage: string = '';
  showToast: boolean = false;
  toastType: 'success' | 'error' = 'success';

//construcotr
  constructor(
    private deptService: DeptService,
    private regionService: RegionService,
    private empService: EmployeeService 
  ) {}

  ngOnInit() {
    this.loadDepartments();
    this.loadRegions();
  }
 // --- TOAST NOTIFICATION HELPER ---
  showNotification(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }

  loadDepartments() {
    this.deptService.getAllDepartments().subscribe(res => this.departments = res);
  }

  loadRegions() {
   
    this.regionService.getAllRegions().subscribe(res => this.regions = res);
  }

  //search
searchDeptById() {
    if (!this.searchId) {
      this.foundDept = null;
      return;
    }
    // Find department inside the already loaded list
    this.foundDept = this.departments.find(d => d.id == this.searchId);
  }

  // NEW: Clear Search
  clearSearch() {
    this.searchId = '';
    this.foundDept = null;
  }

  // UPDATE: Reset toggle when opening modal
  openViewModal(dept: any) {
    this.selectedDept = dept;
    this.showEmpList = false; 
    this.isViewModalOpen = true;
  }

  // NEW: Toggle function
  toggleEmpList() {
    if (this.selectedDept.emp_count > 0) {
      this.showEmpList = !this.showEmpList;
    }
  }
  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedDept = null;
  }

  // --- ADD/EDIT MODAL ACTIONS ---
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  // --- CRUD ACTIONS ---
saveDept() {
    
    const isDuplicate = this.departments.some(d => 
      d.name.trim().toLowerCase() === this.form.name.trim().toLowerCase() && 
      d.region_id == this.form.region_id && 
      d.id !== this.form.id 
    );

    if (isDuplicate) {
           this.showNotification('department name already exists! ⚠️', 'error');      return; 
    }

    
    if (this.form.id == null) {
      this.deptService.addDepartment(this.form).subscribe(() => {
        this.loadDepartments();
        this.closeModal();
        this.showNotification('Region created successfully! ✅');
      });
    } else {
      this.deptService.updateDepartment(this.form).subscribe(() => {
        this.loadDepartments();
        this.closeModal();
        this.showNotification('Region updated successfully! ✅');
      });
    }
  }

  editDept(dept: any) {
    this.form = JSON.parse(JSON.stringify(dept));
    this.openModal();
  }

  deleteDept(id: number) {
    if(confirm('Are you sure you want to delete this department?')) {
      this.deptService.deleteDepartment(id).subscribe(() => this.loadDepartments());
      this.showNotification('departement deleted successfully! ✅')
    }
  }
  // open Employee Details
 openEmployeeDetail(id: number) {
    this.empService.getById(id).subscribe(data => {
      this.selectedEmployee = data;
      this.isEmpDetailModalOpen = true;
    });
  }

  //  Close Employee Details
  closeEmployeeDetail() {
    this.isEmpDetailModalOpen = false;
    this.selectedEmployee = null;
  }


// sort
sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.departments.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];
      
      // Handle potential nulls for region_name
      const strA = valA ? valA.toString() : '';
      const strB = valB ? valB.toString() : '';

      let res = 0;
      if (typeof valA === 'number') res = valA - valB;
      else res = strA.localeCompare(strB);

      return this.sortDirection === 'asc' ? res : -res;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '↕';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }
  
  resetForm() {
    this.form = {
      id: null,
      name: '',
      region_id: null
    };
  }
}