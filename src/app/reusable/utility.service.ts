import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Session } from '../interfaces/session';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private _snackBar: MatSnackBar) { }

  showAlert(message: string, type: string){
    this._snackBar.open(message, type, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

  saveUserSession(userSesion: Session){
    localStorage.setItem("user", JSON.stringify(userSesion));
  }

  getUserSession(){
    const data = localStorage.getItem("user");  
    const user = JSON.parse(data!);
    return user;
  }

  deleteUserSession(){
    localStorage.removeItem("user");
  }
}
