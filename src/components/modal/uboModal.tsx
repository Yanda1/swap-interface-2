import styled, { css } from 'styled-components';
import { Portal } from './portal';
import { TextField } from '../textField/textField';
import { useEffect, useState } from 'react';
import { Button } from '../button/button';
import { useStore } from '../../helpers';
import { pxToRem } from '../../styles';

const Wrapper = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		flex-wrap: wrap;
		overflow-y: auto;

		::-webkit-scrollbar {
			display: block;
			width: 1px;
			background-color: ${theme.background.tertiary};
		}

		::-webkit-scrollbar-thumb {
			display: block;
			background-color: ${theme.button.default};
			border-radius: ${pxToRem(4)};
			border-right: none;
			border-left: none;
		}

		::-webkit-scrollbar-track-piece {
			display: block;
			background: ${theme.button.disabled};
		}
	`;
});

const Select = styled.select`
	width: 100%;
	height: 100%;
`;

type Props = {
	addUbo?: any;
	updateUboModalShow?: any;
};
export const UboModal = ({ addUbo = false, updateUboModalShow }: Props) => {
	const [showModal, setShowModal] = useState<boolean>(false);
	useEffect(() => {
		setShowModal(addUbo);
	}, [addUbo]);
	const [client, setClient] = useState({
		companyName: 'Apple',
		idNumber: '1',
		placeOfBirth: 'Ukraine',
		gender: 'Male',
		citizenship: '',
		state: 'Kiev',
		taxResidence: ''
	});

	const handleChangeClientInput = (event: any) => {
		setClient({
			...client,
			[event.target.name]: event.target.value
		});
	};

	const handleDropDownInput = (event: any) => {
		setClient({ ...client, [event.target.name]: event.target.value });
	};

	const handleClose = () => {
		// event.stopPropagation();
		// event.preventDefault();
		updateUboModalShow(false);
	};

	const handleSubmit = () => {
		updateUboModalShow(false, client);
	};

	return (
		// @ts-ignore
		<Portal size="large" isOpen={showModal} handleClose={(e: any) => handleClose(e)}>
			<Wrapper>
				<h3 style={{ margin: '0' }}>Information on Ultimate Beneficial Owner(s) (optional)</h3>
				<div style={{ padding: '6px' }}>
					<label
						htmlFor="label-ubo-company-name"
						style={{
							margin: '6px 0 8px 0',
							display: 'inline-block',
							fontStyle: 'italic'
						}}>
						Name and surname / business company /name
					</label>
					<TextField
						id="label-ubo-company-name"
						value={client.companyName}
						placeholder="Name and surname / business company /name"
						type="text"
						onChange={handleChangeClientInput}
						size="small"
						align="left"
						name="companyName"
						error={client.companyName.length < 2}
					/>
					<label
						htmlFor="label-ubo-id-number"
						style={{
							margin: '6px 0 8px 0',
							display: 'inline-block',
							fontStyle: 'italic'
						}}>
						Birth identification number / identification number
					</label>
					<TextField
						id="label-ubo-id-number"
						value={client.idNumber}
						placeholder="Birth identification number / identification number"
						type="text"
						onChange={handleChangeClientInput}
						size="small"
						align="left"
						name="idNumber"
						error={client.idNumber.length < 2}
					/>
					<label
						htmlFor="label-ubo-place-of-birth"
						style={{
							margin: '6px 0 8px 0',
							display: 'inline-block',
							fontStyle: 'italic'
						}}>
						Place of Birth
					</label>
					<TextField
						id="label-ubo-place-of-birth"
						value={client.placeOfBirth}
						placeholder="Place of Birth"
						type="text"
						onChange={handleChangeClientInput}
						size="small"
						align="left"
						name="placeOfBirth"
						error={client.placeOfBirth.length < 2}
					/>
					<div style={{ marginBottom: '10px' }}>
						<label htmlFor="label-select-gender" style={{ fontStyle: 'italic' }}>
							Gender
							<Select
								name="gender"
								onChange={handleDropDownInput}
								value={client.gender}
								id="label-select-gender"
								style={{
									minHeight: '40px',
									marginTop: '15px',
									backgroundColor: '#1c2125',
									color: 'white',
									borderRadius: '6px'
								}}>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Other">Other</option>
							</Select>
						</label>
					</div>
					<label
						htmlFor="label-ubo-pc-tax-residence"
						style={{
							margin: '6px 0 8px 0',
							display: 'inline-block',
							fontStyle: 'italic'
						}}>
						Tax Residence
					</label>
					<TextField
						id="label-ubo-pc-tax-residence"
						value={client.taxResidence}
						placeholder="PC"
						type="text"
						onChange={handleChangeClientInput}
						size="small"
						align="left"
						name="taxResidence"
						error={client.taxResidence.length < 2}
					/>
				</div>
				<Button variant="secondary" onClick={handleSubmit}>
					Add UBO
				</Button>
			</Wrapper>
		</Portal>
	);
};
