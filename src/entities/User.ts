import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, BeforeInsert, BeforeUpdate } from 'typeorm'
import { v4 as uuid } from 'uuid';
import { hashPassword } from '../utils/crypto'
@Entity('users')
class User {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    create_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    /*
    Este método de geração de id deve ser usado caso queira passar a 
    responsabilidade de geraão de uuid para aplicação. Deste modo não
    precisa se preocupar com qual banco vai usar.
    */
    @BeforeInsert()
    setId() {
        this.id = uuid();
    }
    @BeforeInsert()
    @BeforeUpdate()
    async setPassword() {
        try {
            this.password = await hashPassword(this.password)
        } catch (error) {
            console.log('Hash password error:', error)
        }
    }

}

export { User }