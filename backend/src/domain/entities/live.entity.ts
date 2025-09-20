import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('lives')
export class Live {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  streamUrl: string;

  @Column()
  thumbnailUrl: string;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt?: Date;

  @Column({ 
    type: 'enum', 
    enum: ['scheduled', 'live', 'ended', 'cancelled'],
    default: 'scheduled'
  })
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';

  @Column({ default: 0 })
  viewerCount: number;

  @Column('json', { nullable: true })
  products?: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static create(
    title: string,
    description: string,
    streamUrl: string,
    thumbnailUrl: string,
    scheduledAt: Date,
    products?: string[]
  ): Live {
    const live = new Live();
    live.title = title;
    live.description = description;
    live.streamUrl = streamUrl;
    live.thumbnailUrl = thumbnailUrl;
    live.scheduledAt = scheduledAt;
    live.products = products;
    return live;
  }
}