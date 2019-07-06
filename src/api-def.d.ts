type JWTBody = {
	username: string
	password: string
	client_id: string
	grant_type: 'password'
}

type RefreshBody = {
	refresh_token: string
	grant_type: 'refresh_token'
	client_id: string
}
export interface BaseApi {
	'/External/OAuth2/Token': {
		POST: {
			body: RefreshBody | JWTBody
			response: {
				access_token: string
				token_type: 'bearer'
				expires_in: number
				refresh_token: string
			}
		}
	}
}

export interface TSOAppApi extends BaseApi {}
