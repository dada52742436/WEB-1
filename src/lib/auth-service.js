import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "./jwt";

/**
 * 用户注册服务
 */
export async function createUser({ username, email, password }) {
  try {
    // 检查用户是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      throw new Error("用户名或邮箱已存在");
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    throw new Error(`注册失败: ${error.message}`);
  }
}

/**
 * 用户登录服务
 */
export async function authenticateUser({ username, password }) {
  try {
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new Error("用户名或密码错误");
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("用户名或密码错误");
    }

    // 生成 JWT 令牌
    const token = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    // 创建会话记录
    const expiresAt = new Date(
      Date.now() + (parseInt(process.env.SESSION_EXPIRES_IN) || 86400) * 1000
    );

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    throw new Error(`登录失败: ${error.message}`);
  }
}

/**
 * 验证会话服务
 */
export async function verifySession(token) {
  try {
    // 验证 JWT
    const decoded = verifyToken(token);

    // 检查数据库中的会话
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new Error("会话已过期");
    }

    return session.user;
  } catch (error) {
    throw new Error(`会话验证失败: ${error.message}`);
  }
}

/**
 * 用户登出服务
 */
export async function logoutUser(token) {
  try {
    await prisma.session.delete({
      where: { token },
    });
    return { success: true };
  } catch (error) {
    throw new Error(`登出失败: ${error.message}`);
  }
}

/**
 * 清理过期会话
 */
export async function cleanExpiredSessions() {
  try {
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  } catch (error) {
    console.error("清理过期会话失败:", error);
  }
}