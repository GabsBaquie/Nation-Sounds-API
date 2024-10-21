// src/routes/index.ts
import { Router } from 'express';
import adminRoutes from './adminRoutes';
import authRoutes from './authRoutes';
import notificationRoutes from './notificationRoutes';
import poiRoutes from './poiRoutes';
import programRoutes from './programRoutes';
import contentRoutes from './contentRoutes';
import dayRoutes from './dayRoutes';
import concertRoutes from './concertRoutes';
import { AppDataSource } from '../data-source';
import { Concert } from '../entity/Concert';
import { Content } from '../entity/Content';
import { Day } from '../entity/Day';
import { Notification } from '../entity/Notification';
import { POI } from '../entity/POI';
import { Program } from '../entity/Program';
import { SecurityInfo } from '../entity/SecurityInfo';

const router = Router();

router.use('/auth', authRoutes);
router.use('/notifications', notificationRoutes);
router.use('/pois', poiRoutes);
router.use('/programs', programRoutes);
router.use('/days', dayRoutes);
router.use('/concerts', concertRoutes);
router.use('/admin', adminRoutes);
router.use('/contents', contentRoutes);

// Route pour récupérer toutes les données
router.get('/', async (req, res) => {
  try {
    const data = {
      programs: await AppDataSource.getRepository(Program).find({
        relations: ['day', 'day.concerts'],
      }),
      days: await AppDataSource.getRepository(Day).find({
        relations: ['program', 'concerts'],
      }),
      concerts: await AppDataSource.getRepository(Concert).find({
        relations: ['days'],
      }),
      pois: await AppDataSource.getRepository(POI).find(),
      notifications: await AppDataSource.getRepository(Notification).find(),
      contents: await AppDataSource.getRepository(Content).find(),
      securityInfos: await AppDataSource.getRepository(SecurityInfo).find(),
    };
    res.status(200).json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
