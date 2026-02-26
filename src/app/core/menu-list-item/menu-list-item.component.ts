import { Component, OnInit, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.css'],
  standalone: false,
})
export class MenuListItemComponent implements OnInit, AfterViewInit {

  @Input() navItems: any[] = [];
  classList: any;

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {

    const dropdownButtons = document.getElementsByClassName('dropdown-btn');

    for (let i = 0; i < dropdownButtons.length; i++) {
      dropdownButtons[i].addEventListener('click', (event: any) => {
        const dropdownContent = event.target.nextElementSibling;

        dropdownButtons[i].classList.toggle('active');

        if (dropdownContent.style.display === 'block') {
          dropdownContent.style.display = 'none';
        } else {
          dropdownContent.style.display = 'block';
        }
      });
    }


    this.expandActiveDropdown();
  }

  private expandActiveDropdown(): void {
    const activeNavItems = document.querySelectorAll('.tab-pane a.activeNav');
    activeNavItems.forEach((item: any) => {
      const dropdownButton = item.closest('.dropdown-btn');
      if (dropdownButton) {
        dropdownButton.classList.add('active');
        const dropdownContainer = dropdownButton.nextElementSibling;
        if (dropdownContainer) {
          dropdownContainer.style.display = 'block';
        }
      }
    });
  }
}
