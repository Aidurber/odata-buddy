import axios from 'restyped-axios'

import { TSOAppApi } from './api-def'

const api = axios.create<TSOAppApi>({
	baseURL: 'https://api-support.thesportsoffice.net'
})

async function login(username: string, password: string) {
	const res = await api.post('/external/oauth2/token', {
		username,
		password,
		client_id: 'Blackrod',
		grant_type: 'password'
	})

	res.data.access_token
}

class Api {
	get(url: string)
}
