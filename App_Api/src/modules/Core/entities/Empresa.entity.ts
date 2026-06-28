import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Alumno } from "./Alumno.entity";

@Entity("empresas")
export class Empresa {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 150 })
  nombre: string;

  @Column({
    type: "varchar",
    length: 100,
    name: "contacto_nombre",
    nullable: true,
  })
  contactoNombre: string;

  @Column({
    type: "varchar",
    length: 150,
    name: "contacto_email",
    nullable: true,
  })
  contactoEmail: string;

  @CreateDateColumn({
    type: "timestamp",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToMany(() => Alumno, (alumno) => alumno.empresa)
  alumnos: Alumno[];
}
