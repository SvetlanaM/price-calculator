import { Dispatch, Ref } from 'react';
import Calculator from '../components/Calculator/index';
import { PriceRangeProps } from './Calculator/PriceRange';
import ColumnContainer from './ColumnContainer';

interface Props extends PriceRangeProps {
	calcRef: Ref<HTMLDivElement> | undefined;
	title: string;
	calculatedTitle: string;
	onChangeValue: (value: number) => void;
	handleDataRefetch: Dispatch<boolean>;
	revalidateData: boolean;
}

const CalculatorRow = (props: Props): JSX.Element => {
	return (
		<Calculator.Content>
			<ColumnContainer>
				<Calculator.Header title={props.title} />
				<Calculator.Header
					title={props.calculatedTitle}
					extraClassNames='text-3xl'
				/>
			</ColumnContainer>
			<Calculator.PriceRange
				min={props.min}
				max={props.max}
				value={props.value}
				step={props.step}
				onChangeValue={props.onChangeValue}
				handleDataRefetch={props.handleDataRefetch}
				revalidateData={props.revalidateData}
			/>
		</Calculator.Content>
	);
};

export default CalculatorRow;
