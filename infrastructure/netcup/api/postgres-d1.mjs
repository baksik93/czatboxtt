import pg from "pg";

const { Pool, types } = pg;

// Epoch values and counters fit safely in JavaScript's integer range.
types.setTypeParser(20, (value) => Number(value));

function postgresSql(sql) {
  let index = 0;
  return sql.replaceAll("?", () => `$${++index}`);
}

class PreparedStatement {
  constructor(database, sql, values = []) {
    this.database = database;
    this.sql = postgresSql(sql);
    this.values = values;
  }

  bind(...values) {
    return new PreparedStatement(this.database, this.sql, values.map((value) => value ?? null));
  }

  async first() {
    const result = await this.database.query(this.sql, this.values);
    return result.rows[0] ?? null;
  }

  async all() {
    const result = await this.database.query(this.sql, this.values);
    return { success: true, results: result.rows };
  }

  async run() {
    const result = await this.database.query(this.sql, this.values);
    return { success: true, changes: result.rowCount ?? 0 };
  }
}

export class PostgresD1 {
  constructor(connectionString) {
    if (!connectionString) throw new Error("DATABASE_URL is required");
    this.pool = new Pool({
      connectionString,
      max: Number(process.env.DATABASE_POOL_SIZE || 10),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000
    });
    this.queryTarget = this.pool;
  }

  prepare(sql) {
    return new PreparedStatement(this.queryTarget, sql);
  }

  async batch(statements) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const results = [];
      for (const statement of statements) {
        const result = await client.query(statement.sql, statement.values);
        results.push({ success: true, changes: result.rowCount ?? 0, results: result.rows });
      }
      await client.query("COMMIT");
      return results;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  query(sql, values = []) {
    return this.pool.query(sql, values);
  }

  close() {
    return this.pool.end();
  }
}
