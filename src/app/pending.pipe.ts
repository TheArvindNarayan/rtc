import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pending'
})
export class PendingPipe implements PipeTransform {
  transform(items: any, showPending: any): any {
    if (items) {
      if (showPending) {
        let res =  items.filter(
           (item) => item.status === 'pending'
         );
         return res;
       } else if(!showPending) {
         let res =  items.filter(
           (item) => item.status === 'reviewed'
         );
         return res;
       }
    } else {
      return items;
    }
  }
}
