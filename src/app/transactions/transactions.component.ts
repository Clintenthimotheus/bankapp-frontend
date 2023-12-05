import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import jspdf from 'jspdf';
import 'jspdf-autotable'

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  searchkey:string='' //to hold the search values
transactions:any=[];
 constructor(private api:ApiService){}

  ngOnInit(): void {
    this.api.transactionHistory().subscribe((result:any)=>{
      console.log(result); //array of transcations
      this.transactions=result.transactions
      console.log(this.transactions);
      
      
    },
    (result:any)=>{
      console.log(result.error.message);
      
    })

  }
  // search(event:any){
  //   console.log(event.target.value);
  //   this.searchkey=event.target.value
  // }


  //generate pdf
  generatePdf(){
    //1 create an object for jspdf

    var pdf= new jspdf();

    //2 setup row for the table
    let thead =['Type','From Account','To Account','Amount']
    let tbody =[]

    //3 setup properties for the table
    pdf.setFontSize(16)
    pdf.text('Mini statements',15,10)


    //4.To display as table ,we need to convert array of object into  nested array
    for(let item of this.transactions){
      let temp =[item.type,item.fromAcno,item.toAcno,item.amount] //nest arrray [[] [] [] []]
        tbody.push (temp)
    }
    //5. Convert nested array into table structure using jspdf-autotable
    (pdf as any ).autoTable(thead,tbody)

    //6.To open pdf in another tab
    pdf.output('dataurlnewwindow')

    //7/To download/ save pdf
    pdf.save('transactionHistory.pdf')

  }


}
