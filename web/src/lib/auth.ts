import NextAuth, { User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(1),
  userType: z.enum(["caregiver", "client"]),
});

export const authOptions = {
  session: { strategy: "jwt" as const },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        userType: { label: "User Type", type: "text" },
        action: { label: "Action", type: "text" },
      },
      async authorize(credentials) {
        try {
          console.log("Authorize called with:", credentials);
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing email or password");
            return null;
          }

          const { email, password, name, userType, action } = credentials;

          if (action === "register") {
            console.log("Registration flow started");
            // Registration logic
            const validatedFields = registerSchema.safeParse({
              email,
              password,
              name,
              userType,
            });

            console.log("Validation result:", validatedFields);

            if (!validatedFields.success) {
              console.log("Validation errors:", validatedFields.error);
              throw new Error("Datos de registro inválidos. Verifica que todos los campos estén completos.");
            }

            const {
              email: validatedEmail,
              password: validatedPassword,
              name: validatedName,
              userType: validatedUserType,
            } = validatedFields.data;

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
              where: { email: validatedEmail },
            });

            console.log("Existing user check:", existingUser);

            if (existingUser) {
              throw new Error("Ya existe un usuario con este correo electrónico.");
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(validatedPassword, 10);
            console.log("Password hashed successfully");

            // Get role based on user type
            const role = await prisma.role.findFirst({
              where: {
                code: validatedUserType === "caregiver" ? "ASSISTANT" : "USER",
              },
            });

            console.log("Role found:", role);

            if (!role) {
              console.log("Role not found in database");
              throw new Error("Role no encontrado en la base de datos.");
            }

            // Create user
            console.log("Creating user with data:", {
              email: validatedEmail,
              full_name: validatedName,
              username: validatedEmail.split("@")[0],
              role_id: role.id,
            });

            const user = await prisma.user.create({
              data: {
                email: validatedEmail,
                password: hashedPassword,
                full_name: validatedName,
                username: validatedEmail.split("@")[0],
                role_id: role.id,
              },
            });

            console.log("User created successfully:", user);

            return {
              id: user.id,
              email: user.email,
              name: user.full_name,
              role: role.code,
            };
          } else {
          // Login logic
          const validatedFields = loginSchema.safeParse({
            email,
            password,
          });

          if (!validatedFields.success) {
            throw new Error("Email o contraseña inválidos.");
          }

          const { email: validatedEmail, password: validatedPassword } =
            validatedFields.data;

          const user = await prisma.user.findUnique({
            where: { email: validatedEmail },
            include: { role: true },
          });

          if (!user || !user.password) {
            throw new Error("Usuario no encontrado. Verifica tu correo electrónico.");
          }

          const passwordsMatch = await bcrypt.compare(
            validatedPassword,
            user.password
          );

          if (!passwordsMatch) {
            throw new Error("Contraseña incorrecta.");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.full_name,
            role: user.role.code,
          };
        }
      } catch (error) {
        console.error("Error in authorize function:", error);
        throw error;
      }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const roleCode = (user as any).role;
        // Normalize role to lowercase: ASSISTANT -> assistant, USER -> user
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (token as any).role = roleCode === 'ASSISTANT' ? 'assistant' : 'user';
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = (token as JWT & { sub?: string }).sub!;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (NextAuth as any)(authOptions);
