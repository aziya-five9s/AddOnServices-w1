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

@Entity({ name: "ContactUs" })//table got created
export class ContactUs extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({})//mandatory
    tenantId: string

    @Column({ nullable: true })
    description: string

    @Column({ nullable: true })
    address: string

    @Column({ nullable: true })
    email: string



    @Column("jsonb", { nullable: true }) // Works in PostgreSQL & MySQL
    contact?: string[] | null;

    @Column("jsonb", { nullable: true })//if nothing saved null will be saved
    images?: Array<{
        imagePath: string, imgId: string, updatedAt: Date,
        uploadedBy: string
    }> | null

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
