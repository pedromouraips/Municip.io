import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CitizenAuthService, Login } from '../services/citizen-auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [CitizenAuthService]
})
export class LoginComponent {

  user: Login = {
    
    email: '',
    password: '',
    twoFactorCode: "",
    twoFactorRecoveryCode :""
  };
  constructor(private citizenAuthService: CitizenAuthService, private router: Router) { }


  loginForm = new FormGroup({
    email: new FormControl(''),
    password : new FormControl('')
  });


   onSubmit() {
    console.log(this.loginForm.value);
    
    //nao esta a ter o user e pass (null) e falta fazer a navigation apenas quando for autenticado
    this.citizenAuthService.loginCitizen(this.loginForm.value as Login).subscribe(
      res => {
        console.log("User logado", res);
        this.router.navigateByUrl('');
      },
      error => { 
        console.error("erro login,", error);
      }
    );
  }
}
