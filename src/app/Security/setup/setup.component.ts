import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css'],
  standalone: false,
})
export class SetupComponent implements OnInit {

  constructor() { }
  @ViewChild('tabset')
  tabset!: TabsetComponent;
  // tab
  tabs: any[] = [
    { title: 'Orgaization Setup', content: 'orgSetup', initiated: true, active: true },
    { title: 'Company setup', content: 'companySetup', initiated: false },
    { title: 'Module Setup', content: 'moduleSetup', initiated: false },
    { title: 'Features Setup', content: 'featureSetup', initiated: false },
    { title: 'Role Management', content: 'roleManagement', initiated: false },
    { title: 'Employee Management', content: 'employeeSetup', initiated: false },
    { title: 'User Management', content: 'userSetup', initiated: false },
    { title: 'Bank Info Setup', content: 'bankInfoSetup', initiated: false },
  ];
  ngOnInit() {

    $(document).ready(function () {
      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $($.fn.dataTable.tables(true)).css('width', '100%');
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust().draw();
      });
    });
  }
  onSelect(data: any): void {
    console.log('Selected Tabset tabs:', data);

  }
}
