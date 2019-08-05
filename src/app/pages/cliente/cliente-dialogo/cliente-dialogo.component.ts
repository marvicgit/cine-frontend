import { Component, OnInit, Inject } from '@angular/core';
import { Cliente } from '../../../_model/cliente';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ClienteService } from 'src/app/_service/cliente.service';
import { DomSanitizer } from '@angular/platform-browser';
import { switchMap, map } from 'rxjs/operators';
import { Usuario } from '../../../_model/usuario';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-cliente-dialogo',
  templateUrl: './cliente-dialogo.component.html',
  styleUrls: ['./cliente-dialogo.component.css']
})

export class ClienteDialogoComponent implements OnInit {

  maxFecha: Date;
  usuario: Usuario;
  imagenData: any;
  imagenEstado: boolean = false;
  selectedFiles: FileList;
  currentFileUpload: File;
  labelFile: string;
  disableUser = false;
  constructor(private dialogRef: MatDialogRef<ClienteDialogoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Usuario, 
              private clienteService: ClienteService, 
              private usuarioService: UsuarioService, 
              private sanitization: DomSanitizer, 
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.maxFecha = new Date();
    this.usuario = new Usuario();  
    this.usuario.cliente = new Cliente();
    //console.log(this.data.cliente);
    
     
    
    if(this.data.cliente) {
      this.disableUser = true;
      this.usuario = this.data;
      // this.form = this.fb.group({
      //   id: new FormControl(this.data.idUsuario),
      //   nombres: new FormControl(this.data.cliente.nombres),
      //   apellidos: new FormControl(this.data.cliente.apellidos),
      //   dni: new FormControl(this.data.cliente.dni),
      //   fechaNac: new FormControl(this.data.cliente.fechaNac),
      //   username: new FormControl({ value: this.data.username, disabled: true }),
      //   password: ['']
      // });

      this.usuario.password = '';
      this.usuario.cliente.foto = null;
      // console.log(this.usuario);
      this.clienteService.listarPorId(this.data.cliente.idCliente).subscribe(data => {
        console.log(data);
        if (data.size > 0) {
          this.convertir(data);
        }
      }); 
     } 
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

  cancelar() {
    this.dialogRef.close();
  }

  selectFile(e: any) {
    this.labelFile = e.target.files[0].name;
    this.selectedFiles = e.target.files;
    console.log(e.target.files);
    
  }

  operar() {


    // if (this.usuario.cliente.nombres !== '' &&
    //     this.usuario.cliente.apellidos !== '' &&
    //     this.usuario.cliente.dni !== '' &&
    //     this.usuario.cliente.fechaNac !== null &&
    //     this.usuario.username !== '') {
    
    if (this.selectedFiles != null) {
      this.currentFileUpload = this.selectedFiles.item(0);
    } else {
      this.currentFileUpload = new File([""], "blanco");
    }

    if (this.usuario != null && this.usuario.idUsuario > 0) {
      console.log(JSON.stringify(this.usuario));
      
      this.usuarioService.modificar(this.usuario, this.currentFileUpload).pipe(switchMap(() => {
        return this.usuarioService.listar();
      })).subscribe(data => {
        this.usuarioService.usuarioCambio.next(data);
        this.usuarioService.mensajeCambio.next("Se modifico");
      });
    } else {
      console.log(JSON.stringify(this.usuario));
      this.usuarioService.registrarConFoto(this.usuario, this.currentFileUpload)
      .subscribe(data => {
        this.usuarioService.listar().subscribe(data => {
          this.usuarioService.usuarioCambio.next(data);
          this.usuarioService.mensajeCambio.next("Se registro");
        });
      });
    }
    this.dialogRef.close();
  }
// }
}
