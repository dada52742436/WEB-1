import { NextResponse } from "next/server";
import { logoutUser } from "@/lib/auth-service";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "未提供认证令牌" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // 登出用户（删除会话）
    await logoutUser(token);

    return NextResponse.json({
      message: "登出成功",
    });
  } catch (error) {
    console.error("登出错误:", error);

    return NextResponse.json(
      { error: error.message || "登出失败" },
      { status: 400 }
    );
  }
}