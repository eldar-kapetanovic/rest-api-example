import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Observable, from } from 'rxjs';
import { mergeMap, tap, catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    authService: AuthService;
    matSnackBar: MatSnackBar;

    constructor(private injector: Injector) { }

    addAuthHeader(request: HttpRequest<any>): Promise<HttpRequest<any>> {
        return this.authService.getToken()
            .then(
                (token: string) => {
                    return request.clone({
                        params: request.params.append('auth', token)
                    });
                }
            )
            .catch(
                () => {
                    return request;
                }
            );
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        this.authService = this.injector.get(AuthService);
        this.matSnackBar = this.injector.get(MatSnackBar);
        if (req.method !== 'GET') {
            return from(this.addAuthHeader(req))
                .pipe(
                    mergeMap(
                        (request: HttpRequest<any>) => {
                            return next.handle(request)
                                .pipe(
                                    tap(
                                        (response: any) => {
                                            return response;
                                        }
                                    ),
                                    catchError(
                                        (error: any) => {
                                            if (error instanceof HttpErrorResponse) {
                                                this.matSnackBar.open(error.error, 'Close', {
                                                    duration: 5000,
                                                });
                                            }
                                            return error;
                                        }
                                    )
                                );
                        }
                    )
                );
        } else {
            return next.handle(req);
        }
    }
}
