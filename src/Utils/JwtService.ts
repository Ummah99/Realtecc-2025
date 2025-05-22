import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
}

class JwtService {
  private readonly TOKEN_KEY = 'jwt';
  private readonly isSecureCookieSupported: boolean;

  constructor() {
    this.isSecureCookieSupported = typeof document !== 'undefined' && 
      'cookieStore' in window &&
      typeof (window as any).cookieStore?.set === 'function';
  }

  async setToken(token: string): Promise<void> {
    if (this.isSecureCookieSupported) {
      try {
        // Set HTTP-only cookie with Secure and SameSite 
        await (window as any).cookieStore.set({
          name: this.TOKEN_KEY,
          value: token,
          secure: window.location.protocol === 'https:',
          sameSite: 'strict',
          maxAge: this.getTokenExpirationTime(token) * 1000 
        });
        return;
      } catch (error) {
        console.warn('Failed to set secure cookie, falling back to localStorage', error);
      }
    }
    
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  async getToken(): Promise<string | null> {
    if (this.isSecureCookieSupported) {
      try {
        const cookie = await (window as any).cookieStore.get(this.TOKEN_KEY);
        if (cookie) {
          return cookie.value;
        }
      } catch (error) {
        console.warn('Failed to get secure cookie, falling back to localStorage', error);
      }
    }
    
    return localStorage.getItem(this.TOKEN_KEY);
  }

  async removeToken(): Promise<void> {
    if (this.isSecureCookieSupported) {
      try {
        await (window as any).cookieStore.delete(this.TOKEN_KEY);
      } catch (error) {
        console.warn('Failed to remove secure cookie', error);
      }
    }
    
    localStorage.removeItem(this.TOKEN_KEY);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Invalid token', error);
      return false;
    }
  }

  private getTokenExpirationTime(token: string): number {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      // Default to 1 day if expiration is not in the token
      return decoded.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 86400;
    } catch (error) {
      return 86400; // Default to 1 day
    }
  }
}

const jwtService = new JwtService();
export default jwtService; 