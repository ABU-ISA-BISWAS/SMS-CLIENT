import { Component, DOCUMENT, Inject, OnInit } from '@angular/core';
import { UtilsService } from '../_service/utils.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  companyInfo: any;

  constructor(
    private utilsService: UtilsService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit() {
    this.getCompany();
  }

  async getCompany() {
    this.companyInfo = await this.utilsService.getCustomCompanyInfo();

    if (this.companyInfo) {
      const html = this.document.querySelector('html');

      if (html) {
        html.classList.add(this.companyInfo.companyClassName);
      }

      localStorage.removeItem('companyClassName');
      localStorage.setItem(
        'companyClassName',
        this.companyInfo.companyClassName,
      );
    }
  }
}
