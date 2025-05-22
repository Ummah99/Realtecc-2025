import jwtService from './JwtService';

/**
 * Gets the current JWT token from the service
 * @returns A Promise that resolves to the JWT token or null if not available
 */
export const getJwtToken = async (): Promise<string | null> => {
  return await jwtService.getToken();
};

/**
 * Checks if the user is authenticated
 * @returns A Promise that resolves to a boolean indicating if the user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  return await jwtService.isAuthenticated();
};

export default { getJwtToken, isAuthenticated }; 