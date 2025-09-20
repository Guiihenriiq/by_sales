import { Request, Response } from 'express';
import { AppDataSource } from '@/infra/database/data-source';
import { Live } from '@/domain/entities/live.entity';

export class LiveController {
  async create(req: Request, res: Response) {
    try {
      const { title, description, streamUrl, thumbnailUrl, scheduledAt, products } = req.body;
      
      const liveRepository = AppDataSource.getRepository(Live);
      const live = Live.create(title, description, streamUrl, thumbnailUrl, new Date(scheduledAt), products);
      
      const savedLive = await liveRepository.save(live);
      return res.status(201).json(savedLive);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const liveRepository = AppDataSource.getRepository(Live);
      const lives = await liveRepository.find({ order: { scheduledAt: 'DESC' } });
      return res.json(lives);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const liveRepository = AppDataSource.getRepository(Live);
      const live = await liveRepository.findOne({ where: { id } });
      
      if (!live) {
        return res.status(404).json({ error: 'Live não encontrada' });
      }
      
      return res.json(live);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async startLive(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const liveRepository = AppDataSource.getRepository(Live);
      
      await liveRepository.update(id, {
        status: 'live',
        startedAt: new Date()
      });
      
      const live = await liveRepository.findOne({ where: { id } });
      return res.json(live);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async endLive(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const liveRepository = AppDataSource.getRepository(Live);
      
      await liveRepository.update(id, {
        status: 'ended',
        endedAt: new Date()
      });
      
      const live = await liveRepository.findOne({ where: { id } });
      return res.json(live);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async getCurrentLive(req: Request, res: Response) {
    try {
      const liveRepository = AppDataSource.getRepository(Live);
      const currentLive = await liveRepository.findOne({ 
        where: { status: 'live' },
        order: { startedAt: 'DESC' }
      });
      
      return res.json(currentLive);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateViewerCount(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { viewerCount } = req.body;
      
      const liveRepository = AppDataSource.getRepository(Live);
      await liveRepository.update(id, { viewerCount });
      
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }
}