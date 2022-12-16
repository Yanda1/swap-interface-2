import styled, { css } from 'styled-components';
import { useRef, useState } from 'react';
import { pxToRem, spacing } from '../../styles';
import { useStore } from '../../helpers';
import { TextField } from '../textField/textField';
import { Button } from '../button/button';
import { Portal } from './portal';

const Wrapper = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		display: flex;
		width: 100%;
		flex-direction: column;
		overflow-y: auto;
		align-items: center;
		padding: ${spacing[10]} ${spacing[20]};

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

		::-webkit-scrollbar-track-piece:end {
			background: transparent;
			margin-bottom: 15px;
		}

		::-webkit-scrollbar-track-piece:start {
			background: transparent;
			margin-top: 15px;
		}
	`;
});

// const Form = styled.form`
// 	display: flex;
// 	width: 100%;
// 	justify-content: center;
// 	align-items: center;
// 	flex-direction: column;
// 	overflow-y: scroll;
//
// 	& > input {
// 		margin-bottom: ${spacing[14]};
// 	}
// `;

// const Input = styled.input(({ borderColor }: any) => {
// 	const {
// 		state: { theme }
// 	} = useStore();
//
// 	return css`
// 		outline: none;
// 		border: 1px solid ${theme.border.default};
// 		width: ${pxToRem(200)};
// 		padding: ${spacing[16]};
// 		background-color: ${theme.background.secondary};
// 		border-radius: ${pxToRem(4)};
// 		margin-bottom: ${spacing[20]};
// 		color: ${theme.font.default};
//
// 		&:focus {
// 			border: 1px solid ${borderColor > 2 ? `${theme.button.success}` : `${theme.button.error}`};
// 		}
// 	`;
// });

const LabelInput = styled.label(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		text-align: center;
		cursor: pointer;
		width: ${pxToRem(100)};
		margin-bottom: ${pxToRem(20)};
		padding: ${spacing[4]};
		border: 1px solid ${theme.button.wallet};
		border-radius: ${pxToRem(4)};

		&:hover {
			border: 1px solid ${theme.border.secondary};
		}
	`;
});

const FileInput = styled.input`
	opacity: 0;
	position: absolute;
	z-index: -100;
`;

const PreviewImg = styled.img(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		width: ${pxToRem(150)};
		height: ${pxToRem(100)};
		// border: 2px dashed ${theme.border.secondary};
	`;
});

const FileNameText = styled.p`
	margin-bottom: ${spacing[10]};
`;

// type Props = {
// 	showModal: boolean;
// 	setShowModal: (prev: boolean) => void;
// };

