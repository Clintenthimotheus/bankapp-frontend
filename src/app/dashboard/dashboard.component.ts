import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  deleteSuccessMsg:string='';

  deleteConfirmStatus:boolean=false //remove account
  acno:any//for parent to child data communication

  logoutSuccess:boolean=false

  transferSuccess: string = ''
  transferError: string = ''

  //to hold current user name
  user: string = ''; //to hold the current user name
  balance: any = ''; //to hold the current balance
  currentAcno: string = ''; //to hold the currentAcno


  //dependency injection
  constructor(private fb: FormBuilder, private api: ApiService ,private logoutRouter:Router) { }
  ngOnInit(): void {

    if(!localStorage.getItem("token")){
      alert("Please login")
      this.logoutRouter.navigateByUrl('')
 }

    if (localStorage.getItem('currentUser')) {
      this.user = localStorage.getItem('currentUser') || '';

    }
    // if(localStorage.getItem('balance')){
    //   this.balance=localStorage.getItem('balance')||'';
    // }
    if (localStorage.getItem('currentAcno')) {
      this.currentAcno = localStorage.getItem('currentAcno') || ''; //currentAcno
    }

  }
  //creating form group
  FundTransferForm = this.fb.group({



    //creating form array
    creditAcno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    password: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]]

  })

  isCollapse: boolean = false
  collapse() {
    this.isCollapse = !this.isCollapse
  }

  //fund transfer
  dashboardForm() {
    if (this.FundTransferForm.valid) {

      let creditAcno = this.FundTransferForm.value.creditAcno;
      let password = this.FundTransferForm.value.password;
      let amount = this.FundTransferForm.value.amount;
      this.api.fundTransfer(creditAcno, password, amount).subscribe((result: any) => {
        console.log(result);
        this.transferSuccess = result.message
       //reset
          setTimeout(()=>{
            this.transferSuccess=''
            this.FundTransferForm.reset()
          },2000)


      },
        (result: any) => {
          console.log(result.error.message);
          this.transferError = result.error.message

        })


      // alert('Form clicked')
    }
    else {
      alert('please enter valid parameters')
    }
    //reset transfer form
    this.FundTransferForm.reset();

  }

 


  getBalance() {
    this.api.getBalance(this.currentAcno).subscribe((result: any) => {
      this.balance = result.balance
    },
      (result: any) => {
        alert(result.error.message)
      })
  }

  
  reset() {
    this.FundTransferForm.reset()

  }
  close() {

  }
  logout(){
    this.logoutSuccess=true
   
     setTimeout(()=>{
      
      this.logoutRouter.navigateByUrl('')
      localStorage.clear()
     
     },2000)
  }

  deleteAccount(){
    //data to be shared with the child
    this.acno=localStorage.getItem('currentAcno') //1
    this.deleteConfirmStatus=true
  }

  cancelDeleteConfirm(){
    this.acno=''
    this.deleteConfirmStatus=false
  }
  deleteFromParent(){
    this.api.deleteAccount().subscribe((result:any)=>{
      localStorage.clear() //remove all the account details from local storage
      this.deleteSuccessMsg=result.message //account delete successfully
      setTimeout(()=>{
        this.logoutRouter.navigateByUrl('') //redirect back to login page

      },3000)
    })
  }
}
