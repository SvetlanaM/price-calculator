import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Meta from '../components/Meta';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			retry: false,
			staleTime: 5 * 60 * 1000,
		},
	},
});

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<Meta />
			<Component {...pageProps} />
		</QueryClientProvider>
	);
}

export default MyApp;
