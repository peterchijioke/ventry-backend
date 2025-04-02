import { DataSource, DataSourceOptions } from "typeorm";
import { AccessCode } from "./entities/accessCode.entity";


const databaseConfig: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "ventry",
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  entities: [__dirname + "/entities/**/*.ts"],
  subscribers: [__dirname + "/subscribers/**/*.ts"],
};

export const AppDataSource = new DataSource(databaseConfig);

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");

    const accessCodeRepo = AppDataSource.getRepository(AccessCode); 
    const existingCodes = await accessCodeRepo.count();
    if (existingCodes === 0) {
      await accessCodeRepo.save([
        { code: "ABC-123", isUsed: false },
        { code: "XYZ-789", isUsed: false },
      ]);
      console.log("Sample access codes seeded");
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};