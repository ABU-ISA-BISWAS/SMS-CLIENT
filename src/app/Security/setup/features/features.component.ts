import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddFeatureComponent } from './add-feature/add-feature.component';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ModuleService } from '../../_coreSecurity/services/module.service';
import { FeatureService } from '../../_coreSecurity/services/feature.service';
import { ToastrService } from 'ngx-toastr';
import { FeatureModel } from '../../_coreSecurity/models/feature.model';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css'],
  standalone: false,

})
export class FeaturesComponent implements OnInit {

  bsModalRef!: BsModalRef;
  featureTable: any;
  featureTableObj: any;
  selectedFeature!: any;
  selectedFeatureId!: number;
  @ViewChild('featureGrid')
  featureGrid!: { nativeElement: any; };
  sendSubmoduleList: any;
  activeInactiveFlag: string | null = 'A';
  hiddenNotHiddenFlag!: string | null;
  disableButton: string = "Disable";

  constructor(private modalService: BsModalService,
    private authService: AuthService,
    private moduleService: ModuleService,
    private featureService: FeatureService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.findSubmodules();
  }

  ngAfterViewInit(): void {
    this.initFeatureGrid()
  }

  addFeature() {
    const initialState = {
      title: "Add Features",
      parentModuleList: this.sendSubmoduleList
    }
    this.bsModalRef = this.modalService.show(AddFeatureComponent, { class: 'modal-md base-modal', initialState, backdrop: 'static' });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result == true) {
        this.featureTableObj.draw();
      }
    });
  }
  editFeature() {
    if (!this.selectedFeature) {
      this.toastr.warning("Please select a record to Edit")
    }
    else {
      const initialState = {
        title: "Edit Features",
        parentModuleList: this.sendSubmoduleList,
        feature: this.selectedFeature
      }
      this.bsModalRef = this.modalService.show(AddFeatureComponent, { class: 'modal-md base-modal', initialState, backdrop: 'static' });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          this.featureTableObj.draw();
        }
      });
    }
  }
  // deleteFeature(): void {
  //   if (!this.selectedFeature) {
  //     this.toastr.warning("Please select a record to Delete")
  //   }
  //   else {
  //     const initialState = { title: "Do you want to Delete?" };
  //     this.bsModalRef = this.modalService.show(ConfirmationDialog, { initialState, class: 'modal-sm base-modal' });
  //     this.bsModalRef.content.onClose.subscribe((result: any) => {
  //       if (result) {
  //         this.featureService.deleteFeature(this.selectedFeature.id).subscribe((res: { message: string | undefined; }) => {
  //           res.message ? this.toastr.success(res.message) : this.toastr.warning(res.message);
  //           this.featureTableObj.draw();
  //         })
  //       }
  //     })
  //   }
  // }
  disableOrEnableFeature(): void {
    console.log("Selected feature from disabe enable:", this.selectedFeature);
    if (!this.selectedFeature) {
      this.toastr.warning("Please select a feature first.");

    } else {
      const initialState = {
        title: "Do you want to " + this.disableButton + " this Feature?"
      };
      this.bsModalRef = this.modalService.show(ConfirmationDialog, { initialState, class: '' });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          console.log("flag:", this.activeInactiveFlag);
          this.selectedFeature.activeStatus = this.activeInactiveFlag == 'I' ? 1 : 0;
          this.featureService.updateFeature(this.selectedFeature).subscribe((res: { message: string | undefined; }) => {
            console.log("reees:", res);
            res.message ? this.toastr.success(res.message) : this.toastr.warning(res.message);
            this.featureTableObj.draw();
          })
        }
      })
    }
  }

  findSubmodules() {
    return this.moduleService.findSubmodules().subscribe((res: { items: any; }) => {
      this.sendSubmoduleList = res.items;
    })
  }

  initFeatureGrid() {
    let that = this;
    this.featureTable = $(this.featureGrid?.nativeElement);
    this.featureTableObj = this.featureTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: {
        url: environment.baseUrl + environment.authApiUrl + '/api/features/gridList',
        type: "GET",
        data: function (d: any) {
          d.customSearch = d.search.value;
          d.activeInactiveFlag = that.activeInactiveFlag;
          d.hiddenNotHiddenFlag = that.hiddenNotHiddenFlag;
          return d;
        },

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
      order: [[0, "desc"]],
      columns: [
        {
          'visible': false,
          data: 'ssModifiedOn',
          name: 'ssModifiedOn'
        },
        {
          title: 'Feature No.',
          data: 'id',
          className: 'dt-left'
        }, {
          title: 'Feature Name',
          data: 'submenuName',
          name: 'submenuName'
        }, {
          title: 'Feature Code',
          data: 'submenuId',
        }, {
          title: 'Serial No',
          data: 'slNo',
          className: 'dt-left'
        }, {
          title: 'Status',
          data: 'activeStatus',
          render: (data: number) => {
            if (data == 1) {
              return '<span class="badge rounded-pill bg-success-subtle px-3 py-2 text-success">Active</span>';
            } else {
              return '<span class="badge rounded-pill bg-danger-subtle px-3 py-2 text-danger">Inactive</span>';
            }
          }
        }, {
          title: 'Hide Flag',
          data: 'hideFlag',
          render: (data: number) => {
            return data == 0 ? "Not Hidden" : "Hidden"
          }
        }
      ],
      select: true,
      responsive: true,
      autoWidth: true,
      rowCallback: (row: Node, data: any | Object) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          this.selectedFeature = data.id;

          if (self.selectedFeature) {
            self.selectedFeature = null;

          }
          self.selectedFeature = data;

          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');

          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');

          }
          this.featureService.getSingleFeature(data.id).subscribe((res: FeatureModel) => {
            this.selectedFeature = res;
          });
          console.log("Selected Feature ", this.selectedFeature);
        });
        return row;
      },
    })
  }

  statusCheck(status: string) {
    this.activeInactiveFlag = status;
    this.hiddenNotHiddenFlag = null;
    if (this.activeInactiveFlag == 'A') {
      this.disableButton = 'Disable';
    } else {
      this.disableButton = 'Enable';
    }
    this.featureTableObj.draw();
  }

  hiddenStatusCheck(status: string) {
    this.hiddenNotHiddenFlag = status;
    this.activeInactiveFlag = null;
    this.featureTableObj.draw();
  }

}
