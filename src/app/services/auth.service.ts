import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private API_KEY = 'AIzaSyBKGXChIKr4Ohf9egu7MPpRpUsXBM2lDEA';
  userToken: string; 
  // Create new user
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // Login
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor( private http: HttpClient ) { 
    this.leerToken();
  }
  private getRequest( { email, password }: Usuario, action: string) {
    const body = { 
      email,
      password,
      returnSecureToken: true 
    };
    return this.http.post(
      `${this.URL}:${action}?key=${this.API_KEY}`,
      body
    ).pipe(
      map( resp => {
        this.guardarToken( resp['idToken'], resp['expiresIn'] );
        return resp;
      })
    );;
  }
  logout() {
    localStorage.removeItem('token');

  }

  login( usuario: Usuario ) {
    return this.getRequest( usuario, 'signInWithPassword' );
  }

  nuevoUsuario( usuario: Usuario ) {
    return this.getRequest( usuario, 'signUp' );
  }

  private guardarToken( idToken: string, expiraEn: number = 3600 ) {
    const expires = moment().add( expiraEn, 'seconds');
    localStorage.setItem('expira', expires.toISOString());
    this.userToken = idToken;
    localStorage.setItem('token', idToken );
  }
  
  leerToken() {
    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  estaAutenticado(): boolean {

    if ( this.userToken.length < 2 ) {
      return false;
    }
    const expira: moment.Moment = moment(localStorage.getItem('expira'));

    return expira.isAfter( moment() );
  }
}
