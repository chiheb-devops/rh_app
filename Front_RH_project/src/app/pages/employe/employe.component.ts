import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { DeptService } from '../../services/dept.service'; 
import { RegionService } from '../../services/region.service';

@Component({
  selector: 'app-employe',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.css']
})
export class EmployeComponent implements OnInit {

  // --- DATA VARIABLES ---
  employees: any[] = [];
  allDepartments: any[] = []; 
  regions: any[] = [];

  // --- SEARCH VARIABLES ---
  filteredEmployees: any[] = []; 
  searchId: string = '';

  // --- MAIN FILTER VARIABLES ---
  filteredDepartments: any[] = []; 
  filteredEmployeesList: any[] = []; 
  selectedRegionId: any = null;
  selectedDeptId: any = null;

  // --- MODAL VARIABLES ---
  isModalOpen: boolean = false;
  modalSelectedRegionId: any = null;
  modalFilteredDepts: any[] = [];
  
  // --- SORTING ---
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // --- FORM (UPDATED TO UPPERCASE) ---
  form: any = {
    id: null,
    FIRST_NAME: '', // Changed from firstName
    LAST_NAME: '',  // Changed from lastName
    SALARY: null,   // Changed from salary
    dept_id: null 
  };

  // --- VIEW DETAILS & TOAST ---
  isViewModalOpen: boolean = false;
  selectedEmployee: any = null; 
  toastMessage: string = '';
  showToast: boolean = false;
  toastType: 'success' | 'error' = 'success';



  constructor(
    private empService: EmployeeService,
    private deptService: DeptService,
    private regionService: RegionService
  ) {}

  ngOnInit() {
    this.loadEmployees();
    this.loadDepartments(); 
    this.loadRegions();
  }

  // --- LOAD DATA ---
loadEmployees() {
    this.empService.getAll().subscribe(res => {
      this.employees = res;
      // Initialize filtered list with ALL employees
      this.filteredEmployeesList = [...this.employees]; 
    });
  }

  loadDepartments() {
    this.deptService.getAllDepartments().subscribe(res => this.allDepartments = res);
  }

  loadRegions() {
    this.regionService.getAllRegions().subscribe(res => this.regions = res);
  }

  // --- SEARCH LOGIC ---
  searchEmployeeById() {
    if (!this.searchId || this.searchId.trim() === '') {
      this.filteredEmployees = [];
      return;
    }
    
    const searchIdNum = parseInt(this.searchId.trim());
    
    if (isNaN(searchIdNum)) {
      this.filteredEmployees = [];
      return;
    }
    
    this.filteredEmployees = this.employees.filter(emp => emp.id === searchIdNum);
  }
  
  clearSearch() {
    this.searchId = '';
    this.filteredEmployees = [];
  }

  // --- TOAST NOTIFICATION ---
  showNotification(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => { this.showToast = false; }, 3000);
  }
