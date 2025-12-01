import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()

    const mockSqlQueries: Record<string, string> = {
      BigQuery: `SELECT ${payload.fields?.map((f: any) => `${f.column} AS ${f.alias || f.column}`).join(", ") || "*"} FROM \`${payload.tableName}\``,
      Snowflake: `SELECT ${payload.fields?.map((f: any) => `"${f.column}" AS "${f.alias || f.column}"`).join(", ") || "*"} FROM "${payload.tableName}"`,
      PostgreSQL: `SELECT ${payload.fields?.map((f: any) => `"${f.column}" AS "${f.alias || f.column}"`).join(", ") || "*"} FROM "${payload.tableName}"`,
      MySQL: `SELECT ${payload.fields?.map((f: any) => `\`${f.column}\` AS \`${f.alias || f.column}\``).join(", ") || "*"} FROM \`${payload.tableName}\``,
      Redshift: `SELECT ${payload.fields?.map((f: any) => `"${f.column}" AS "${f.alias || f.column}"`).join(", ") || "*"} FROM "${payload.tableName}"`,
    }

    const sqlQuery = mockSqlQueries[payload.database] || mockSqlQueries.BigQuery

    // Simulate API processing time (2-5 seconds)
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 30000 + 20000))

    return NextResponse.json({
      success: true,
      sqlQuery,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate query" }, { status: 500 })
  }
}
