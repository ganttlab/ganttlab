import { AuthenticatableSource } from 'ganttlab-entities';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AxiosHeaders } from './AxiosHeaders';

export abstract class AxiosBackedAuthenticatableSource extends AuthenticatableSource {
  private axiosInstance: AxiosInstance | null = null;

  public setAxiosInstance(axiosInstance: AxiosInstance): void {
    this.axiosInstance = axiosInstance;
  }

  public async safeAxiosRequest<T>(
    requestConfig: AxiosRequestConfig,
  ): Promise<{ data: T; headers: AxiosHeaders }> {
    if (!this.axiosInstance) {
      throw new Error('Axios instance has not been initialized');
    }
    try {
      const response = await this.axiosInstance(requestConfig);
      if (response) {
        return {
          data: response.data,
          headers: response.headers,
        };
      }
      throw new Error('Unable to read the requested data');
    } catch (error) {
      if (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 401) {
            throw new Error('The request has not been authorized');
          } else {
            console.error(error);
            throw new Error(error.message);
          }
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error(error.request);
          throw new Error('No response was received');
        }
      }

      // Something happened in setting up the request that triggered an Error
      console.error(error.message);
      throw new Error('Unable to setup that request');
    }
  }
}
