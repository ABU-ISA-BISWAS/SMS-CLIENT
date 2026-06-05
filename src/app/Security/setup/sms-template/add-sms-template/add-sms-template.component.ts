import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SmsTemplate } from '../../../_coreSecurity/models/sms-template.model';
import { SmsTemplateService } from '../../../_coreSecurity/services/sms-template.service';

@Component({
  selector: 'app-add-sms-template',
  templateUrl: './add-sms-template.component.html',
  styleUrls: ['./add-sms-template.component.css'],
  standalone: false,
})
export class AddSmsTemplateComponent implements OnInit {
  template: SmsTemplate = new SmsTemplate();
  onClose!: Subject<boolean>;
  title = '';
  isSaving: boolean = false;

  templateTypes = [
    { value: 'ADMISSION', label: 'Admission' },
    { value: 'FEE_DUE', label: 'Fee Due Reminder' },
    { value: 'FEE_PAID', label: 'Fee Payment Confirmation' },
    { value: 'ATTENDANCE', label: 'Attendance / Absent' },
    { value: 'EXAM_RESULT', label: 'Exam Result' },
    { value: 'EXAM_SCHEDULE', label: 'Exam Schedule' },
    { value: 'GENERAL', label: 'General Notice' },
    { value: 'EMERGENCY', label: 'Emergency' },
  ];

  availablePlaceholders = [
    '{STUDENT_NAME}',
    '{CLASS_NAME}',
    '{SECTION_NAME}',
    '{AMOUNT}',
    '{DUE_DATE}',
    '{DATE}',
    '{RECEIPT_NO}',
    '{EXAM_NAME}',
    '{START_DATE}',
    '{GPA}',
    '{ADMISSION_NO}',
    '{SCHOOL_NAME}',
  ];

  constructor(
    public bsModalRef: BsModalRef,
    private smsTemplateService: SmsTemplateService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
    if (!this.template.id) {
      this.template.activeStatus = 1;
    }
  }

  insertPlaceholder(placeholder: string) {
    this.template.templateBody =
      (this.template.templateBody || '') + placeholder;
  }

  saveTemplate() {
    this.isSaving = true;
    this.toggleValue(this.template);

    if (!this.checkValidation()) {
      this.isSaving = false;
      return;
    }

    const req$ = this.template.id
      ? this.smsTemplateService.update(this.template)
      : this.smsTemplateService.save(this.template);

    req$.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success(res.message || 'Template saved successfully!');
          this.onClose.next(true);
          this.bsModalRef.hide();
        } else {
          this.toastr.warning(res.message || 'Operation failed.');
          this.onClose.next(false);
        }
      },
      error: () => {
        this.toastr.error('Something went wrong. Please try again.');
        this.onClose.next(false);
      },
    });
  }

  checkValidation(): boolean {
    if (!this.template.templateCode) {
      this.toastr.warning("Template Code can't be empty!");
      return false;
    }
    if (!this.template.templateName) {
      this.toastr.warning("Template Name can't be empty!");
      return false;
    }
    if (!this.template.templateType) {
      this.toastr.warning("Template Type can't be empty!");
      return false;
    }
    if (!this.template.templateBody) {
      this.toastr.warning("Template Body can't be empty!");
      return false;
    }
    if (this.template.templateBody.length > 500) {
      this.toastr.warning('Template Body cannot exceed 500 characters!');
      return false;
    }
    return true;
  }

  toggleValue(obj: any) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === true) obj[key] = 1;
      if (obj[key] === false) obj[key] = 0;
    });
  }

  get charCount(): number {
    return (this.template.templateBody || '').length;
  }
}
