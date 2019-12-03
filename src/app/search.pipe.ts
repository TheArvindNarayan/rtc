import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  constructor(private router: Router,
  private notify: ToastrService) {}

  transform(results: any, term: string): any {
    if (!term) {
      return results;
    } else {
      let localTerm;
      localTerm = term.toLowerCase();
      let currentRoute = this.router.url;
      if (currentRoute.includes('coaches') ) {
        if (results.length < 1) {
          this.notify.warning('No Results Available');
          return;
        }
        let temp =  results.filter(
          (result) => {
            if (result.user_profile.name && result.country && result.country_name ) {
              return result.user_profile.name.toLowerCase().includes(localTerm) ||
              result.country.toLowerCase().includes(localTerm) ||
              result.country_name.toLowerCase().includes(localTerm);
            } else {
              return;
            }
          }
        );
        if (temp.length < 1) {
          this.notify.warning('No Results Available');
          return;
        }
        return temp;
      } else if (currentRoute.includes('player') && !currentRoute.includes('paymentsummary')) {
        let temp =  results.filter(
          (result) => {
            if (!result['user_profile']['name']) {
              return;
            }
            return result['user_profile']['name'].toLowerCase().includes(localTerm);
            });
            if (temp.length < 1) {
              this.notify.warning('No Results Available');
              return;
            }
            return temp;
      } else if (currentRoute.includes('videos') || currentRoute.includes('inbox')) {
        if (results.length < 1) {
          this.notify.warning('No Results Available');
          return;
        }
        let temp =  results.filter(
          (result) => {
            if (!result.title) {
              return;
            }
            return result.title.toLowerCase().includes(localTerm);
          }
        );
        if (temp.length < 1) {
          this.notify.warning('No Results Available');
          return;
        }
        return temp;
      } else if (currentRoute.includes('paymentsummary') && currentRoute.includes('player')) {
        return results.filter((result) => {
          return result['coach']['name'].toLowerCase().includes(localTerm) || result['post']['title'].toLowerCase().includes(localTerm);
        });
      } else if (currentRoute.includes('paymentsummary') && currentRoute.includes('coach')) {
        return results.filter((result) => {
          return result['player']['name'].toLowerCase().includes(localTerm) || result['post']['title'].toLowerCase().includes(localTerm);
        });
      } else {
        // console.log(localTerm);
        return results;
      }
    }
  }

}