import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/interfaces/user';
import { UtilityService } from 'src/app/reusable/utility.service';
import { UserService } from 'src/app/services/user.service';
import { UserModalComponent } from '../../modals/user-modal/user-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit {
  
  columnsTable: string[] = ["fullName", "email", "rolDescription", "status", "action"];
  initialData: User[] = [];
  usersDataTable = new MatTableDataSource(this.initialData);
  @ViewChild(MatPaginator) paginatorTable!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _userService: UserService,
    private _utilityService: UtilityService
  ){}
  
  getUsers(){
    this._userService.getList().subscribe({
      next: (data) => {
        if (data.status) {
          this.usersDataTable.data = data.value;
        }
        else{
          this._utilityService.showAlert("¡No se encontraron datos!", "¡Opss!");
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

 
  ngOnInit(): void {
    this.getUsers();
  }

  ngAfterViewInit(): void {
    this.usersDataTable.paginator = this.paginatorTable;
  }

  filterTable(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.usersDataTable.filter = filterValue.trim().toLocaleLowerCase();
  }

  addUser(){
    this.dialog.open(UserModalComponent, {
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result === "true") {
        this.getUsers();
      }
    });
  }

  editUser(user: User){
    this.dialog.open(UserModalComponent, {
      disableClose: true,
      data: user
    }).afterClosed().subscribe(result => {
      if (result === "true") {
        this.getUsers();
      }
    });
  }

  deleteUser(user: User){
    Swal.fire({
      title: "¿Desea eliminar este usuario?",
      text:  user.fullName,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "No, volver"
    }).then(result => {
      if (result.isConfirmed) {
        this._userService.delete(user.userId).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilityService.showAlert("¡El usuario ha sido eliminado!", "¡Exitosamente!");
              this.getUsers();
            }
            else{
              this._utilityService.showAlert("¡NO se pudo eliminar el usuario!", "¡Error!");
            }
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    });
  }
}
