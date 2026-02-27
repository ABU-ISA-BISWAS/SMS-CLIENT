import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../../auth/_service/utils.service';
import { NavigationService } from '../services/navigation.service';
import { NavItem } from './nav-item-model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  standalone: false,
})
export class NavigationComponent implements OnInit {
  appLogo: string = environment.appClientName.toLowerCase() + '.png';
  @Input() navData: NavItem[] = [];
  @Input() isCollapse: boolean = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  newNavItems: NavItem[] = [];
  navItems: NavItem[] = [];
  companyInfo: any;

  constructor(
    private navigationService: NavigationService,
    private utilsService: UtilsService,
  ) {}

  ngOnInit() {
    this.getCompany();
    $(document).ready(function () {
      $('#close-sidebar').click(function () {
        $('.page-wrapper').removeClass('toggled');
      });
      $('#show-sidebar').click(function () {
        $('.page-wrapper').addClass('toggled');
      });
    });

    this.getAuthMenuList();
  }

  getAuthMenuList() {
    this.navigationService.getAuthMenuList().subscribe(
      (resp) => {
        if (resp.success) {
          this.processMenuTree(resp.items);
          //console.log('Auth Menu List', resp);
        } else {
          console.log(resp.message);
        }
      },
      (err) => {
        console.log(err);
      },
    );
  }

  processMenuTree(menuList: any[]) {
    let roots: any[] = [];
    let nodes: any[] = [];
    let dispvaal: any[] = [];
    let j = 0;

    for (let i = 0; i < menuList.length; i++) {
      let menu = menuList[i];
      dispvaal[j] = menu.pageLink;
      j++;

      nodes[menu.childId] = {
        displayName: menu.displayValue,
        childId: menu.childId,
        route: menu.pageLink,
        iconName: menu.iconName,
        children: [],
      };

      if (menu.parentId === 0) {
        roots.push(nodes[menu.childId]);
      } else {
        if (!nodes[menu.parentId].children) {
          nodes[menu.parentId].children = [];
        }
        nodes[menu.parentId].children.push(nodes[menu.childId]);
      }
    }
    this.newNavItems = roots;
    // console.log('New Nav Menu Item : ', this.newNavItems);
  }

  onToggleSidebar() {
    this.toggleCollapse.emit();
  }

  async getCompany() {
    this.companyInfo = await this.utilsService.getCustomCompanyInfo();
  }
}
