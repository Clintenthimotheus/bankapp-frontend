import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {



  transform(type:any[],searchTerm:string,propsName:string): any[] {

    const result:any[]=[];

   if(!type||searchTerm==''||propsName==''){
    return type;
   }
   type.forEach((transactions:any)=>{
    if(transactions[propsName].trim().toLowerCase().includes(searchTerm.trim().toLowerCase()))
    result.push(transactions)
   })
   return result;
  }

}
