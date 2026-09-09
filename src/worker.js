export default {
	async fetch(request, env, ctx) {
		if (request.method !== 'POST') {
			return new Response('Método no permitido', { status: 405 });
		}

		const data = await request.json();
		const url = new URL(request.url);

		if (url.pathname === '/expenses-log') {
			const { amount, description, location } = data;
			const date = new Date(data.date).getTime();

			try {
				const result = await env.DB.prepare(
					'INSERT INTO expenses (id, created_at, date, amount, description, location) VALUES (?, ?, ?, ?, ?, ?)',
				)
					.bind(crypto.randomUUID(), new Date().getTime(), date, amount, description, location)
					.run();

				return new Response(true, { status: 200 });
			} catch (error) {
				return new Response(false, { status: 500 });
			}
		}

		if (url.pathname === '/incomes-log') {
			const { amount, description } = data;
			const date = new Date(data.date).getTime();

			try {
				const result = await env.DB.prepare('INSERT INTO incomes (id, created_at, date, amount, description) VALUES (?, ?, ?, ?, ?)')
					.bind(crypto.randomUUID(), new Date().getTime(), date, amount, description)
					.run();

				return new Response(true, { status: 200 });
			} catch (error) {
				return new Response(false, { status: 500 });
			}
		}

		if (url.pathname === '/money-log') {
			const date = new Date(data.date).getTime();
			const moneyCash = Number(data.money_cash);
			const moneyAccount = Number(data.money_account);
			const totalMoney = moneyCash + moneyAccount;

			try {
				const result = await env.DB.prepare(
					'INSERT INTO money_daily (id, created_at, date, money_cash, money_account, total_money) VALUES (?, ?, ?, ?, ?, ?)',
				)
					.bind(crypto.randomUUID(), new Date().getTime(), date, moneyCash, moneyAccount, totalMoney)
					.run();

				return new Response(true, { status: 200 });
			} catch (error) {
				return new Response(false, { status: 500 });
			}
		}

		return new Response('OK', { status: 200 });
	},
};
