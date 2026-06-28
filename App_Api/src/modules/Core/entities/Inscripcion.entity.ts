import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from "typeorm";
import { Alumno } from "./Alumno.entity";
import { Programa } from "./Programa.entity";
import { HistorialInscripcion } from "./HistorialInscripcion.entity";

@Entity("inscripciones")
@Unique("uq_inscripcion_estatus", ["alumno", "programa", "estatusActual"]) // Mapeo del CONSTRAINT UNIQUE
export class Inscripcion {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({
    type: "varchar",
    length: 50,
    name: "estatus_actual",
    default: "Inscrito",
  })
  estatusActual: string;

  @UpdateDateColumn({
    type: "timestamp",
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @ManyToOne(() => Alumno, (alumno) => alumno.inscripciones, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "alumno_id" })
  alumno: Alumno;

  @ManyToOne(() => Programa, (programa) => programa.inscripciones, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "programa_id" })
  programa: Programa;

  @OneToMany(() => HistorialInscripcion, (historial) => historial.inscripcion)
  historiales: HistorialInscripcion[];
}
