import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/_model/usuario';
import { Rol } from 'src/app/_model/rol';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FiltroUsuarioDTO } from 'src/app/_model/filtroUsuarioDTO';
import { ClienteService } from '../../_service/cliente.service';
import { ObjectUnsubscribedError } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  
  usuario: string;
  roles: string;
  imagenData: any;
  imagenEstado: boolean = false;
  constructor(private service: ClienteService, private sanitization: DomSanitizer) { 
    const helper = new JwtHelperService();
    let tk = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME));
    const decodedToken = helper.decodeToken(tk.access_token);
    console.log(decodedToken);
    this.usuario = decodedToken.user_name;
    this.roles = decodedToken.authorities.toString();
    
    this.service.buscarPorUsername(this.usuario).subscribe(data => {
      if (data.size > 0) {
        this.convertir(data);
      }
      console.log(data);
    })
  
    //this.imagenData = 'assets/user.png';
    
  }

  convertir(data: any) {
    let reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      let base64 = reader.result;
      this.imagenData = base64;
      this.setear(base64);
    }
  }

  setear(base64: any) {
    this.imagenData = this.sanitization.bypassSecurityTrustResourceUrl(base64);
    this.imagenEstado = true;
  }

  ObtenerData() {
    this.service.buscarPorUsername(this.usuario).subscribe(data => {
      // if (data.size > 0) {
      //   //this.convertir(data);
      // }
      console.log(data);
    })
  
  }
  ngOnInit() {
  }

}