// --- MAIN PAGE FILTER LOGIC ---
  onRegionChange() {
    console.log('--------------------------------');
    console.log('🔄 REGION CHANGED');
    console.log('👉 Selected Region ID:', this.selectedRegionId);

    // Reset Dept Selection
    this.selectedDeptId = null;
    
    if (this.selectedRegionId) {
      // 1. Filter Departments
      this.filteredDepartments = this.allDepartments.filter(d => d.region_id == this.selectedRegionId);
      
      console.log(`✅ Found ${this.filteredDepartments.length} Departments in this Region:`, this.filteredDepartments);

      // 2. Reset Employee List (Wait for Dept selection)
      this.filteredEmployeesList = []; 
      console.log('⏹️ Employee list cleared (Waiting for Dept selection)');

    } else {
      // Reset: Show ALL employees if Region is cleared
      this.filteredDepartments = [];
      this.filteredEmployeesList = [...this.employees];
      console.log('🔄 Filter Cleared. Showing ALL employees.');
    }
  }

  onDeptChange() {
    console.log('--------------------------------');
    console.log('🔄 DEPARTMENT CHANGED');
    console.log('👉 Selected Dept ID:', this.selectedDeptId);

    if (this.selectedDeptId) {
      // Filter by Dept
      this.filteredEmployeesList = this.employees.filter(e => e.dept_id == this.selectedDeptId);
      console.log(`✅ Found ${this.filteredEmployeesList.length} Employees in this Dept:`, this.filteredEmployeesList);
    } else {
      // If Dept cleared
      this.filteredEmployeesList = [];
      console.log('⏹️ Dept cleared. Employee list empty.');
    }
  }

  // --- MODAL CASCADING DROPDOWN LOGIC ---
  onModalRegionChange() {
    this.form.dept_id = null; 
    
    if (this.modalSelectedRegionId) {
      this.modalFilteredDepts = this.allDepartments.filter(d => d.region_id == this.modalSelectedRegionId);
    } else {
      this.modalFilteredDepts = [];
    }
  }

  // --- MODAL ACTIONS ---
  openModal() {
    this.isModalOpen = true;
    this.modalSelectedRegionId = null;
    this.modalFilteredDepts = [];
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm(); 
  }

  saveEmployee() {

    if (this.form.id == null) {
      this.empService.add(this.form).subscribe(() => {
        this.loadEmployees();
        this.closeModal(); 
        this.showNotification('Employee created successfully! ✅');
      });
    } else {
      this.empService.update(this.form).subscribe(() => {
        this.loadEmployees();
        this.closeModal(); 
        this.showNotification('Employee updated successfully! ✅');
      });
    }
  }

  editEmployee(emp: any) {
    this.form = JSON.parse(JSON.stringify(emp));
    this.isModalOpen = true;
    
    // PRE-FILL LOGIC
    const dept = this.allDepartments.find(d => d.ID == this.form.dept_id);
    
    if (dept) {
      this.modalSelectedRegionId = dept.region_id;
      this.onModalRegionChange();
      this.form.dept_id = emp.dept_id;
    }
  }

  deleteEmployee(id: number) {
    if(confirm('Are you sure you want to delete?')) {
      this.empService.delete(id).subscribe(() => {
        this.loadEmployees();
        this.showNotification('Employee Deleted successfully! ✅');
      });
    }
  }

  // --- VIEW DETAILS ACTIONS ---
  openViewModal(emp: any) {
    this.selectedEmployee = emp;
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedEmployee = null;
  }

  // --- SORTING ---
  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.employees.sort((a, b) => {
      const res = this.compareValues(a[column], b[column]);
      return this.sortDirection === 'asc' ? res : -res;
    });

    if (this.filteredEmployeesList.length > 0) {
      this.filteredEmployeesList.sort((a, b) => {
        const res = this.compareValues(a[column], b[column]);
        return this.sortDirection === 'asc' ? res : -res;
      });
    }
  }

  compareValues(valA: any, valB: any): number {
    if (typeof valA === 'string') {
      return valA.localeCompare(valB);
    }
    return valA - valB;
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '↕';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }


  resetForm() {
    this.form = {
      id: null,
      FIRST_NAME: '', 
      LAST_NAME: '',  
      SALARY: null,   
      dept_id: null
    };
  }

  // --- EXPORT ---
 exportReport() {
 const region_id = this.selectedRegionId;
    const dept_id = this.selectedDeptId;

 
    this.empService.exportPdf('employees').subscribe({
           
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employees_report.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
     
        this.showNotification('Employee file exported successfully! ✅');
      },
      error: (err) => {
        console.error('Export failed', err);
        this.showNotification('Failed to download report.', 'error');
      }
    });
  }

   exportFilteredReport() {
 const reportName = 'filtred_employees'; 
    const region_id = this.selectedRegionId;
    const dept_id = this.selectedDeptId;
    console.log('--- EXPORT DEBUG ---');
    console.log('1. Report Name:', reportName);
    console.log('2. Selected Region ID:', region_id);
    console.log('3. Selected Dept ID:', dept_id);
    console.log('4. Full URL:', `http://localhost:8080/api/reports/${reportName}?regionId=${region_id}&deptId=${dept_id}`);
    console.log (region_id ,'a,fkzv', dept_id);
    
    this.empService.exportPdf('filtred_employees', region_id, dept_id).subscribe({
           
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'filtred_employees_report.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
     
        this.showNotification('Employee file exported successfully! ✅');
      },
      error: (err) => {
        console.error('Export failed', err);
        this.showNotification('Failed to download report.', 'error');
      }
    });
  }
}