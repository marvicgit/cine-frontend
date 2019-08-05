import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Cliente } from 'src/app/_model/cliente';
import { ClienteDialogoComponent } from './cliente-dialogo/cliente-dialogo.component';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { Usuario } from 'src/app/_model/usuario';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  
  cantidad: number;
  dataSource: MatTableDataSource<Usuario>;
  displayedColumns = ['idCliente', 'nombres', 'apellidos', 'dni', 'fechaNacimiento', 'acciones'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private usuarioService: UsuarioService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.usuarioService.usuarioCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.usuarioService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      })
    });

    this.lista();
  }

  lista() {
    this.usuarioService.listarPageable(0, 10).subscribe(data => {
      //console.log(data.totalElements);
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cantidad = data.totalElements;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDialog(usuario?: Usuario) {    
    let com = usuario != null ? usuario : new Cliente();

    // console.log(com);
    this.dialog.open(ClienteDialogoComponent, {
      width: '250px',
      data: com
    });
  }

  eliminar(usuario?: Usuario){
    console.log(usuario);
    
    this.usuarioService.eliminar(usuario.idUsuario).pipe(switchMap(() => {
      return this.usuarioService.listar();
    })).subscribe(data => {
      this.usuarioService.usuarioCambio.next(data);
      this.usuarioService.mensajeCambio.next("Se elimino");
    });
  }

  mostrarMas(e : any){    
    //console.log(e);
    this.usuarioService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      //console.log(data);

      let generos = data.content;
      this.cantidad = data.totalElements;
      
      this.dataSource = new MatTableDataSource(generos);
      //this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
