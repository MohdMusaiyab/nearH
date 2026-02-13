export type ActionResponse<T = null> = {
  success: boolean;
  message: string;
  data: T | null;
  errors?: Record<string, string[]>; 
};
