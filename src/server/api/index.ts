import { vValidator } from '@hono/valibot-validator'
import { Hono } from "hono"
import { object, string } from "valibot"
import { env } from 'hono/adapter'

type Env = {
	MY_VAR: string
}
export const apiApp = new Hono()

const route = apiApp.get('/clock', (c) => {
	const { MY_VAR } = env<Env>(c);
	return c.json({
		var: MY_VAR,
		time: new Date().toLocaleTimeString()
	})
}).get(
	'/hello',
	vValidator(
		'query',
		object({
			name: string(),
		})
	),
	(c) => {
		const { name } = c.req.valid('query')
		return c.json({
			message: `Hello! ${name}`,
		})
	}
)

export type HonoApiRoute = typeof route
