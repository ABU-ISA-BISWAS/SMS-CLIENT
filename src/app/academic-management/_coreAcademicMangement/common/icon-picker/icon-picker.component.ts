import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal'; 
import { Subject } from 'rxjs';

@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.css'],
  standalone:false
})
export class IconPickerComponent implements OnInit {

  @ViewChild('iconGrid') iconGrid!: { nativeElement: any; };
  iconTable: any;
  iconTableObj: any;
  selectedIcon!: Subject<string>;
  
  constructor(public iconModal: BsModalRef) { }

  ngOnInit() {
    this.initModGrid();
    this.selectedIcon = new Subject();
  }

  // Data Grid
  initModGrid() {
    this.iconTable = $(this.iconGrid.nativeElement);
    this.iconTableObj = this.iconTable.DataTable({
      // pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: false,

      ajax: {
        url: './assets/json/font-awesome.json',
        type: "GET",
        beforeSend: function (xhr: any) {
        },
        dataSrc: function (response: { draw: any; recordsTotal: any; recordsFiltered: any; data: any; }) {
          response.draw = response.draw;
          response.recordsTotal = response.recordsTotal;
          response.recordsFiltered = response.recordsFiltered;
          return response.data;
        },
        error: function (request: { responseText: any; }) {
          console.log("Data Grid Rendering Error", request.responseText);
        }
      },
      order: [[0, "asc"]],
      columns: [
        {
          title: 'Icon Name',
          data: 'iconKey'
        }, {
          title: 'Icon',
          data: 'iconValue',
          render: (data: string) => {
            return '<i class="'+data+' fa-2x"></i>';
          }
        }
      ],
      select: true,
      responsive: true,
      autoWidth: true,
      rowCallback: (row: Node, data: any) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          // send the selected icon to calling component
          // see feature setup component for example
          self.selectedIcon.next(data);
          this.iconModal.hide();
        });
        return row;
      },
    })
  }

}
