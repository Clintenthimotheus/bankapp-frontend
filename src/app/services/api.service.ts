import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const options = {
  headers: new HttpHeaders
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  //register api function
  register(username: any, acno: any, password: any) {
    const body = {
      username,
      acno,
      password
    }
    return this.http.post('http://localhost:5000/register', body)
  }


  //login api function
  login(acno: any, password: any) {


    const body = {
      acno,
      password
    }
    return this.http.post('http://localhost:5000/login', body)
  }

  // append token to the header
  appendToken() {
    //get token from local storage
    let token = localStorage.getItem('token')
    //create httpheader
    let headers = new HttpHeaders()

    if (token) {
      headers = headers.append('verify-token', token)
      options.headers = headers
    }
    return options
  }

  // balance api function
  getBalance(acno: any) {
    return this.http.get('http://localhost:5000/getbalance/' + acno, this.appendToken())
  }
  // fund transfer
  fundTransfer(toAcno: any, password: any, amount: any) {
    const body = {
      toAcno,
      password,
      amount
    }
    return this.http.post('http://localhost:5000/fundtransfer', body,this.appendToken())
  }

  //history
  transactionHistory(){
    return this.http.get('http://localhost:5000/transactions',this.appendToken())

  }
  // deleteAccount
  deleteAccount(){
    return this.http.delete('http://localhost:5000/deleteAccount',this.appendToken());
  }

}
