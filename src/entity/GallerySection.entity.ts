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

@Entity({ name: "Gallery" })
export class Gallery extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({}) //mandatory
    tenantId: string;

    // @Column({ nullable: true })
    // tenantName: string;

    // @Column({ nullable: true })
    // meals: string;

    @Column("jsonb", { nullable: true })
    morningMeal?: Array<{
        title: string;
        imagePath: string;
        imgId: string;
        uploadedBy: string;
        uploadedAt: Date;
    }> | null;
    
    @Column("jsonb", { nullable: true })
    afternoonMeal?: Array<{
        title: string;
        imagePath: string;
        imgId: string;
        uploadedBy: string;
        uploadedAt: Date;
    }> | null;

    @Column("jsonb", { nullable: true })
    eveningMeal?: Array<{
        title: string;
        imagePath: string;
        imgId: string;
        uploadedBy: string;
        uploadedAt: Date;
    }> | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
