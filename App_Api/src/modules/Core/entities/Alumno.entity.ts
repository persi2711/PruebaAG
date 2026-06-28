import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { PerfilInfo } from "./PerfilInfo.entity";
import { Empresa } from "./Empresa.entity";
import { Inscripcion } from "./Inscripcion.entity";

@Entity("alumnos")
export class Alumno {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({
    type: "char",
    length: 36,
    name: "uuid_publico",
    unique: true,
    default: () => "(UUID())",
  })
  uuidPublico!: string;

  @Column({ type: "boolean", name: "is_active", default: true })
  isActive: boolean;

  @CreateDateColumn({
    type: "timestamp",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @OneToOne(() => PerfilInfo, (perfil) => perfil.alumno, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "perfil_info_id" })
  perfilInfo: PerfilInfo;

  @ManyToOne(() => Empresa, (empresa) => empresa.alumnos)
  @JoinColumn({ name: "empresa_id" })
  empresa: Empresa;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.alumno)
  inscripciones: Inscripcion[];
}
