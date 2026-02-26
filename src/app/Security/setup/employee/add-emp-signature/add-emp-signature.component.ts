import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { EmployeeService } from '../../../_coreSecurity/services/employee.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-emp-signature',
  templateUrl: './add-emp-signature.component.html',
  styleUrls: ['./add-emp-signature.component.css'],
  standalone: false,
})
export class AddEmpSignatureComponent implements OnInit {

  profileImgURL: any;
  imageErrorMessage!: string;
  file!: File;
  isValidMessage: boolean = true;
  employeeObj: any = {};
  isSaving: boolean = false;


  constructor(
    public bsModalRef: BsModalRef,
    private toast: ToastrService,
    private employeeService: EmployeeService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getEmployeeSignature();
  }

  onSubmit(): void {
    this.isSaving = true;
    if (!this.file) {
      this.isSaving = false;
      this.isValidMessage = false;
      this.toast.warning('', 'Please select a signature first.');
      return;
    }

    this.employeeService.addEmpSignature(this.employeeObj, this.file).pipe(
      finalize(() => {
        this.isSaving = false;
      })
    ).subscribe({
      next: (res: any) => {
        console.log('Signature upload response:', res);
        if (res.success) {
          this.toast.success('', res.message || 'Signature uploaded successfully!');
          this.bsModalRef.hide();
        } else {
          this.toast.warning('', res.message || 'Failed to upload signature.');
        }
      },
      error: (err) => {
        console.error('Error uploading signature:', err);
        this.toast.error('', 'Something went wrong while uploading the signature. Please check your connection or try again.');
      }
    });
  }

  processFile(files: any) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.imageErrorMessage = "Only image are Supported.";
      return;
    }

    this.file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.profileImgURL = reader.result;
    }
  }

  getEmployeeSignature() {
    this.employeeService.getEmployeeSignature(this.employeeObj).subscribe(
      (res: any) => {
        console.log(res);

        if (res.success && res.obj && typeof res.obj === 'string') {
          const base64 = res.obj.trim();


          const isBase64 = /^[0-9a-zA-Z+/]+={0,2}$/.test(base64);

          if (isBase64) {
            const mimeType = this.detectMimeTypeFromBase64(base64) || 'image/jpeg';

            this.profileImgURL = this.sanitizer.bypassSecurityTrustResourceUrl(
              `data:${mimeType};base64,${base64}`
            );
          } else {
            this.profileImgURL = null;
            console.warn("Invalid base64 image data received.");
          }
        } else {
          this.profileImgURL = null;
          console.warn("No image data found.");
        }
      },
      (err: any) => {
        console.error("Error fetching employee signature: ", err);
        this.profileImgURL = null;
      }
    );
  }



  private detectMimeTypeFromBase64(base64: string): string | null {

    try {
      const byteCharacters = atob(base64.substring(0, 20));
      const bytes = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        bytes[i] = byteCharacters.charCodeAt(i);
      }

      if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
        return 'image/png';
      } else if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
        return 'image/jpeg';
      } else if (
        bytes[0] === 0x47 && bytes[1] === 0x49 &&
        bytes[2] === 0x46 && bytes[3] === 0x38
      ) {
        return 'image/gif';
      }
    } catch (e) {
      console.warn("Unable to decode base64 for MIME type detection");
    }

    return null;
  }

}
