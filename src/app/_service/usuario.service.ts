import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Usuario } from '../_model/usuario';
import { Subject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuarioCambio = new Subject<Usuario[]>();
  mensajeCambio = new Subject<string>();
  url: string = `${environment.HOST}/usuarios`;
  
  listar() {
    return this.http.get<Usuario[]>(this.url);
  }

  constructor(private http: HttpClient) { }
  listarPorId(id: number) {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  registrar(usuario: Usuario) {
    return this.http.post(this.url, usuario);
  }

  // registrarConFoto(usuario: Usuario, file?: File) {
  //   let formdata: FormData = new FormData();
  //   formdata.append('file', file);

  //   const usuarioBlob = new Blob([JSON.stringify(usuario)], { type: "application/json" });
  //   formdata.append('usuario', usuarioBlob);
    

  //   return this.http.post(`${this.url}`, formdata, {
  //     responseType: 'text'
  //   }).pipe( map((res: any)=>{ 
  //     console.log(res)
  //   }), catchError(this.handleError));
  // }

  registrarConFoto(usuario: Usuario, file?: File) {
    let formdata: FormData = new FormData();
    formdata.append('file', file);

    const usuarioBlob = new Blob([JSON.stringify(usuario)], { type: "application/json" });
    formdata.append('usuario', usuarioBlob);
    

    return this.http.post(`${this.url}`, formdata, {
      responseType: 'text'
    });
  }

  modificar(usuario: Usuario, file?: File) {
    //console.log(JSON.stringify(usuario));
    //console.log(file);
    
    
    let formdata: FormData = new FormData();
    formdata.append('file', file);

    const usuarioBlob = new Blob([JSON.stringify(usuario)], { type: "application/json" });
    
    formdata.append('usuario', usuarioBlob);

    return this.http.put(`${this.url}`, formdata, {
      responseType: 'text'
    });
  }

  listarPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`); //&sort=nombre
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
