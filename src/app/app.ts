import { HttpClient } from '@angular/common/http';
import { Component, DOCUMENT, Inject, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UtilsService } from './auth/_service/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  loginCustomLayout: any;
  themes: any[] = [];

  constructor(
    private title: Title,
    private utilsService: UtilsService,
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    sessionStorage.removeItem('customCompanyInfo');
    this.getCompany();
  }

  async getCompany() {
    console.log('getCompany');

    this.loginCustomLayout = await this.utilsService.getCustomCompanyInfo();
    if (this.loginCustomLayout) {
      this.title.setTitle(this.loginCustomLayout.companyName);

      console.log(
        'this.loginCustomLayout.companyName....',
        this.loginCustomLayout,
      );

      const faviconElement = this.document.getElementById('favicon');

      if (faviconElement) {
        faviconElement.setAttribute('href', this.loginCustomLayout.favicon);
      }
    }

    if (this.loginCustomLayout?.theme) {
      this.setTheme(this.loginCustomLayout?.theme);
    }
  }

  setTheme(theme: any) {
    console.log('Theme:-', theme);
    document.documentElement.style.setProperty('--textColor', theme.textColor);
    // document.documentElement.style.setProperty('--base-primary', theme.bgColor);
    document.documentElement.style.setProperty(
      '--hoverColor',
      theme.hoverColor,
    );
    document.documentElement.style.setProperty(
      '--hoverTextColor',
      theme.hoverTextColor,
    );
    document.documentElement.style.setProperty(
      '--activeColor',
      theme.activeColor,
    );
  }

  ngOnDestroy() {
    sessionStorage.removeItem('customCompanyInfo');
  }
}
