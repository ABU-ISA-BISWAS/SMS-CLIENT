import { Component, OnInit, ViewChild } from '@angular/core';
import { AddModuleComponent } from './add-module/add-module.component';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ModuleService } from '../../_coreSecurity/services/module.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css'],
  standalone: false
})
export class ModulesComponent implements OnInit {

  bsModalRef!: BsModalRef;
  @ViewChild('modGrid')
  modGrid!: { nativeElement: any; };
  modTable: any;
  modTableObj!: { draw: () => void; };
  selectedMod: any;
  // companyList:any;

  constructor(private modalService: BsModalService,
    private authService: AuthService,
    private moduleService: ModuleService,
    private toastr: ToastrService) { }

  ngOnInit() {
    // this.getCompanyList();
  }

  ngAfterViewInit() {
    this.initModGrid()
  }

  addModule() {
    const initialState = {
      title: "Add Module",
      // companyList:this.companyList
    }
    this.bsModalRef = this.modalService.show(AddModuleComponent, { class: 'modal-md base-modal', initialState, backdrop: 'static' });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result == true) {
        this.modTableObj.draw();
      }
    });
  }
  editModule() {
    if (this.selectedMod) {
      const initialState = {
        title: "Edit Module",
        sendModule: this.selectedMod,
        // companyList:this.companyList
      }
      this.bsModalRef = this.modalService.show(AddModuleComponent, { class: 'modal-md base-modal', initialState, backdrop: 'static' });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          this.modTableObj.draw();
          this.selectedMod = null;
        }
      });
    } else {
      this.toastr.warning("Please select a Module to Edit");
    }
  }
  deleteModule(): void {
    if (this.selectedMod) {
      const initialState = {
        title: "Do you want to Delete?",
      };
      this.bsModalRef = this.modalService.show(ConfirmationDialog, { initialState, class: '' });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          this.moduleService.deleteModule(this.selectedMod).subscribe(res => {
            res.success ? this.toastr.success(res.message) : this.toastr.warning(res.message);
            this.modTableObj.draw();
          })
        }
      })
    } else {
      this.toastr.warning("Please select a Module");
    }
  }

  // Data Grid
  initModGrid() {
    let that = this;
    this.modTable = $(this.modGrid.nativeElement);
    this.modTableObj = this.modTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: {
        url: environment.baseUrl + environment.authApiUrl + '/api/module/gridList',
        type: "GET",
        beforeSend: function (xhr: { setRequestHeader: (arg0: string, arg1: string) => void; }) {
          xhr.setRequestHeader('Authorization', "bearer " + that.authService.getAccessToken());
          xhr.setRequestHeader('Content-Type', "application/json");
        },
        dataSrc: function (response: { draw: any; obj: { draw: any; recordsTotal: any; recordsFiltered: any; data: any; }; recordsTotal: any; recordsFiltered: any; }) {
          response.draw = response.obj.draw;
          response.recordsTotal = response.obj.recordsTotal;
          response.recordsFiltered = response.obj.recordsFiltered;
          return response.obj.data;
        },
        error: function (request: { responseText: any; }) {
          console.log("Data Grid Rendering Error", request.responseText);
        }
      },
      order: [[1, "desc"]],
      columns: [
        {
          title: 'Module No.',
          data: 'id',
          className: 'dt-left'
        }, {
          title: 'Module Name',
          data: 'menuName',
          name: 'menuName'
        }, {
          title: 'Module Code',
          data: 'menuId',
        }, {
          title: 'Status',
          data: 'activeStatus',
          render: (data: number) => {
            return data == 1 ? "Active" : "Inactive"
          }
        }
      ],
      select: true,
      responsive: true,
      autoWidth: true,
      rowCallback: (row: Node, data: any[] | Object) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          self.selectedMod = data;
          console.log("Selected Module ", self.selectedMod);
          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');

          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');

          }
        });
        return row;
      },

    })
  }

}
