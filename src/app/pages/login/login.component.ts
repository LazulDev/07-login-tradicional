import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/models/usuario.model';
import { handleError } from 'src/app/utils/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})

export class LoginComponent implements OnInit {

  usuario: Usuario;
  recordarme = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.usuario = new Usuario();
    if ( localStorage.getItem('email') ) {
      this.usuario.email = localStorage.getItem('email');
      this.recordarme = true;
    }
    this.usuario.password = 'wawawaw';
  }

  login( f: NgForm ) {
    if ( f.invalid ) { return; }
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });

    Swal.showLoading();

    this.auth.login( this.usuario )
    .pipe(
      catchError( err => {
        const errorMessage: string = handleError(err);
        Swal.fire({
          icon: 'error',
          text: errorMessage,
        });
        return of({ error: errorMessage });
      })
    )
    .subscribe( resp => {
      if ( !resp.hasOwnProperty('error')) {

        if ( this.recordarme ) {
          localStorage.setItem('email', this.usuario.email);
        }
        Swal.close();
        this.router.navigateByUrl('/home');
      }
    });

  }

}
