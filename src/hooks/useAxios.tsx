import { useLocalStorage } from '../helpers';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import axios from 'axios';
import {
	INITIAL_STORAGE,
	LOCAL_STORAGE_AUTH,
	BASE_URL,
	routes,
	useStore,
	VerificationEnum,
	MESSAGE
} from '../helpers';

type JwtType = {
	iss: string;
	exp: number;
	type: string;
};

export const useAxios = () => {
	const [storage, setStorage] = useLocalStorage(LOCAL_STORAGE_AUTH, INITIAL_STORAGE);
	const {
		state: { accessToken, refreshToken },
		dispatch
	} = useStore();

	const axiosInstance = axios.create({
		baseURL: BASE_URL,
		headers: { Authorization: `Bearer ${accessToken}` }
	});

	axiosInstance.interceptors.request.use(
		async (req) => {
			const access: JwtType = jwt_decode(accessToken);
			const isAccessTokenExpired = dayjs.unix(access?.exp).diff(dayjs()) < 1;

			if (!isAccessTokenExpired) return req;
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			req.headers!.Authorization = `Bearer ${refreshToken}`;

			const refresh: JwtType = jwt_decode(refreshToken);
			const isRefreshTokenExpired = dayjs.unix(refresh?.exp).diff(dayjs()) < 1;

			if (!isRefreshTokenExpired) return req;

			// don't use refresh, fetch new access token from refresh API, set them in localStorage nad make a new call with new accessToken
			try {
				const newTokens = await axios.post(
					`${BASE_URL}${routes.refresh}`,
					{},
					{
						headers: {
							Authorization: `Bearer ${refreshToken}`,
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*'
						}
					}
				);

				dispatch({ type: VerificationEnum.ACCESS, payload: newTokens.data.access });
				dispatch({ type: VerificationEnum.REFRESH, payload: newTokens.data.refresh });
				setStorage({ ...storage, access: newTokens.data.access, refresh: newTokens.data.refresh });
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				req.headers!.Authorization = `Bearer ${newTokens.data.access}`;

				return req;
			} catch (error: any) {
				error.message = MESSAGE.ignore;

				return Promise.reject(error);
			}
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	axiosInstance.interceptors.response.use(
		(res) => res,
		(error) => {
			// TODO: check for auth urls how to handle to not throw 401 fo refresh etc.
			if (Object.keys(error).length === 1 && 'message' in error) error.message = MESSAGE.ignore;

			return Promise.reject(error);
		}
	);

	return axiosInstance;
};
