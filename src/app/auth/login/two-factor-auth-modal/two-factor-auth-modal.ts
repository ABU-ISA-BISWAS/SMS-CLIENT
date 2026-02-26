import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-two-factor-auth-modal',
  standalone: false,
  templateUrl: './two-factor-auth-modal.html',
  styleUrl: './two-factor-auth-modal.css'
})

export class TwoFactorAuthModal {
  otp: string[] = ['', '', '', '', '', ''];

  constructor(public bsModalRef: BsModalRef) {} // Inject BsModalRef for modal actions

  // Method to handle OTP input changes
  onOtpInputChange(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Ensure only one digit is entered
    if (value.length > 1) {
      value = value.charAt(0);
      input.value = value;
    }
    console.log
    this.otp[index] = value;

    // Auto-focus to next input if a digit is entered and it's not the last input
    if (value && index < this.otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  // Method to handle backspace/delete
  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      if (!this.otp[index] && index > 0) {
        // If current input is empty, move focus to previous and clear it
        const prevInput = document.getElementById(`otp-input-${index - 1}`) as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
          this.otp[index - 1] = ''; // Clear previous input's value
        }
      }
      this.otp[index] = ''; // Clear current input's value on backspace/delete
    } else if (event.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    } else if (event.key === 'ArrowRight' && index < this.otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  // Handle paste event for OTP
  onPaste(event: ClipboardEvent) {
    event.preventDefault(); // Prevent default paste behavior
    const pasteData = event.clipboardData?.getData('text').trim();

    if (pasteData) {
      for (let i = 0; i < this.otp.length; i++) {
        if (pasteData[i]) {
          this.otp[i] = pasteData[i];
          const input = document.getElementById(`otp-input-${i}`) as HTMLInputElement;
          if (input) {
            input.value = pasteData[i];
          }
        } else {
          this.otp[i] = ''; // Clear remaining if paste data is shorter
          const input = document.getElementById(`otp-input-${i}`) as HTMLInputElement;
          if (input) {
            input.value = '';
          }
        }
      }
      // Focus on the last filled input or the first empty one
      const firstEmptyIndex = this.otp.findIndex(digit => !digit);
      const focusIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : this.otp.length - 1;
      const targetInput = document.getElementById(`otp-input-${focusIndex}`) as HTMLInputElement;
      if (targetInput) {
        targetInput.focus();
      }
    }
  }

  // Placeholder for actual verification logic
  verifyAndContinue() {
    const fullOtp = this.otp.join('');
    console.log('Verifying OTP:', fullOtp);
    // Here you would typically send the OTP to your backend
    // On successful verification, you might close the modal:
    // this.bsModalRef.hide();
  }

  goBack() {
    console.log('Going back...');
    this.bsModalRef.hide(); // Close the modal
  }

  resendCode() {
    console.log('Resending code...');
    // Implement logic to resend the code
  }

  tryAnotherWay() {
    console.log('Trying another way...');
    // Implement logic for alternative verification methods
  }
}