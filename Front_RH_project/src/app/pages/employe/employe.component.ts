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
  filteredEmployees: any[] = []; // For Search Bar results
  searchId: string = '';

  // --- MAIN FILTER VARIABLES (Top of Page) ---
  filteredDepartments: any[] = []; // Depts filtered by Region
  filteredEmployeesList: any[] = []; // Employees filtered by Dept
  selectedRegionId: any = null;
  selectedDeptId: any = null;

  // --- MODAL VARIABLES (Add/Edit Form) ---
  isModalOpen: boolean = false;
  modalSelectedRegionId: any = null;
  modalFilteredDepts: any[] = [];
  
  // Tri
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';


  form: any = {
    id: null,
    firstName: '',
    lastName: '',
    salary: null,
    dept_id: null 
  };

  // --- VIEW DETAILS VARIABLES ---
  isViewModalOpen: boolean = false;
  selectedEmployee: any = null; 
 // NEW: Toast Notification State
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
      // Initialize filtered list (optional, depends on your search logic)
      // this.filteredEmployees = this.employees; 
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
 // --- TOAST NOTIFICATION HELPER ---
  showNotification(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
  // --- MAIN PAGE FILTER LOGIC ---
  onRegionChange() {
    this.selectedDeptId = null;
    this.filteredEmployeesList = []; 
    
    if (this.selectedRegionId) {
      this.filteredDepartments = this.allDepartments.filter(d => d.region_id == this.selectedRegionId);
    } else {
      this.filteredDepartments = [];
    }
  }

  onDeptChange() {
    if (this.selectedDeptId) {
      this.filteredEmployeesList = this.employees.filter(e => e.dept_id == this.selectedDeptId);
    } else {
      this.filteredEmployeesList = [];
    }
  }

  // --- MODAL CASCADING DROPDOWN LOGIC ---
  
  // 1. When Region is changed inside the Modal
  onModalRegionChange() {
    this.form.dept_id = null; // Reset dept selection
    
    if (this.modalSelectedRegionId) {
      this.modalFilteredDepts = this.allDepartments.filter(d => d.region_id == this.modalSelectedRegionId);
    } else {
      this.modalFilteredDepts = [];
    }
  }

  // --- MODAL ACTIONS ---
  openModal() {
    this.isModalOpen = true;
    // Reset modal dropdowns
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
        this.showNotification('Employe created successfully! ✅');
      });
    } else {
      this.empService.update(this.form).subscribe(() => {
        this.loadEmployees();
        this.closeModal(); 
        this.showNotification('Employe updated successfully! ✅');
      });
    }
  }

  editEmployee(emp: any) {
    this.form = JSON.parse(JSON.stringify(emp));
    this.isModalOpen = true;
    
    // PRE-FILL LOGIC:
    // 1. Find the department of this employee
    const dept = this.allDepartments.find(d => d.id == this.form.dept_id);
    
    if (dept) {
      // 2. Set the region based on that department
      this.modalSelectedRegionId = dept.region_id;
      
      // 3. Trigger filter to populate the dept dropdown
      this.onModalRegionChange();
      
      // 4. Restore the dept_id (because onModalRegionChange clears it)
      this.form.dept_id = emp.dept_id;
      
    }
    
  }

  deleteEmployee(id: number) {
    if(confirm('Are you sure you want to delete?')) {
      this.empService.delete(id).subscribe(() => this.loadEmployees());
      this.showNotification('Employe Deleted successfully! ✅');
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
sortData(column: string) {
    // 1. Toggle direction if clicking the same column
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // 2. Sort the Main List
    this.employees.sort((a, b) => {
      const res = this.compareValues(a[column], b[column]);
      return this.sortDirection === 'asc' ? res : -res;
    });

    // 3. Sort the Filtered List (if visible)
    if (this.filteredEmployeesList.length > 0) {
      this.filteredEmployeesList.sort((a, b) => {
        const res = this.compareValues(a[column], b[column]);
        return this.sortDirection === 'asc' ? res : -res;
      });
    }
  }

  // Helper to compare numbers or strings
  compareValues(valA: any, valB: any): number {
    if (typeof valA === 'string') {
      return valA.localeCompare(valB);
    }
    return valA - valB;
  }

  // Helper to show arrow icon
  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '↕'; // Default neutral icon
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  resetForm() {
    this.form = {
      id: null,
      firstName: '',
      lastName: '',
      salary: null,
      dept_id: null
    };
  }
}