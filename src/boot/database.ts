import initializeEncryptedDatabase from '../database';  // Adjust path as needed

export default async ({ app }) => {
  const database = await initializeEncryptedDatabase();
  app.config.globalProperties.$database = database;
};
