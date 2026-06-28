import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Inscripcion } from "./Inscripcion.entity";

@Entity("historial_inscripciones")
export class HistorialInscripcion {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ type: "int", unsigned: true, name: "alumno_id" })
  alumnoId!: number;

  @Column({ type: "int", unsigned: true, name: "programa_id" })
  programaId!: number;

  @Column({
    type: "varchar",
    length: 50,
    name: "estatus_anterior",
    nullable: true,
  })
  estatusAnterior?: string;

  @Column({ type: "varchar", length: 50, name: "estatus_nuevo" })
  estatusNuevo!: string;

  @Column({ type: "text", nullable: true })
  motivo?: string;

  @CreateDateColumn({
    type: "timestamp",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @ManyToOne(() => Inscripcion, (inscripcion) => inscripcion.historiales, {
    onDelete: "CASCADE",
  })
  @JoinColumn([
    { name: "alumno_id", referencedColumnName: "id" },
    { name: "programa_id", referencedColumnName: "id" },
  ])
  inscripcion!: Inscripcion;
}
