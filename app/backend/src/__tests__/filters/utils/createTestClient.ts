import fetch from "node-fetch"

export function createTestClient(url: string, ctx: any) {
	const doQuery = async (query: string, { variables = {} } = {}) => {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"x-test-context": JSON.stringify(ctx),
			},
			body: JSON.stringify({ query, variables }),
		})
		const json = await res.json()
		return json
	}
	return { query: doQuery }
}
