import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await client.connect();
          const db = client.db("ecommerce");
          
          // For now, using a simple admin user check
          // In production, you'd have a proper admins collection
          const adminUser = {
            id: "1",
            email: "admin@ecommerce.com",
            name: "Admin User"
          };

          // Simple password check (in production, use hashed passwords)
          if (credentials.email === "admin@ecommerce.com" && credentials.password === "admin123") {
            return adminUser;
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        } finally {
          await client.close();
        }
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
