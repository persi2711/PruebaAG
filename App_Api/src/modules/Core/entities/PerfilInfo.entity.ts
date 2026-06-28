import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Alumno } from "./Alumno.entity";

@Entity("perfil_info")
export class PerfilInfo {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 100 })
  nombres: string;

  @Column({ type: "varchar", length: 100 })
  apellidos: string;

  @Column({
    type: "varchar",
    length: 255,
    name: "url_imagen_perfil",
    nullable: true,
  })
  urlImagenPerfil: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  telefono: string;

  @Column({ type: "text", nullable: true })
  direccion: string;

  @OneToOne(() => Alumno, (alumno) => alumno.perfilInfo)
  alumno: Alumno;
}
