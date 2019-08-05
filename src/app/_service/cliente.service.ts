import { Cliente } from './../_model/cliente';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { FiltroUsuarioDTO } from '../_model/filtroUsuarioDTO';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  
  clienteCambio = new Subject<Cliente[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/clientes`;
  //url: string = `${environment.HOST}/${environment.MICRO_CRUD}/clientes`;

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Cliente[]>(this.url);
  }

  buscar(id: number) {
    return this.http.get(`${this.url}/buscar/${id}`);
  }

  listarPorId(id: number) {
    return this.http.get(`${this.url}/${id}`, {
      responseType: 'blob'
    });
  }

  buscarPorUsername(username: string) {
    return this.http.get(`${this.url}/buscarPorUsername/${username}`, {
      responseType: 'blob'
    });
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

}