export const KycL2Modal = () => {
	const [showModal, setShowModal] = useState(true);
	const [input, setInput] = useState<{
		placeOfBirth: string;
		netYearlyIncome: string;
		email: string;
		politicallyExposed: string;
		mailingAddress: string;
		prevailingSourceOfSuchIncome: string;
		gender: string;
		citizenships: string;
		taxResidency: string;
	}>({
		placeOfBirth: '',
		netYearlyIncome: '',
		email: '',
		politicallyExposed: '',
		mailingAddress: '',
		prevailingSourceOfSuchIncome: '',
		gender: '',
		citizenships: '',
		taxResidency: ''
	});
	const [file, setFile] = useState<any>(null);
	const [fileUrl, setFileUrl] = useState<any>(null);
	const fileReader = new FileReader();
	const fileInput = useRef<HTMLInputElement>();
	const [selectWorkAndBusinessActivity, setSelectWorkAndBusinessActivity] = useState<string[]>([]);
	const [workAndBusinessActivity, setWorkAndBusinessActivity] = useState<string[]>([]);
	const [workAndBusinessActivityList, setWorkAndBusinessActivityList] = useState<string[]>([
		'None of the hereinafter mentioned',
		'Arms Transaction',
		'Pawnshop activity',
		'Used car business',
		'Gambling and other similar games',
		'Secondary waste treatment',
		'Antiques and art shop',
		'Construction with participation in public procurement',
		'IT services with participation in public procurement',
		'State administration in the field of decision-making on subsidies and public procurement',
		'Business with a high volume of cash',
		'Precious metals Transaction',
		'Virtual currency trading',
		'Intangible rights trading',
		'Energy trading or emission allowances ',
		'Erotic industry',
		'Non-profit organizations, foundations or churches'
	]);
	const [sourceOfFundsIntendedForTransactionList, setSourceOfFundsIntendedForTransactionList] =
		useState<string[]>([
			'Employment or business',
			'Sale of real estate',
			'Heritage',
			'Financial instruments and capital assets',
			'Lease of real estate',
			'Other'
		]);

	const [fundsIrregularForBussines, setFundsIrregularForBussines] = useState<string[]>([
		'None',
		'Employment or business',
		'Sale of real estate',
		'Heritage',
		'Financial instruments and capital assets',
		'Lease of real estate',
		'Other'
	]);

	fileReader.onloadend = () => {
		setFileUrl(fileReader.result);
	};
	const [next, setNext] = useState(0);
	const handleNext = () => {
		setNext((prev: number) => prev + 1);
	};

	const handleSubmit = (event: any) => {
		event.preventDefault();
		setShowModal(!showModal);
	};

	const handleChangeInput = (event: any) => {
		console.log(event);
		// @ts-ignore
		setInput({ ...input, [event.target.name]: event.target.value });
	};

	const handleChangeCheckBoxActivity = (e: any) => {
		console.log(e);

		if (e.target.checked && !workAndBusinessActivity.includes(e.target.value)) {
			setWorkAndBusinessActivity([...workAndBusinessActivity, e.target.value]);
		} else if (!e.target.checked && workAndBusinessActivity.includes(e.target.value)) {
			const filteredArray = workAndBusinessActivity.filter((item) => item !== e.target.value);
			setWorkAndBusinessActivity(filteredArray);
		}
	};

	const handleChangeFileInput = () => {
		// @ts-ignore
		console.log(fileInput.current.files[0]);
		// @ts-ignore
		const file = fileInput.current.files[0];
		setFile(file);
		fileReader.readAsDataURL(file);
	};

	return (
		<Portal
			size="large"
			isOpen={showModal}
			handleClose={() => setShowModal(false)}
			hasBackButton
			handleBack={() => (next > 0 ? setNext((prev) => prev - 1) : null)}>
			<Wrapper>
				<h2 style={{ fontStyle: 'italic' }}>KYC Form</h2>
				{next === 0 && (
					<>
						<div
							style={{
								display: 'flex',
								marginBottom: '10px',
								flexWrap: 'wrap',
								justifyContent: 'center'
							}}>
							<div style={{ marginRight: '15px', marginBottom: '10px' }}>
								<div style={{ marginBottom: '10px' }}>
									<TextField
										value={input.placeOfBirth}
										placeholder="Place of birth"
										type="text"
										onChange={handleChangeInput}
										size="small"
										align="left"
										name="placeOfBirth"
									/>
								</div>
								<div style={{ marginBottom: '10px' }}>
									<TextField
										value={input.netYearlyIncome}
										placeholder="Net yearly income"
										type="text"
										onChange={handleChangeInput}
										size="small"
										align="left"
										required={true}
										name="netYearlyIncome"
									/>
								</div>
								<div style={{ marginBottom: '10px' }}>
									<TextField
										value={input.gender}
										placeholder="Gender"
										type="text"
										onChange={handleChangeInput}
										size="small"
										align="left"
										required={true}
										name="gender"
									/>
								</div>
								<div style={{ marginBottom: '10px' }}>
									<TextField
										value={input.taxResidency}
										placeholder="Tax residency"
										type="text"
										onChange={handleChangeInput}
										size="small"
										align="left"
										required={true}
										name="taxResidency"
									/>
								</div>
							</div>
							<div style={{ marginRight: '15px', marginBottom: '10px' }}>
								<div style={{ marginBottom: '10px' }}>
									<TextField
										value={input.mailingAddress}
										placeholder="Mailing address"
										type="text"
										onChange={handleChangeInput}
										size="small"
										align="left"
										required={false}
										name="mailingAddress"
									/>
								</div>
								<div style={{ marginBottom: '10px' }}>
									<TextField
										value={input.email}
										placeholder="Email"
										type="email"
										onChange={handleChangeInput}
										size="small"
										align="left"
										required={true}
										name="email"
									/>
								</div>
								<div style={{ marginBottom: '10px' }}>
									<TextField
										value={input.citizenships}
										placeholder="Citizenship(s)"
										type="text"
										onChange={handleChangeInput}
										size="small"
										align="left"
										required={true}
										name="citizenships"
									/>
								</div>
								<div style={{ marginBottom: '10px' }}>
									<TextField
										value={input.prevailingSourceOfSuchIncome}
										placeholder="Prevailing source of such income"
										type="text"
										onChange={handleChangeInput}
										size="small"
										align="left"
										required={false}
										name="prevailingSourceOfSuchIncome"
									/>
								</div>
							</div>
						</div>
					</>
				)}
				{next === 1 && (
					<>
						<div
							style={{
								display: 'flex',
								flexWrap: 'wrap',
								flexDirection: 'column',
								alignItems: 'stretch'
							}}>
							<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
								The Client conducts his work / business activity in these areas:
							</p>
							{workAndBusinessActivityList.map((activity: string, index: number) => {
								return (
									<div
										style={{
											display: 'flex',
											justifyContent: 'flex-start',
											marginBottom: '8px'
										}}>
										<input
											type="checkbox"
											value={activity}
											name={activity}
											id={`workAndBusinessActivityList-checkbox-${index}`}
											onClick={handleChangeCheckBoxActivity}
											// SAVE CHECKED IF WAS CHEKED BEFORE CLOSED MODAL
											checked={workAndBusinessActivity.includes(`${activity}`)}
										/>
										<label htmlFor={`workAndBusinessActivityList-checkbox-${index}`}>
											{activity}
										</label>
									</div>
								);
							})}

							<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
								Source of funds intended for Transaction:
							</p>
							{sourceOfFundsIntendedForTransactionList.map((activity: string, index: number) => {
								return (
									<div
										style={{
											display: 'flex',
											justifyContent: 'flex-start',
											marginBottom: '8px'
										}}>
										<input
											type="checkbox"
											value={activity}
											name={activity}
											id={`sourceOfFundsIntendedForTransactionList-checkbox-${index}`}
										/>
										<label htmlFor={`sourceOfFundsIntendedForTransactionList-checkbox-${index}`}>
											{activity}
										</label>
									</div>
								);
							})}
						</div>
					</>
				)}
				{next === 2 && (
					<>
						<div>
							<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
								State, which of the stated incomes of funds intended for business is irregular:
							</p>
							{fundsIrregularForBussines.map((activity: string, index: number) => {
								return (
									<div
										style={{
											display: 'flex',
											justifyContent: 'flex-start',
											marginBottom: '8px'
										}}>
										<input
											type="checkbox"
											value={activity}
											name={activity}
											id={`custom-checkbox-${index}`}
										/>
										<label htmlFor={`custom-checkbox-${index}`}>{activity}</label>
									</div>
								);
							})}
						</div>
					</>
				)}
				{next === 3 && (
					<>
						<LabelInput htmlFor="file-input">
							<FileInput
								id="file-input"
								type="file"
								ref={fileInput as any}
								onChange={handleChangeFileInput}
								required></FileInput>
							Upload file
						</LabelInput>
						<PreviewImg src={fileUrl ? fileUrl : null}></PreviewImg>
						<FileNameText>{file ? file.name : null} </FileNameText>
					</>
				)}
				{next === 4 && (
					<label>
						Pick your favorite flavor:
						<br />
						<select>
							<option value="grapefruit">Grapefruit</option>
							<option value="lime">Lime</option>
							<option selected value="coconut">
								Coconut
							</option>
							<option value="mango">Mango</option>
						</select>
					</label>
				)}
				{next === 5 && (
					<div>
						Thank you for your information! <br /> Please wait for the results!
						<p>Politically exposed person?</p>
						<div style={{ display: 'flex', marginBottom: '20px' }}>
							<TextField
								onChange={handleChangeInput}
								value="true"
								name="politicallyExposed"
								type="radio"
								id="radioForCitizenShipYes"
							/>
							<label htmlFor="radioForCitizenShipYes">Yes</label>
							<TextField
								onChange={handleChangeInput}
								value="false"
								name="politicallyExposed"
								type="radio"
								id="radioForCitizenShipNo"
							/>
							<label htmlFor="radioForCitizenShipNo">No</label>
						</div>
					</div>
				)}
				{next <= 5 && (
					<Button
						variant="secondary"
						onClick={handleNext}
						disabled={
							false
							// input.placeOfBirth.length < 3 ||
							// input.netYearlyIncome.length < 3 ||
							// input.email.length < 3 ||
							// !file
						}>
						Next
					</Button>
				)}
				{next > 5 && (
					<Button
						variant="secondary"
						// @ts-ignore
						onClick={handleSubmit}
						disabled={
							false
							// input.placeOfBirth.length < 3 ||
							// input.netYearlyIncome.length < 3 ||
							// input.email.length < 3 ||
							// !file
						}>
						Submit
					</Button>
				)}
			</Wrapper>
		</Portal>
	);
};
