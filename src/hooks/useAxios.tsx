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
import { useLocalStorage } from '../hooks';

type JwtType = {
	iss: string;
	exp: number;
	type: string;
};

export const useAxios = () => {
	const [storage, setStorage] = useLocalStorage(LOCAL_STORAGE_AUTH, INITIAL_STORAGE);
	const { dispatch } = useStore();

	const axiosInstance = axios.create({
		baseURL: BASE_URL,
		headers: { Authorization: `Bearer ${storage.access}` }
	});

	axiosInstance.interceptors.request.use(
		async (req) => {
			const access: JwtType = jwt_decode(storage.access);
			const isAccessTokenExpired = dayjs.unix(access?.exp).diff(dayjs()) < 1;

			if (!isAccessTokenExpired) return req;

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

			dispatch({ type: VerificationEnum.ACCESS, payload: newTokens.data.access });
			dispatch({ type: VerificationEnum.REFRESH, payload: newTokens.data.refresh });
			setStorage({ ...storage, access: newTokens.data.access, refresh: newTokens.data.refresh });

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			req.headers!.Authorization = `Bearer ${newTokens.data.access}`;

			return req;
		},
		(error) => {
			return Promise.reject(error.request);
		}
	);

	axiosInstance.interceptors.response.use(
		(res) => res,
		(error) => {
			if (Object.keys(error).length === 1 && 'message' in error) error.message = MESSAGE.ignore;

			return Promise.reject(error);
		}
	);

	return axiosInstance;
};
