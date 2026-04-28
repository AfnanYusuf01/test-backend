import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  parent_id: string;

  @Column({ default: 0 })
  stock: number;

  @ManyToOne(() => Product, product => product.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Product;

  @OneToMany(() => Product, product => product.parent)
  children: Product[];
}