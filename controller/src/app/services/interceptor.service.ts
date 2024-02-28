import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { Destination } from '../enums/hosts';
import { $ENV } from 'typings';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  hostname: string;
  agentPort: string;
  lifecycleAPIPort: string;
  formattedAgentUrl: string;
  formattedLifecycleApiUrl: string;
  AUTH_HEADER: string = 'Bearer Token';

  constructor() {
    // TODO fix $ENV name not found
    // this.hostname = $ENV.DAO_AGENT_HOST || 'localhost';
    // this.agentPort = $ENV.RUNMODE === 'pwd' ? '' : ':8031';
    // TODO prod config and dev config
    this.hostname = 'localhost';
    this.agentPort = '8038';
    this.lifecycleAPIPort = '8000';
    this.formattedAgentUrl = `http://${this.hostname}:${this.agentPort}`;
    this.formattedLifecycleApiUrl = `http://localhost:${this.lifecycleAPIPort}`;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const endpoint = req.url.split('/');
    const portVar = endpoint.shift();
    const reqEndpoint = endpoint.join('/');
    var hostAndPortUrl: string = '';
    if (portVar?.includes(Destination.AGENT))
      hostAndPortUrl = this.formattedAgentUrl;
    if (portVar?.includes(Destination.LIFECYCLE_API)) {
      const hasJWT = !!localStorage.getItem(this.AUTH_HEADER);
      const hasHeader = req.headers.has('Authorization');
      hostAndPortUrl = this.formattedLifecycleApiUrl;
      if (!hasHeader) {
        req = req.clone({
          setHeaders: {
            Authorization: localStorage.getItem(this.AUTH_HEADER) ?? '',
          },
        });
      }
    }

    const url = `${hostAndPortUrl}/${reqEndpoint}`;
    
    req = req.clone({
      url: url,
    });
    return next.handle(req);
  }
}
