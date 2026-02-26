import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-web-cam',
  standalone: false,
  templateUrl: './web-cam.html',
  styleUrl: './web-cam.css'
})
export class WebCam implements OnInit {
  modalTitle: any = 'Capture a Image';

  onClose: Subject<string> = new Subject<string>();
  // latest snapshot
  public webcamImage: WebcamImage | null = null;
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId!: string;
  public videoOptions: MediaTrackConstraints = {
    width: { ideal: 350 }, //{ideal: 1024},
    height: { ideal: 360 } //{ideal: 576},
  };
  public errors: WebcamInitError[] = [];

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  constructor(
    public modalRef: BsModalRef
  ) { }

  public ngOnInit() {
    WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });

    console.log(this.errors);

  }

  //--------Webcam---------
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleImage(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    if (this.errors.length > 0) {
      console.log(this.errors);
    } else {
      this.webcamImage = webcamImage;
      this.onClose.next(webcamImage.imageAsDataUrl);
      this.showWebcam = false;
      this.modalRef.hide();
    }
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  // public get triggerObservable(): Observable<void> {
  //   return this.trigger.asObservable();
  // }

  // public get nextWebcamObservable(): Observable<boolean | string> {
  //   return this.nextWebcam.asObservable();
  // }
}
