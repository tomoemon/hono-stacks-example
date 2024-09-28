import { createLazyFileRoute } from '@tanstack/react-router'
import { hc } from 'hono/client'
import { useEffect, useState } from 'react'
import { HonoApiRoute } from '../../server/api'

export const Route = createLazyFileRoute('/')({
	component: Index,
})

function Index() {
	return (
		<>
			<h1> Hono with React!</h1>
			<h2>Hello</h2>
			<Hello />
			<h2>Example of useState()</h2>
			<Counter />
			<h2>Example of API fetch()</h2>
			<ClockButton />
		</>
	)
}

function Hello() {
	const api = hc<HonoApiRoute>('/api')
	const [response, setResponse] = useState<string | null>(null)
	useEffect(() => {
		(async function fetchData() {
			const res = await api.hello.$get({ query: { name: "bob" } });
			setResponse((await res.json()).message)
		})();
	}, []);
	return <div>{response}</div>
}

function Counter() {
	const [count, setCount] = useState(0)
	return <button onClick={() => setCount(count + 1)}>You clicked me {count} times</button>
}

const ClockButton = () => {
	const api = hc<HonoApiRoute>('/api')
	const [response, setResponse] = useState<string | null>(null)

	const handleClick = async () => {
		const response = await api.clock.$get();
		const data = await response.json()
		const headers = Array.from(response.headers.entries()).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
		const fullResponse = {
			url: response.url,
			status: response.status,
			headers,
			body: data
		}
		setResponse(JSON.stringify(fullResponse, null, 2))
	}

	return (
		<div>
			<button onClick={handleClick}>Get Server Time</button>
			{response && <pre>{response}</pre>}
		</div>
	)
}
