import { Dispatch, SetStateAction } from 'react';

function handleChange(setState: Dispatch<SetStateAction<string>>) {
	return (event: React.ChangeEvent<HTMLInputElement>) => {
		setState(event.target.value);
	}
}

export default handleChange;