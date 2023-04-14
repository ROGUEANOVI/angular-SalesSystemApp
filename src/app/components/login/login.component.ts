import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/interfaces/login';
import { UtilityService } from 'src/app/reusable/utility.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})
export class LoginComponent {

  loginForm: FormGroup;
  hiddenPasword: boolean = true;
  showLoading:boolean = false;

  constructor(
    private fb:FormBuilder, 
    private router: Router, 
    private _userService: UserService, 
    private _utilityService: UtilityService
    ){
    this.loginForm = this.fb.group({
      email: ["",Validators.required],
      password: ["",Validators.required]
    });      
  }

  login(){
    this.showLoading = true;

    const request: Login = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }; 

    this._userService.login(request).subscribe({
      next: (data) => {
        if(data.status){
          this._utilityService.saveUserSession(data.value);
          this.router.navigate(["pages"]);
        }
        else{
          this._utilityService.showAlert("¡Email o constraseña incorrectos!", "Opps!");
        }
      },
      complete: () => {
        this.showLoading = false;
      },
      error: (err) => {
        this._utilityService.showAlert("¡Ocurrio un error al Iniciar Sesion!", "Opps!");
        console.log(err);
      },
    });
  }
}
