import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../../auth/_service/utils.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: false,
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayout implements OnInit, AfterViewInit {

  isSidebarCollapsed: boolean = false;
  navData: [] = [];

  constructor(
    public router: Router,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    this.utilsService.autoLogoutForIdleBrowser();
    // sidebar toggle collapse value get from localstorage
    const stored = localStorage.getItem('sidebarCollapsed');
    this.isSidebarCollapsed = stored === 'true';
  }

  ngAfterViewInit() {
    document.querySelectorAll('.nav-item a.activeNav').forEach(link => {
      const dropdownContainer = link.closest('.nav-collapse') as HTMLElement;
      if (dropdownContainer) {
        const dropdownBtn = dropdownContainer.previousElementSibling as HTMLElement;

        if (dropdownBtn && dropdownBtn.classList.contains('dropdown-toggle')) {
          dropdownBtn.classList.add('activeNav');
        }
        dropdownContainer.style.display = 'block';
      }
    });

  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    localStorage.setItem('sidebarCollapsed', this.isSidebarCollapsed.toString());
    console.log('Sidebar toggled. New state:', this.isSidebarCollapsed);
  }



}
