import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from 'src/app/interfaces/menu';
import { UtilityService } from 'src/app/reusable/utility.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit{
  
  menusList: Menu[] = [];
  email: string = "";
  rol: string = "";
  
  constructor(
    private router: Router, _menuService: MenuService,
    private _menusService: MenuService,
    private _utilityService: UtilityService 
  ){}

  ngOnInit(): void {
    const user = this._utilityService.getUserSession();
    if(user != null){
      this.email = user.email;
      this.rol = user.rolDescription
    }

    this._menusService.getList(user.userId).subscribe({
      next: (data) => {
        if (data.status) {
          this.menusList = data.value;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  logout(){
    this._utilityService.deleteUserSession();
    this.router.navigate(["login"]);
  }
}
