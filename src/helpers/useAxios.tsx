import { useLocalStorage } from '../helpers';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import axios from 'axios';
import { initialStorage, LOCAL_STORAGE_AUTH, BASE_URL, routes } from '../helpers';
import { useEthers } from '@usedapp/core';

type JwtType = {
	iss: string;
	exp: number;
	type: string;
};

export const useAxios = () => {
	const { account } = useEthers();
	const [storage, setStorage] = useLocalStorage(LOCAL_STORAGE_AUTH, initialStorage);

	const axiosInstance = axios.create({
		baseURL: BASE_URL,
		headers: { Authorization: `Bearer ${storage?.access}` }
	});

	axiosInstance.interceptors.request.use(
		async (req) => {
			console.log(
				'%c IN INTERCEPTOR REQUESAT => REQ: ',
				'background-color: red',
				storage?.account,
				account
			);

			if (account !== storage.account) {
				throw new axios.Cancel('Operation canceled by the user.');
			}

			// if (!storage.access || !storage.refresh) {
			// 	const nonce = await axios.request({
			// 		url: `${BASE_URL}${routes.getNonce}${account}`
			// 	});
			// 	const msg = getMetamaskMessage(nonce.data.nonce);
			// 	const signature = await library?.send('personal_sign', [account, msg]);
			// 	const data = await axios.post(`${BASE_URL}${routes.auth}`, {
			// 		data: { address: account, signature }
			// 	});
			// 	console.log('data', data);
			// }

			const accessToken: JwtType = jwt_decode(storage?.access);
			const isAccessTokenExpired = dayjs.unix(accessToken?.exp).diff(dayjs()) < 1;

			if (!isAccessTokenExpired) return req;

			req.headers!.Authorization = `Bearer ${storage?.refresh}`;

			const refreshToken: JwtType = jwt_decode(storage?.refresh);
			const isRefreshTokenExpired = dayjs.unix(refreshToken?.exp).diff(dayjs()) < 1;

			if (!isRefreshTokenExpired) return req;

			const newTokens = await axios.post(
				`${BASE_URL}${routes.refresh}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${storage.refresh}`,
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					}
				}
			);
			setStorage({ ...storage, access: newTokens.data.access, refresh: newTokens.data.refresh });
			req.headers!.Authorization = `Bearer ${newTokens.data.access}`;

			return req;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	return axiosInstance;
};
