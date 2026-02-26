import { Component, DOCUMENT, Inject, OnDestroy, OnInit } from '@angular/core';
import { UtilsService } from './auth/_service/utils.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from './auth/_service/auth-service';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-root',
	templateUrl: './app.html',
	standalone: false,
	styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy{
	// protected title = 'medicare-web-central-cmh';

	loginCustomLayout: any;
	themes: any[] = [];

	constructor(
		// private authService: AuthService,
		// private router: Router,
		// private cookieService: CookieService,
		private title: Title,
		private utilsService: UtilsService,
		@Inject(DOCUMENT) private document: Document,
		private http: HttpClient
	) { }

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
				this.loginCustomLayout
			);


			// favicon
			const faviconElement = this.document.getElementById('favicon');

			if (faviconElement) {
				faviconElement.setAttribute('href', this.loginCustomLayout.favicon);
			}

			
			

			// favicon
			// this.document
			// 	.getElementById('favicon')
			// 	.setAttribute('href', this.loginCustomLayout.favicon);
		}

		if(this.loginCustomLayout?.theme){
			this.setTheme(this.loginCustomLayout?.theme)
		}
	}


	setTheme(theme: any) {
		document.documentElement.style.setProperty('--base-primary', theme.primaryColor);
		document.documentElement.style.setProperty('--base-secondary', theme.secondaryColor);
		document.documentElement.style.setProperty('--base-btn-text-color', theme.btnTextColor ? theme.btnTextColor : '#FFFFFF');
		document.documentElement.style.setProperty('--base-btn-hover-text-color', theme.btnHoverTextColor ? theme.btnHoverTextColor : '#FFFFFF');

		// document.documentElement.style.setProperty(
		// 	'--hoverColor',
		// 	theme.hoverColor
		// );
		// document.documentElement.style.setProperty(
		// 	'--hoverTextColor',
		// 	theme.hoverTextColor
		// );
		// document.documentElement.style.setProperty(
		// 	'--activeColor',
		// 	theme.activeColor
		// );
	}


	ngOnDestroy(){
		sessionStorage.removeItem('customCompanyInfo');
   }
}
