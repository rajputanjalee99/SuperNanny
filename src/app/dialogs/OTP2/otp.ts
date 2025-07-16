import { Component, Inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { HttpService } from "src/app/services/http/http.service";

@Component({
    selector: "otp",
    templateUrl: "./otp.html",
    styleUrls: ["./otp.scss"]
})
export class OTPDialog {

    otp: string = "";
    text1: string = "";
    text2: string = "";
    text3: string = "";
    text4: string = "";
    _id: string = ""
    canResend: boolean = false;

    mins: number = 2;
    seconds: number = 0;

    interValId: any;

    constructor(
        public dialogRef: MatDialogRef<OTPDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private sanitizer: DomSanitizer,
        private service: HttpService,
        private fb: FormBuilder) {
        console.log(data);

        if (data._id) {
            this._id = data._id;
        }

        this.setInterval();

    }

    setInterval(): void {
        this.mins = 2;
        this.seconds = 0;
        this.canResend = false
        const self = this;
        this.interValId = setInterval(function () {

            if (self.seconds == 0) {
                if (self.mins == 0) {
                    self.canResend = true
                    self.clearInterVal();
                } else {
                    self.mins = self.mins - 1;
                    self.seconds = 60;
                }
            }
            --self.seconds
        }, 1000)
    }

    clearInterVal(): void {

        clearInterval(this.interValId);
        setTimeout(() => {
            this.mins = 0;
            this.seconds = 0;
        }, 50)

    }

    keytab(event: any) {
        let nextInput = event.srcElement.nextElementSibling;
        if (nextInput == null)
            return;
        else
            nextInput.focus();
    }

    resend(): boolean {

        if (!this.canResend) {
            return false;
        }

        if (this.data.type == "register") {

            this.service.sendRegisterOTP({
                phone: this.data.phone
            }).subscribe((resp: any) => {
                this._id = resp._id;
                this.service.showSuccessMessage({
                    message: "OTP resent to mobile number"
                })
                this.setInterval();
            })

        } else if (this.data.type == "checkout") {
            this.service.sendCODOTP({

            }).subscribe((resp: any) => {
                this.service.showSuccessMessage({
                    message: "OTP resent to mobile number"
                })
                this._id = resp._id;
                this.setInterval();
            })

        } else if (this.data.type == "login") {
            this.service.sendLoginOTP({
                phone: this.data.phone,
                login_type: this.data.login_type
            }).subscribe((resp: any) => {
                this.service.showSuccessMessage({
                    message: "OTP resent to mobile number"
                })
                this._id = resp._id;
                this.setInterval();
            })
        }

        return true;

    }



    submit(): void {

        this.otp = this.text1 + this.text2 + this.text3 + this.text4
        if (this.otp.length == 4) {
            this.dialogRef.close({
                otp: this.otp,
                _id: this._id
            })
        } else {
            this.service.showErrorMessage({
                message: "Please enter 4 digits"
            })
        }


    }




}
