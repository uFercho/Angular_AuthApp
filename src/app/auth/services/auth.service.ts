import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { environment } from 'src/environments/environments';
import { AuthStatus, CheckTokenResponse, LoginRequest, LoginResponse, RegisterRequest, User } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;

  private http = inject( HttpClient );

  private _currentUser = signal<User|null>( null );
  private _authStatus = signal<AuthStatus>( AuthStatus.checking );

  public currenUser = computed( () => this._currentUser() );
  public authStatus = computed( () => this._authStatus() );

  constructor() {
    this.checkAuthStatus().subscribe();
   }

  private setAuthentication( user: User, token: string ): boolean {
    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.authenticated );
    localStorage.setItem('token', token);

    return true
  }

  login( email: string, password: string ): Observable<boolean> {
    const path: string = 'auth/login';
    const url: string = `${ this.baseUrl }/${ path }`;
    const body: LoginRequest = { email, password };

    return this.http.post<LoginResponse>( url, body )
      .pipe(
        map( ({ user, token }) => this.setAuthentication( user, token ) ),
        catchError( ( error ) => {
          return throwError( () => error.error.message);
        })
      );
  }

  register( registerUser: RegisterRequest ): Observable<boolean> {
    const path: string = 'auth/register';
    const url: string = `${ this.baseUrl }/${ path }`;
    const body: LoginRequest = registerUser;

    return this.http.post<LoginResponse>( url, body )
      .pipe(
        map( ({ user, token }) => this.setAuthentication( user, token ) ),
        catchError( ( error ) => {
          return throwError( () => error.error.message);
        })
      );
  }

  checkAuthStatus(): Observable<boolean> {
    const path: string = 'auth/check-token';
    const url: string = `${ this.baseUrl }/${ path }`;
    const token: string | null = localStorage.getItem('token');

    if ( !token ) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)

    return this.http.get<CheckTokenResponse>(url, { headers })
      .pipe(
        map( ({ user, token }) => this.setAuthentication( user, token ) ),
        catchError( () => {
          this._authStatus.set( AuthStatus.notAuthenticated );
          return of(false)
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set( null );
    this._authStatus.set( AuthStatus.notAuthenticated );
  }

}
