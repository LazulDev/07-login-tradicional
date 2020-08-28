import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { pluck, catchError } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { handleError } from '../../utils/utils';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styles: [
  ]
})
export class RegistroComponent implements OnInit {

  usuario = new Usuario();
  recordarme = false;

  constructor( 
    private auth: AuthService,
    private router: Router
  ) {
    
  }
  ngOnInit() {
    this.usuario.email = 'msanchez.telecom@gmail.com';
    this.usuario.password = 'wawawaw';
  }

  submit( form: NgForm ) {
    if ( form.invalid ) { return; }

    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });

    Swal.showLoading();

    this.auth.nuevoUsuario( this.usuario )
    .pipe(
      pluck('idToken'),
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
    })
  }


}
