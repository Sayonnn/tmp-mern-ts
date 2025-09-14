import { postDatas } from "../services/axios.service";

class ClientService {
  private static instance: ClientService;
  private static apiUrl:string = import.meta.env.VITE_API_URL;

  private constructor() {}
 
  public static getInstance(): ClientService {
    if (!ClientService.instance) {
      ClientService.instance = new ClientService();
    }
    return ClientService.instance;
  }
 
  /** Auth endpoints */
  public auth = {
    login: (data: { username: string; password: string }) => postDatas({ url: `${ClientService.apiUrl}/auth/login`, data }),
    logout: () => postDatas({ url: `${ClientService.apiUrl}/auth/logout` }),
    signup:() => null,
    forgotPassword:() => null,
    refreshToken: () => postDatas({ url: `${ClientService.apiUrl}/auth/refresh-access-token` }),
    refreshInformation: () => postDatas({ url: `${ClientService.apiUrl}/auth/refresh-client-information` }),
  };
}
 
export default ClientService.getInstance();
