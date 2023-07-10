import { httpClient } from '@/api/httpClient';
import MockAdapter from 'axios-mock-adapter';
import { SafeAny } from '@/utils';

interface InterceptorManager {
  handlers: {
    fulfilled: (config: SafeAny) => SafeAny;
  }[];
}

const getItem = jest
  .fn()
  .mockReturnValueOnce(JSON.stringify({ jwt_token: 'marvel_bs' }));

const unauthorizedResponse = {
  response: { status: 401, message: 'Unauthorized' },
};

describe('HttpClient', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(httpClient);
    Storage.prototype.getItem = getItem;
    Storage.prototype.removeItem = jest.fn();
  });

  afterEach(() => {
    mock.reset();
  });

  it('should have baseUrl correct', () => {
    expect(httpClient.defaults.baseURL).toEqual('http://localhost:3000/api/v1');
  });
  it('should have headers correct', () => {
    const headers = httpClient.defaults.headers;
    expect(headers.Accept).toEqual('application/json');
    expect(headers['Content-Type']).toEqual('application/json');
  });

  describe('Interceptor request', () => {
    it('should add token to headers', async () => {
      const config = httpClient.interceptors
        .request as unknown as InterceptorManager;
      const headers = config.handlers[0].fulfilled({ headers: {} });
      await expect(headers.headers.Authorization).toBe('Bearer marvel_bs');
    });
    it('should return 401 if the object in local storage is null', async () => {
      Storage.prototype.getItem = getItem.mockReturnValueOnce(null);
      const config = httpClient.interceptors
        .request as unknown as InterceptorManager;
      await expect(
        config.handlers[0].fulfilled({ headers: {} })
      ).rejects.toEqual({
        response: { status: 401, message: 'Unauthorized' },
      });
      expect(localStorage.removeItem).toBeCalledWith('user_bs');
    });

    it('should return 401 if there is no jwt_token in local storage', async () => {
      Storage.prototype.getItem = getItem.mockReturnValueOnce(
        JSON.stringify({})
      );
      const config = httpClient.interceptors
        .request as unknown as InterceptorManager;

      const request = config.handlers[0].fulfilled({ headers: {} });

      await expect(request).rejects.toEqual({
        response: { status: 401, message: 'Unauthorized' },
      });
      expect(localStorage.removeItem).toBeCalledWith('user_bs');
    });
  });

  describe('Interceptor response', () => {
    it('should return 401 if status is 401', async () => {
      const config = httpClient.interceptors
        .response as unknown as InterceptorManager;
      const response = config.handlers[0].fulfilled({ status: 401 });
      await expect(response).rejects.toEqual({
        response: { status: 401, message: 'Unauthorized' },
      });
      expect(localStorage.removeItem).toBeCalledWith('user_bs');
      expect(window.location.href).toEqual('http://localhost/');
    });
    it('should return 400 if status is 400', async () => {
      const config = httpClient.interceptors
        .response as unknown as InterceptorManager;
      const response = config.handlers[0].fulfilled({ status: 400 });
      await expect(response).rejects.toEqual({ status: 400 });
    });
    it('should return response if status is 200', async () => {
      const config = httpClient.interceptors
        .response as unknown as InterceptorManager;
      const response = config.handlers[0].fulfilled({ status: 200 });
      await expect(response).toEqual({ status: 200 });
    });
    it('should return a rejected promise if there is an error in the response ', async () => {
      mock.onGet('/users').reply(401, unauthorizedResponse);
      try {
        await httpClient.get('/users');
      } catch (error) {
        expect(localStorage.removeItem).toHaveBeenCalled();
        expect(error).toEqual(unauthorizedResponse);
      }
    });
  });
});
