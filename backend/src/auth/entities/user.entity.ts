import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ValidRoles } from '../interfaces/valid-roles.interface';
import { Team } from 'src/teams/entities/team.entity';
import { HumanResource } from 'src/resources/entities/human-resource.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fullName: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: ValidRoles,
    default: ValidRoles.member,
  })
  roles: ValidRoles;

  @Column({
    type: 'varchar',
    default: 'null',
  })
  picture: string;

  @ManyToOne(() => Team, (team) => team.members)
  team: Team;

  @OneToMany(() => HumanResource, (humanResource) => humanResource.user)
  humanResource: HumanResource;

  @BeforeInsert()
  checkFields() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsOnUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
