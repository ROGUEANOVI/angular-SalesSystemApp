import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from 'src/app/interfaces/rol';
import { User } from 'src/app/interfaces/user';
import { UtilityService } from 'src/app/reusable/utility.service';
import { RolService } from 'src/app/services/rol.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {

  userForm: FormGroup ;
  hiddenPasword: boolean = true;
  actionTitle: string = "Agregar";
  actionButton: string = "Guardar";
  rolsList: Rol[] = [];

  constructor(
    private actualModal: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: User,
    private fb: FormBuilder,
    private _userService: UserService,
    private _rolService: RolService,
    private _utilityService: UtilityService  
  ){
    this.userForm = this.fb.group({
      fullName: ["", Validators.required],
      email: ["", Validators.required],
      password: ["", Validators.required],
      isActive: ["", Validators.required],
      rolId: ["1", Validators.required]
    });

    if (this.userData != null) {
      this.actionTitle = "Editar";
      this.actionButton = "Actualizar";
    }

    this._rolService.getList().subscribe({
      next: (data) => {
        if (data.status) {
          this.rolsList = data.value;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnInit(): void {
    if (this.userData != null) {
      this.userForm.patchValue({
      fullName: this.userData.fullName,
      email: this.userData.email,
      password: this.userData.password,
      isActive: this.userData.isActive.toString(),
      rolId: this.userData.rolId,
      });
    }
  }

  handleUser(){
    const user: User = {
      userId: this.userData == null ? 0 : this.userData.userId,
      fullName: this.userForm.value.fullName,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      isActive: parseInt(this.userForm.value.isActive),
      rolId: this.userForm.value.rolId,
      rolDescription: ""
    }

    if (this.userData == null) {
      this._userService.register(user).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.showAlert("¡El usuario ha sido registado!", "¡Exitosamente!");
            this.actualModal.close("true");
          }
          else{
            this._utilityService.showAlert("¡NO se pudo registrar el usuario!", "¡Error!");
          }
        },
        error: (err) => {
          console.log(err)
        }
      });
    }
    else{
      this._userService.edit(user).subscribe({
        next: (data) => {
          console.log(data);
          
          if (data.status) {
            this._utilityService.showAlert("¡El usuario ha sido editado!", "¡Exitosamente!");
            this.actualModal.close("true");
          }
          else{
            this._utilityService.showAlert("¡NO se pudo editar el usuario!", "¡Error!");
          }
        },
        error: (err) => {
          console.log(err)
        }
      });
    }
  }

}
