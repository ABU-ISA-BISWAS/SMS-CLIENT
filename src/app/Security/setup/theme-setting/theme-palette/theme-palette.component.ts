import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-theme-palette',
  templateUrl: './theme-palette.component.html',
  styleUrls: ['./theme-palette.component.css'],
  standalone: false,
})
export class ThemePaletteComponent implements OnInit {
  themes: any[] = [];
  selectedTheme: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // this.getThemes();
    this.loadThemes().subscribe((data: any[]) => {
      this.themes = data;

      const themeLocal = this.getItem('themeLocal');
      if (themeLocal) {
        this.selectedTheme = themeLocal;
        this.setTheme(themeLocal);
      } else if (this.themes.length) {
        this.setTheme(this.themes[0]);
      }
    });
  }

  loadThemes(): Observable<any[]> {
    return this.http.get<any[]>('assets/json/themes.json');
  }

  setTheme(theme: any) {
    const themeLocal = {
      id: theme.id,
      textColor: theme.textColor,
      bgColor: theme.bgColor,
      hoverColor: theme.hoverColor,
      hoverTextColor: theme.hoverTextColor,
      activeColor: theme.activeColor,
    };

    this.selectedTheme = theme;

    document.documentElement.style.setProperty('--textColor', theme.textColor);
    document.documentElement.style.setProperty('--base-primary', theme.bgColor);
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

    const clickSound = new Audio('assets/audio/charming-twinkle.mp3');
    clickSound.play();

    this.setItem('themeLocal', JSON.stringify(themeLocal));
  }

  getItem(key: string): any | null {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
