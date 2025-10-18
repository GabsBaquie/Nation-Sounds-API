import { Request, Response } from "express";
import { query } from "../database/connection";

export class StatsController {
  // Récupérer toutes les données (vue full_db)
  static async getAllData(req: Request, res: Response) {
    try {
      const result = await query("SELECT * FROM full_db ORDER BY source");
      res.json({
        success: true,
        count: result.rows.length,
        data: result.rows,
      });
    } catch (error: any) {
      console.error(
        "Erreur lors de la récupération de toutes les données:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  }

  // Récupérer les données publiques (vue public_data)
  static async getPublicData(req: Request, res: Response) {
    try {
      const result = await query("SELECT * FROM public_data ORDER BY source");
      res.json({
        success: true,
        count: result.rows.length,
        data: result.rows,
      });
    } catch (error: any) {
      console.error(
        "Erreur lors de la récupération des données publiques:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  }

  // Récupérer les statistiques de la base de données
  static async getDatabaseStats(req: Request, res: Response) {
    try {
      const result = await query("SELECT * FROM db_stats ORDER BY table_name");
      res.json({
        success: true,
        stats: result.rows,
      });
    } catch (error: any) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  }

  // Récupérer les statistiques des POIs par type
  static async getPoiStatsByType(req: Request, res: Response) {
    try {
      const result = await query(
        "SELECT * FROM poi_stats_by_type ORDER BY count DESC"
      );
      res.json({
        success: true,
        stats: result.rows,
      });
    } catch (error: any) {
      console.error(
        "Erreur lors de la récupération des statistiques POI:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  }

  // Récupérer les concerts par mois
  static async getConcertsByMonth(req: Request, res: Response) {
    try {
      const result = await query(
        "SELECT * FROM concerts_by_month ORDER BY month DESC"
      );
      res.json({
        success: true,
        stats: result.rows,
      });
    } catch (error: any) {
      console.error(
        "Erreur lors de la récupération des concerts par mois:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  }

  // Récupérer les statistiques des informations de sécurité
  static async getSecurityInfoStats(req: Request, res: Response) {
    try {
      const result = await query(
        "SELECT * FROM security_info_stats ORDER BY count DESC"
      );
      res.json({
        success: true,
        stats: result.rows,
      });
    } catch (error: any) {
      console.error(
        "Erreur lors de la récupération des statistiques de sécurité:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  }

  // Récupérer l'activité récente
  static async getRecentActivity(req: Request, res: Response) {
    try {
      const result = await query(
        "SELECT * FROM recent_activity ORDER BY created_at DESC LIMIT 10"
      );
      res.json({
        success: true,
        activity: result.rows,
      });
    } catch (error: any) {
      console.error(
        "Erreur lors de la récupération de l'activité récente:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  }

  // Récupérer les concerts avec leurs jours
  static async getConcertsWithDays(req: Request, res: Response) {
    try {
      const result = await query(
        "SELECT * FROM concerts_with_days ORDER BY created_at DESC"
      );
      res.json({
        success: true,
        concerts: result.rows,
      });
    } catch (error: any) {
      console.error(
        "Erreur lors de la récupération des concerts avec jours:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  }

  // Récupérer les jours avec leurs concerts
  static async getDaysWithConcerts(req: Request, res: Response) {
    try {
      const result = await query(
        "SELECT * FROM days_with_concerts ORDER BY created_at DESC"
      );
      res.json({
        success: true,
        days: result.rows,
      });
    } catch (error: any) {
      console.error(
        "Erreur lors de la récupération des jours avec concerts:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  }
}
