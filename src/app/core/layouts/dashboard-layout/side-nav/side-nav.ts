import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  standalone: false,
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css'
})
export class SideNav implements OnInit {
  @Input() isCollapse: boolean = false;
  @Output() toggleCollapse = new EventEmitter<void>();


  constructor() { }

  ngOnInit(): void {
    // You can add logic here if needed when the sidebar initializes
  }


  onToggleSidebar() {
    this.toggleCollapse.emit();
  }
}
