import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import CalculatorAPI from '../api/calculator';
import { numberWithSpace } from '../utils/Format';
import { CalculatorResult, CalculatorType } from '../utils/Types';
import CalculatorWrapper from './CalculatorWrapper';
import ErrorScreen from './ErrorScreen';
import Loading from './Loading';
import ResultWrapper from './ResultWrapper';

interface Props {
	data: Record<'amountInterval' | 'termInterval', CalculatorType>;
}

const CalculatorScreen = ({ data }: Props) => {
	//here is too much logic in one component, move to smaller piece, to one hook or replace with reducer
	const [value, setValue] = useState<
		Record<'amountInterval' | 'termInterval', number | string>
	>({
		amountInterval: numberWithSpace(data.amountInterval?.defaultValue) || 0,
		termInterval: data.termInterval?.defaultValue || 0,
	});
	const [revalidateData, setRevalidateData] = useState<boolean>(false);

	const onChangeAmount = (amountInterval: number) => {
		setValue({ ...value, amountInterval: amountInterval });
	};

	const onChangeTerm = (termInterval: number) => {
		setValue({ ...value, termInterval: termInterval });
	};

	const [numOfRefetch, setNumOfRefetch] = useState(0);

	//can be in index.page and send to children instead here
	// use native fetch, instead axios
	// add useDebounce hook for delays and more smooth progres or try
	// to new React 18 features - useTransition and useDeferredValue
	const fetchResults = async () => {
		setNumOfRefetch((prev) => prev + 1);

		const response = await CalculatorAPI.get_loan(
			+value.amountInterval,
			+value.termInterval
		);
		if (!response.status) {
			throw new Error('Network response was not ok');
		}
		return response.data;
	};

	console.log('Num of refetch', numOfRefetch, value);

	//reuse unversal network component
	const {
		data: resultsData,
		isError: resultError,
		refetch,
	} = useQuery([value], () => fetchResults(), {
		enabled: revalidateData,
		staleTime: 5 * 60 * 1000, //move to constant or setup globally in app
		cacheTime: 5 * 60 * 1000,
		keepPreviousData: true,
	});

	//not needed right now
	useEffect(() => {
		refetch();
		setRevalidateData(false);
	}, [data]);

	return (
		<React.Fragment>
			<CalculatorWrapper
				{...data}
				selectedAmount={+value.amountInterval}
				selectedTerm={+value.termInterval}
				onChangeAmount={onChangeAmount}
				onChangeTerm={onChangeTerm}
				handleDataRefetch={setRevalidateData}
				revalidateData={revalidateData}
			/>
			{resultsData ? (
				<ResultWrapper {...resultsData} />
			) : resultError ? (
				<ErrorScreen userMessage='error - no data' />
			) : (
				<Loading />
			)}
		</React.Fragment>
	);
};

export default CalculatorScreen;
