
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm"
import { TenantInfo } from "./TenantInfo.entity"
// import { EmissionStandardEnum } from "../../../enum/emissionStandard.enum"

@Entity({ name: "SubMenu" })//table got created
export class SubMenu extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ nullable: true })
    heading: string

    @Column({})//mandatory
    tenantId: string

    @Column("jsonb", { nullable: true })//if nothing saved null will be saved
    subMenu?: Array<{
        title: string; imagePath: string, imgId: string, updatedAt: Date,
        uploadedBy: string
    }> | null 


    //many sub menu's to one tenantinfo
    @ManyToOne(() => TenantInfo, (ele) => ele.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "tenant" })//collection field name
    tenant: TenantInfo

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
