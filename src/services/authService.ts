import { supabase } from '../lib/supabase';
import type { Role } from '../types';

export class AuthService {
  // Login com E-mail e Senha
  static async signIn(email: string, password: string): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, message: error.message || 'E-mail ou senha incorretos.' };
      }

      return { success: true, message: 'Autenticado com sucesso!', user: data.user };
    } catch (err: any) {
      return { success: false, message: err.message || 'Erro ao realizar login.' };
    }
  }

  // Cadastro de Novo Usuário (Sign Up)
  static async signUp(
    email: string, 
    password: string, 
    nome: string, 
    role: Role, 
    tenantId: string
  ): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome,
            role,
            tenant_id: tenantId
          }
        }
      });

      if (error) {
        return { success: false, message: error.message || 'Erro ao criar conta.' };
      }

      return { success: true, message: 'Conta criada com sucesso!', user: data.user };
    } catch (err: any) {
      return { success: false, message: err.message || 'Erro ao cadastrar usuário.' };
    }
  }

  // Encerramento de Sessão (Sign Out)
  static async signOut(): Promise<boolean> {
    try {
      const { error } = await supabase.auth.signOut();
      return !error;
    } catch {
      return false;
    }
  }

  // Obter Sessão Atual
  static async getSession() {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch {
      return null;
    }
  }
}
