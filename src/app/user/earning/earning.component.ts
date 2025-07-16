import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { throws } from 'assert';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-earning',
  templateUrl: './earning.component.html',
  styleUrls: ['./earning.component.scss']
})
export class EarningComponent implements OnInit {
  title= "Earnings"
  earing_data:any=[]=[];
  payment_data:any[]=[];
  id:any;

  addBankAccount!:FormGroup;
  editBankAccount!:FormGroup;
  bank_account_details:any;
  deleteID: any = '';
  @ViewChild('refModal', { static: true })
  myModal!: ElementRef<any>; 
  @ViewChild('refModal2', { static: true })
  myModal12!: ElementRef<any>; 
  constructor(private service : HttpService,private fb:FormBuilder) { 
    this.addBankAccount = this.fb.group({
     account_number:['',Validators.required],
     bank_name:['',Validators.required],
     bank_holder_name:['',Validators.required],
     ifsc_code:['',Validators.compose([Validators.required,Validators.maxLength(11),Validators.minLength(11)])],
     account_type:['',Validators.required],
    })

    this.editBankAccount = this.fb.group({
      account_number:['',Validators.required],
      bank_name:['',Validators.required],
      bank_holder_name:['',Validators.required],
      ifsc_code:['',Validators.compose([Validators.required,Validators.maxLength(11),Validators.minLength(11)])],
      account_type:['',Validators.required],
     })
  }

  ngOnInit(): void {
    this.getEarning();
    this.getPayment();
    this.getBankAccountList();
  }

  getEarning() : void {
    this.service.getEarning().subscribe((resp:any) => {
     console.log("earning", resp)
     this.earing_data = resp;
    }) 
  }

  fixNumber(amount:any ){
    if(amount){
      return amount.toFixed(2);
    }
    
  }

  getPayment(){
    this.service.getPayment().subscribe((resp:any) => {
      console.log("getPayment", resp)
      this.payment_data = resp?.result;
     }) 
  }

  getBankAccountList(){

    this.service.getBankAccountList().subscribe((resp:any) => {
      console.log("resp get bankaccount",resp);
      if(resp?.code === 200){
      this.bank_account_details=resp?.result;
      this.id = resp?.result?._id;
      this.editBankAccount.get('account_number')?.setValue(resp?.result?.account_number);
      this.editBankAccount.get('bank_name')?.setValue(resp?.result?.bank_name);
      this.editBankAccount.get('bank_holder_name')?.setValue(resp?.result?.account_holder_name);
      this.editBankAccount.get('ifsc_code')?.setValue(resp?.result?.ifsc_code);
      this.editBankAccount.get('account_type')?.setValue(resp?.result?.account_type);
      }
    },(error:HttpErrorResponse) => {
      this.service.showErrorMessage({
        message:error?.error?.errors?.msg
      })
    })
  }

  deleteBankAccount(){
   if(this.deleteID !== ''){
     this.service.deleteBankAccount(this.deleteID).subscribe((resp:any) => {
      console.log("delete respond",resp)
     })
   }
   else{
    this.service.showErrorMessage({
      message:"Id is Empty"
    })
   } 
  }

  getID(id:any){
    this.deleteID = id;

  }

  saveAdd(){

    if(this.addBankAccount.invalid){
     this.addBankAccount.markAllAsTouched();
    }
    else{
      let obj = {
        account_number:this.addBankAccount?.get('account_number')?.value,
        bank_name:this.addBankAccount?.get('bank_name')?.value,
        account_holder_name:this.addBankAccount?.get('bank_holder_name')?.value,
        account_type:this.addBankAccount?.get('account_type')?.value,
        ifsc_code:this.addBankAccount?.get('ifsc_code')?.value,
        role:'supervisor'
      }

      this.service.addBankAccount(obj).subscribe((resp:any) => {
         console.log("resp add ",resp)
         if(resp?.code === 200){
          this.service.showSuccessMessage({
            message:"Bank Account Added Successfully"
          })
          this.ngOnInit();
        }
        }
        ,(error:HttpErrorResponse) => {
          this.service.showErrorMessage({
            message:error?.error?.errors?.msg
          })
        })
        this.myModal12.nativeElement.click()
    }

  }
  getAmount(data:any){
return data?.toFixed(2)
  }

  saveEdit(){
    
    if(this.editBankAccount.invalid){
      this.editBankAccount.markAllAsTouched();
     }
     else{
       let obj = {
         id:this.id,
         account_number:this.editBankAccount?.get('account_number')?.value,
         bank_name:this.editBankAccount?.get('bank_name')?.value,
         account_holder_name:this.editBankAccount?.get('bank_holder_name')?.value,
         account_type:this.editBankAccount?.get('account_type')?.value,
         ifsc_code:this.editBankAccount?.get('ifsc_code')?.value,
         role:'supervisor'
       }
 
       this.service.editBankAccount(obj).subscribe((resp:any) => {
          console.log("resp",resp)
          if(resp?.code === 200){
          this.service.showSuccessMessage({
            message:"Bank Account Editted Successfully"
          })
          
          this.ngOnInit();
        }
       },(error:HttpErrorResponse) => {
        this.service.showErrorMessage({
          message:error?.error?.errors?.msg
        })
      })
      this.myModal.nativeElement.click()
      
     }

  }

}
