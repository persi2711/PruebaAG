import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Inscripcion } from "./Inscripcion.entity";

@Entity("programas")
export class Programa {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 150 })
  nombre: string;

  @Column({ type: "text", nullable: true })
  descripcion: string;

  @CreateDateColumn({
    type: "timestamp",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.programa)
  inscripciones: Inscripcion[];
}
