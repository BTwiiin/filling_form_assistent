import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb', { nullable: true })
  history: {
    role: 'user' | 'model';
    parts: { text: string }[];
  }[];

  @Column({ nullable: true })
  sessionId: string;

  @Column({ default: false })
  isComplete: boolean;

  @Column('jsonb', { nullable: true })
  formData: {
    firstname?: string;
    lastname?: string;
    email?: string;
    reason?: string;
    urgency?: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}