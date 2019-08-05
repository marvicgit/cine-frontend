export class FiltroUsuarioDTO {
    username: string;
    nombreCompleto: string;

    constructor(username: string, nombreCompleto: string) {
        this.username = username;
        this.nombreCompleto = nombreCompleto;
    }
}