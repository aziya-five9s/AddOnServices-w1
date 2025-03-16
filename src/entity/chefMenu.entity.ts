import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    DeleteDateColumn,
} from "typeorm"
// import { EmissionStandardEnum } from "../../../enum/emissionStandard.enum"

@Entity({ name: "ChefMenu" })//table got created
export class ChefMenu extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({})//mandatory
    tenantId: string

    @Column({nullable: true})//mandatory
    heading:string

    @Column("jsonb", { nullable: true })
    logo: {
        docId: string;
        docPath: string;
        uploadedBy: string;
        uploadedAt: Date;
    };

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
