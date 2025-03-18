import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    DeleteDateColumn,
    OneToMany,
    JoinColumn,
} from "typeorm"
import { SubMenu } from "./SubMenu.entity"
// import { EmissionStandardEnum } from "../../../enum/emissionStandard.enum"

@Entity({ name: "TenantInfo" })//table got created
export class TenantInfo extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({})//mandatory
    address: string

    @Column({})//mandatory
    tenantId: string

    @Column({ nullable: true })
    tenantName: string

    @Column({})//mandatory
    contactUs: string

    @Column("jsonb", { nullable: true })  // Store an array of objects
    policies: object[];

    @Column("jsonb", { nullable: true })  // Store an array of objects
    followUsOn: object[];

    @Column("jsonb", { nullable: true })
    logo: {
        docId: string;
        docPath: string;
        uploadedBy: string;
        uploadedAt: Date;
    };

    @Column("jsonb", { nullable: true }) // Store latitude & longitude
    changeoutlet: {
        latitude: number;
        longitude: number;
    };

    // @Column("jsonb", { nullable: true }) 
    // heroSection: { sNo: number, title: string; subTitle: string; imagePath: string, imgId: string , updatedAt: Date}[]
    
    @Column("jsonb", { nullable: true })//if nothing saved null will be saved
    heroSection?: Array<{ title: string; subTitle: string; imagePath: string, imgId: string , updatedAt: Date }> | null


    @Column("jsonb", { nullable: true })
    aboutSection: {
        description:String;
        imagePath: string; 
        imgId: string ;
        uploadedBy: string;
        uploadedAt: Date;
    };


    //one tenant info to many sub menu's
    // @OneToMany(() => SubMenu, (el) => el.subMenu)
    // @JoinColumn({ name: "subMenu" })
    // subMenu: SubMenu[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
