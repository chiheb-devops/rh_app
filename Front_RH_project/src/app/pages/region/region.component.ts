import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegionService } from '../../services/region.service';

@Component({
  selector: 'app-region',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {
// vars
  regions: any[] = [];
  showDeptList: boolean = false;
 
  form: any = {
    id: null,
    name: ''
  };
// sort
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
 
  isModalOpen: boolean = false;

  isViewModalOpen: boolean = false;
  selectedRegion: any = null;
//Pop Up
  toastMessage: string = '';
  showToast: boolean = false;
  toastType: 'success' | 'error' = 'success';

  constructor(private regionService: RegionService) {}

  ngOnInit() {
    this.loadRegions();
  }

  loadRegions() {
    this.regionService.getAllRegions().subscribe(res => this.regions = res);
  }

  // --- VIEW DETAILS ACTIONS ---
  openViewModal(region: any) {
    this.selectedRegion = region;
    this.showDeptList = false; 
    this.isViewModalOpen = true;
  }

  // NEW: Function to toggle visibility
  toggleDeptList() {
    if (this.selectedRegion.dept_count > 0) {
      this.showDeptList = !this.showDeptList;
    }
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedRegion = null;
  }
// --- TOAST NOTIFICATION HELPER ---
  showNotification(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
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
 saveRegion() {
    // 1. Check for Duplicate Name (Case Insensitive)
    const isDuplicate = this.regions.some(r => 
      r.name.trim().toLowerCase() === this.form.name.trim().toLowerCase() && 
      r.id !== this.form.id // Ignore itself if we are editing
    );

    if (isDuplicate) {
      this.showNotification('Region name already exists! ⚠️', 'error');
      return; 
    }

    // 2. Proceed if Unique
    if (this.form.id == null) {
      this.regionService.addRegion(this.form).subscribe({
        next: () => {
          this.loadRegions();
          this.closeModal();
          this.showNotification('Region created successfully! ✅');
        },
        error: () => this.showNotification('Error creating region', 'error')
      });
    } else {
      this.regionService.updateRegion(this.form).subscribe({
        next: () => {
          this.loadRegions();
          this.closeModal();
          this.showNotification('Region updated successfully! ✅');
        },
        error: () => this.showNotification('Error updating region', 'error')
      });
    }
  }

  editRegion(region: any) {
    this.form = JSON.parse(JSON.stringify(region));
    this.openModal();
  }

  deleteRegion(id: number) {
    if(confirm('Are you sure you want to delete this region?')) {
      this.regionService.deleteRegion(id).subscribe(() => this.loadRegions());
      this.showNotification('Region updated successfully! ✅');

    }
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.regions.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];
      
      let res = 0;
      if (typeof valA === 'number') res = valA - valB;
      else res = valA.toString().localeCompare(valB.toString());

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
      name: ''
    };
  }
}