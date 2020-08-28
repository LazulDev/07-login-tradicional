import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent  {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  salir() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

}
