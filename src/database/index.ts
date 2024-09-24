import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Database } from '@nozbe/watermelondb';
import { schema } from './schema';
import { Mentor } from '../models/Mentor';
import initSqlJs from 'sql.js';  // Import sql.js for web

const isWeb = () => typeof window !== 'undefined';  // Simple web platform check

const initializeDatabase = async () => {
  let adapter;

  if (isWeb()) {
    // Web platform: Use sql.js
    const SQL = await initSqlJs();
    const sqlJSInstance = new SQL.Database();  // Initialize sql.js in-memory DB

    adapter = new SQLiteAdapter({
      dbName: 'mentoring_db',  // Name your web-based database
      schema,
      webSqlImplementation: sqlJSInstance,  // Use sql.js for web
    });

  } else {
    // Non-web platform (mobile): Use native SQLite
    // For mobile platforms, use the native SQLite plugin (e.g., Capacitor SQLite)
    // Your mobile-specific database code here...
  }

  // Initialize WatermelonDB Database with the selected adapter
  const database = new Database({
    adapter,
    modelClasses: [Mentor],  // Register your models here
    actionsEnabled: true,    // Enable database actions
  });

  return database;
};

export default initializeDatabase;
