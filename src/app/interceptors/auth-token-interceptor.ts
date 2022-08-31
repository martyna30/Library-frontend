import {HttpInterceptor} from '@angular/common/http';
import {Injectable, Injector } from '@angular/core';
import {HttpService} from '../../services/http.service';

import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  // tslint:disable-next-line:no-shadowed-variable
  constructor(private injector: Injector) {
  }

  // tslint:disable-next-line:typedef
  intercept(req, next) {
    const httpService = this.injector.get(HttpService);
    /// const accessToken = httpService.getAccessToken();
    const isTokenExpired = httpService.isTokenExpired();
    if (!isTokenExpired) {
      return next.handle(req);
    }
  }
}
/*else {
       const httpServic = this.injector.get(HttpService);
       // tslint:disable-next-line:no-shadowed-variable
       const tokenrequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${httpServic.getAccessToken()}`
        }
      });
       return next.handle(tokenrequest);
    }
  }
}*/




