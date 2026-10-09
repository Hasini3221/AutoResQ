import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/seedData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isDemoAuth: boolean;
  isSupabaseConnected: boolean;
  isLoading: boolean;
  loginAsDemo: (role: UserRole) => void;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  signUpWithEmail: (fullName: string, age: number, email: string, pass: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  updateUserProfile: (updates: { full_name?: string; age?: number; phone?: string; agency?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  needsProfileCompletion: boolean;
  completeProfile: (fullName: string, age: number) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string, role?: UserRole) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('autoresq_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    // Return null initially if no stored session, requiring login or demo start
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoAuth, setIsDemoAuth] = useState<boolean>(() => {
    const saved = localStorage.getItem('autoresq_is_demo');
    return saved !== null ? saved === 'true' : true;
  });
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState<boolean>(false);

  // Sync state to local storage for instant offline / reload resiliency
  useEffect(() => {
    if (user) {
      localStorage.setItem('autoresq_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('autoresq_user');
    }
    localStorage.setItem('autoresq_is_demo', isDemoAuth ? 'true' : 'false');
  }, [user, isDemoAuth]);

  // Fetch or sync user profile from Supabase Database
  const fetchSupabaseProfile = useCallback(async (userId: string, email: string, metadata?: any): Promise<UserProfile> => {
    if (!supabase) {
      return {
        id: userId,
        name: metadata?.full_name || email.split('@')[0],
        full_name: metadata?.full_name || email.split('@')[0],
        email,
        age: metadata?.age ? Number(metadata.age) : undefined,
        role: 'citizen',
        provider: 'supabase' as any
      };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('[AutoResQ Auth] Error querying profiles table:', error.message);
      }

      if (data) {
        // Found existing profile in Supabase
        const profile: UserProfile = {
          id: data.id,
          name: data.full_name || email.split('@')[0],
          full_name: data.full_name,
          email: data.email || email,
          age: data.age ? Number(data.age) : undefined,
          role: (data.role as UserRole) || 'citizen',
          phone: data.phone,
          agency: data.agency,
          created_at: data.created_at,
          updated_at: data.updated_at,
          provider: 'supabase' as any
        };

        // If user is missing compulsory age or full_name (e.g. fresh Google OAuth sign-in)
        if (!data.full_name || data.age === undefined || data.age === null) {
          setNeedsProfileCompletion(true);
        } else {
          setNeedsProfileCompletion(false);
        }

        return profile;
      }

      // No profile row exists yet - insert default profile from auth metadata
      const newFullName = metadata?.full_name || metadata?.name || email.split('@')[0];
      const newAge = metadata?.age ? Number(metadata.age) : null;

      const newRecord = {
        id: userId,
        full_name: newFullName,
        email: email,
        age: newAge,
        role: 'citizen',
        updated_at: new Date().toISOString()
      };

      const { data: inserted, error: insertErr } = await supabase
        .from('profiles')
        .insert(newRecord)
        .select()
        .single();

      if (insertErr) {
        console.warn('[AutoResQ Auth] Could not insert new profile row:', insertErr.message);
      }

      const createdProfile: UserProfile = {
        id: userId,
        name: newFullName,
        full_name: newFullName,
        email,
        age: newAge || undefined,
        role: 'citizen',
        provider: 'supabase' as any
      };

      if (!newFullName || newAge === null) {
        setNeedsProfileCompletion(true);
      }

      return createdProfile;
    } catch (err: any) {
      console.error('[AutoResQ Auth] Profile fetch exception:', err);
      return {
        id: userId,
        name: metadata?.full_name || email.split('@')[0],
        full_name: metadata?.full_name,
        email,
        age: metadata?.age,
        role: 'citizen'
      };
    }
  }, []);

  // Supabase Session Listener
  useEffect(() => {
    let mounted = true;

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (!mounted) return;
        if (session && session.user) {
          setIsDemoAuth(false);
          const p = await fetchSupabaseProfile(session.user.id, session.user.email || '', session.user.user_metadata);
          if (mounted) {
            setUser(p);
            setIsLoading(false);
          }
        } else {
          if (mounted) setIsLoading(false);
        }
      }).catch(err => {
        console.warn('[AutoResQ Auth] Session lookup error:', err);
        if (mounted) setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!mounted) return;
        if (session && session.user) {
          setIsDemoAuth(false);
          const p = await fetchSupabaseProfile(session.user.id, session.user.email || '', session.user.user_metadata);
          if (mounted) setUser(p);
        } else {
          if (mounted && !isDemoAuth) {
            setUser(null);
          }
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } else {
      // Local/Demo Auth mode
      setIsLoading(false);
    }
  }, [fetchSupabaseProfile, isDemoAuth]);

  // Demo Login (Instant access with predefined roles)
  const loginAsDemo = (role: UserRole) => {
    const found = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    const demoProfile: UserProfile = {
      ...found,
      age: role === 'citizen' ? 29 : 38,
      provider: 'demo'
    };
    setUser(demoProfile);
    setIsDemoAuth(true);
    setNeedsProfileCompletion(false);
  };

  // Email / Password Login
  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check demo accounts first
    const matchedDemo = DEMO_USERS.find(u => u.email.toLowerCase() === trimmedEmail);
    if (matchedDemo && pass === 'password123') {
      const demoProfile: UserProfile = {
        ...matchedDemo,
        age: 32,
        provider: 'demo'
      };
      setUser(demoProfile);
      setIsDemoAuth(true);
      setNeedsProfileCompletion(false);
      return { success: true, message: `Welcome back, ${matchedDemo.name}!` };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: pass
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          setIsDemoAuth(false);
          const profile = await fetchSupabaseProfile(data.user.id, data.user.email || trimmedEmail, data.user.user_metadata);
          setUser(profile);
          return { success: true, message: `Signed in successfully as ${profile.name}` };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Authentication failed' };
      }
    }

    // Server-side / In-memory Fallback Authentication
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: pass })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setIsDemoAuth(false);
        setNeedsProfileCompletion(!data.user.age || !data.user.name);
        return { success: true, message: 'Logged in successfully' };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (e: any) {
      return { success: false, error: 'Authentication service temporarily unreachable' };
    }
  };

  // Sign Up with Email
  const signUpWithEmail = async (
    fullName: string, 
    age: number, 
    email: string, 
    pass: string
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) return { success: false, error: 'Full Name is compulsory.' };
    if (!age || age < 1 || age > 120) return { success: false, error: 'Please enter a valid age.' };
    if (!trimmedEmail || !trimmedEmail.includes('@')) return { success: false, error: 'Valid email address is required.' };
    if (!pass || pass.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: pass,
          options: {
            data: {
              full_name: trimmedName,
              age: Number(age)
            }
          }
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          setIsDemoAuth(false);
          // Insert profile into PostgreSQL table
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              full_name: trimmedName,
              email: trimmedEmail,
              age: Number(age),
              role: 'citizen',
              updated_at: new Date().toISOString()
            });
          } catch (profileErr) {
            console.warn('[AutoResQ Auth] Profile upsert warning:', profileErr);
          }

          const newProfile: UserProfile = {
            id: data.user.id,
            name: trimmedName,
            full_name: trimmedName,
            email: trimmedEmail,
            age: Number(age),
            role: 'citizen',
            created_at: new Date().toISOString(),
            provider: 'supabase' as any
          };

          // If email confirmation is required by Supabase project settings
          if (data.session) {
            setUser(newProfile);
            setNeedsProfileCompletion(false);
            return { success: true, message: 'Account created and signed in!' };
          } else {
            return { 
              success: true, 
              message: 'Account registered! Please check your email inbox to confirm your account or sign in directly.' 
            };
          }
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Registration failed' };
      }
    }

    // Backend PostgreSQL / Memory API registration
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: trimmedName,
          age: Number(age),
          email: trimmedEmail,
          password: pass
        })
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setIsDemoAuth(false);
        setNeedsProfileCompletion(false);
        return { success: true, message: 'Account registered successfully!' };
      } else {
        return { success: false, error: data.error || 'Failed to register account' };
      }
    } catch (err: any) {
      return { success: false, error: 'Registration server error. Please try again.' };
    }
  };

  // Google OAuth Sign-in
  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Google sign-in failed' };
      }
    }

    // If Supabase is not yet configured, provide helpful 안내 and instant simulated Google OAuth
    // (using real google token format or prompt)
    const simulatedGoogleUser: UserProfile = {
      id: `google-usr-${Date.now()}`,
      name: 'Google User',
      full_name: 'Google User',
      email: 'user@gmail.com',
      age: undefined, // Requires completion
      role: 'citizen',
      provider: 'google'
    };
    setUser(simulatedGoogleUser);
    setIsDemoAuth(false);
    setNeedsProfileCompletion(true);
    return { success: true };
  };

  // Update profile details
  const updateUserProfile = async (updates: { full_name?: string; age?: number; phone?: string; agency?: string }): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'No active session' };

    const updatedUser: UserProfile = {
      ...user,
      name: updates.full_name || user.name,
      full_name: updates.full_name || user.full_name,
      age: updates.age !== undefined ? updates.age : user.age,
      phone: updates.phone !== undefined ? updates.phone : user.phone,
      agency: updates.agency !== undefined ? updates.agency : user.agency,
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase && !isDemoAuth) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: updatedUser.full_name,
            age: updatedUser.age,
            phone: updatedUser.phone,
            agency: updatedUser.agency,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) {
          console.warn('[AutoResQ] Profiles update error:', error.message);
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        console.error('[AutoResQ] Supabase profile update error:', err);
      }
    }

    // Call backend endpoint
    try {
      await fetch(`/api/auth/profile/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {}

    setUser(updatedUser);
    return { success: true };
  };

  // Complete profile (compulsory Full Name and Age for new Google / Email users)
  const completeProfile = async (fullName: string, age: number): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'No user session found' };
    const trimmedName = fullName.trim();
    if (!trimmedName) return { success: false, error: 'Full Name is compulsory.' };
    if (!age || age < 1 || age > 120) return { success: false, error: 'Valid age is compulsory.' };

    const result = await updateUserProfile({ full_name: trimmedName, age: Number(age) });
    if (result.success) {
      setNeedsProfileCompletion(false);
    }
    return result;
  };

  // Logout
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign-out error:', err);
      }
    }
    setUser(null);
    setIsDemoAuth(false);
    setNeedsProfileCompletion(false);
    localStorage.removeItem('autoresq_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'citizen',
        isDemoAuth,
        isSupabaseConnected: isSupabaseConfigured,
        isLoading,
        loginAsDemo,
        loginWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        updateUserProfile,
        logout,
        needsProfileCompletion,
        completeProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
