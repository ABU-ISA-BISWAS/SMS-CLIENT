import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../../auth/_service/auth-service';

@Component({
  selector: 'app-top-nav',
  standalone: false,
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.css',
})
export class TopNav {
  @Output() toggleSidebar = new EventEmitter<void>();

  userName: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
    console.log('top nav emit');
  }

  logout() {
    this.authService.logout();
  }

  getUserDetails() {
    const userDetails = localStorage.getItem('userInfo');

    if (userDetails) {
      const user = JSON.parse(userDetails);
      this.userName = user.userName;
    }
  }
}
