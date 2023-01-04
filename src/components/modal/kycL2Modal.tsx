import styled, { css } from 'styled-components';
import { useRef, useState } from 'react';
import { pxToRem, spacing } from '../../styles';
import { BASE_URL, findAndReplace, useStore } from '../../helpers';
import { TextField } from '../textField/textField';
import { Button } from '../button/button';
import { Portal } from './portal';
import axios from 'axios';
import { useToasts } from '../toast/toast';
import COUNTRIES from '../../data/listOfAllCountries.json';

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
	`;
});

const LabelInput = styled.label(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		text-align: center;
		cursor: pointer;
		min-width: ${pxToRem(120)};
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

const Select = styled.select`
	width: 100%;
	height: 100%;
`;

type Props = {
	showKycL2: boolean;
	updateShowKycL2?: any;
};
export const KycL2Modal = ({ showKycL2, updateShowKycL2 }: Props) => {
	// @ts-ignore
	const { addToast } = useToasts();
	const [showModal, setShowModal] = useState(showKycL2);
	const [input, setInput] = useState<{
		placeOfBirth: string;
		yearlyIncome: number | null;
		email: string;
		mailAddress: any;
		sourceOfIncome: string;
		gender: string;
		citizenship: string;
		taxResidency: string;
		politicallPerson: string;
		countryOfWork: string[];
		workArea: string[];
		sourceOfFunds: string[];
		sourceOfFundsOther: string;
		sourceOfIncomeNatureOther: string;
		irregularSourceOfFunds: string[];
		irregularSourceOfFundsOther: string;
		appliedSanctions: string;
		hasCriminalRecords: string;
		sourceOfIncomeNature: string[];
		declare: string[];
		declareOther: string;
		file: any;
		permanentAndMailAddressSame: string;
	}>({
		citizenship: '',
		countryOfWork: [],
		hasCriminalRecords: '',
		declare: [],
		declareOther: '',
		email: '',
		file: {
			poaDoc1: null,
			posofDoc1: null
		},
		irregularSourceOfFunds: [],
		irregularSourceOfFundsOther: '',
		gender: 'Male',
		permanentAndMailAddressSame: 'Yes',
		mailAddress: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			stateOrCountry: ''
		},
		sourceOfIncomeNature: [],
		sourceOfIncomeNatureOther: '',
		yearlyIncome: null,
		appliedSanctions: '',
		placeOfBirth: '',
		politicallPerson: '',
		sourceOfIncome: '',
		sourceOfFunds: [],
		sourceOfFundsOther: '',
		taxResidency: '',
		workArea: []
	});
	const fileInputAddress = useRef<HTMLInputElement>();
	const fileInputDocs = useRef<HTMLInputElement>();
	const [workAreaList] = useState<string[]>([
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
	const [sourceOfFundsList] = useState<string[]>([
		'Employment or business',
		'Sale of real estate',
		'Heritage',
		'Financial instruments and capital assets',
		'Lease of real estate',
		'Other'
	]);
	const [fundsIrregularForBussinesList] = useState<string[]>([
		'None',
		'Employment or business',
		'Sale of real estate',
		'Heritage',
		'Financial instruments and capital assets',
		'Lease of real estate',
		'Other'
	]);
	const [sourceOfIncomeNatureList] = useState<string[]>(['Employee', 'Other']);
	const [declareList] = useState<string[]>([
		'I am a national of the aforementioned sole state or country and simultaneously I am registered to a permanent or other type of residency in this state or country',
		'I am a national of another state or country, specifically:',
		'I am registered to a permanent or other type of residency in another state or country, specifically:'
	]);
	const [page, setPage] = useState<number>(0);
	const {
		state: { accessToken }
	} = useStore();

	const isDisabled =
		input.citizenship === '' ||
		!input.countryOfWork.length ||
		input.hasCriminalRecords === '' ||
		!input.declare.length ||
		input.email === '' ||
		input.file === '' ||
		!input.irregularSourceOfFunds.length ||
		input.mailAddress === '' ||
		!input.sourceOfIncomeNature.length ||
		input.yearlyIncome === null ||
		input.appliedSanctions === '' ||
		input.placeOfBirth === '' ||
		input.politicallPerson === '' ||
		input.sourceOfIncome === '' ||
		!input.sourceOfFunds.length ||
		input.taxResidency === '' ||
		!input.workArea.length;

	const handleNext = () => {
		setPage((prev: number) => prev + 1);
	};
	const handleSubmit = (event: any) => {
		event.preventDefault();
		// send POST if 200 change add toast and modal (Successful submit) to check kys if 401 bad request add toast like please pass kyc again
		const bodyFormData = new FormData();

		bodyFormData.append('placeOfBirth', input.placeOfBirth);
		bodyFormData.append('poaDoc1', input.file.poaDoc1);
		bodyFormData.append('posofDoc1', input.file.posofDoc1);
		bodyFormData.append('mailAddress', input.mailAddress);
		bodyFormData.append('gender', JSON.stringify(input.gender));
		bodyFormData.append('citizenship', input.citizenship);
		bodyFormData.append('email', input.email);
		bodyFormData.append('taxResidency', input.taxResidency);
		bodyFormData.append('politicallPerson', input.politicallPerson === 'Yes' ? 'true' : 'false');
		bodyFormData.append('appliedSanctions', input.appliedSanctions === 'Yes' ? 'true' : 'false');
		bodyFormData.append('countryOfWork', JSON.stringify(input.countryOfWork));
		bodyFormData.append('workArea', JSON.stringify(input.workArea));
		const sourceOfIncomeNature = findAndReplace(
			input.sourceOfIncomeNature,
			'Other',
			input.sourceOfIncomeNatureOther
		);
		bodyFormData.append('sourceOfIncomeNature', JSON.stringify(sourceOfIncomeNature));
		const yearlyIncome = input.yearlyIncome ? Number(input.yearlyIncome).toFixed(4) : '0';
		bodyFormData.append('yearlyIncome', yearlyIncome);
		bodyFormData.append('sourceOfIncome', input.sourceOfIncome);
		const sourceOfFunds = findAndReplace(input.sourceOfFunds, 'Other', input.sourceOfFundsOther);
		bodyFormData.append('sourceOfFunds', JSON.stringify(sourceOfFunds));
		const irregularSourceOfFunds = findAndReplace(
			input.irregularSourceOfFunds,
			'Other',
			input.irregularSourceOfFundsOther
		);
		bodyFormData.append('irregularSourceOfFunds', JSON.stringify(irregularSourceOfFunds));
		bodyFormData.append(
			'hasCriminalRecords',
			input.hasCriminalRecords === 'Yes' ? 'true' : 'false'
		);
		const declare = findAndReplace(input.declare, 'Other', input.declareOther);
		bodyFormData.append('declare', JSON.stringify(declare));
		// ADDED NEW KEYS TO FORM DATA
		bodyFormData.append('permanentAndMailAddressSame', input.permanentAndMailAddressSame);
		bodyFormData.append('mailAddress', input.mailAddress);
		console.log(bodyFormData);

		axios({
			method: 'POST',
			url: `${BASE_URL}kyc/l2-data`,
			data: bodyFormData,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: 'Bearer ' + accessToken
			}
		})
			.then(function (response) {
				// handle success
				console.log(response);
				if (response.status === 201) {
					addToast(
						'Your documents are under review, please wait for the results of the verification!',
						'info'
					);
				}
			})
			.catch(function (response) {
				// handle error
				console.log(response);
				addToast('Something went wrong, please fill the form and try again!', 'error');
			});
		updateShowKycL2(false);
	};
	const handleChangeInput = (event: any) => {
		setInput({ ...input, [event.target.name]: event.target.value });
	};
	const handleChangeMailInput = (event: any) => {
		setInput({
			...input,
			mailAddress: { ...input.mailAddress, [event.target.name]: event.target.value }
		});
	};
	const handleChangeCheckBox = (event: any) => {
		const { value, checked } = event.target;
		const attributeValue: string = event.target.attributes['data-key'].value;

		if (checked && !input[attributeValue as keyof typeof input].includes(value)) {
			setInput({
				...input,
				[attributeValue]: [...input[attributeValue as keyof typeof input], value]
			});
		}
		if (!checked && input[attributeValue as keyof typeof input].includes(value)) {
			const filteredArray: string[] = input[attributeValue as keyof typeof input].filter(
				(item: any) => item !== value
			);
			setInput({ ...input, [attributeValue]: [...filteredArray] });
		}
	};
	const handleChangeFileInput = () => {
		console.log(fileInputAddress);
		const filePosoaDoc1: any =
			fileInputAddress?.current?.files && fileInputAddress?.current?.files[0];
		console.log(filePosoaDoc1);
		const filePosofDoc1: any = fileInputDocs?.current?.files && fileInputDocs?.current?.files[0];
		setInput({
			...input,
			file: { ...input.file, poaDoc1: filePosoaDoc1, posofDoc1: filePosofDoc1 }
		});
	};

	const handleDropDownInput = (event: any) => {
		// @ts-ignore
		setInput({ ...input, gender: [event.target.value] });
	};

	const handleOnClose = () => {
		setShowModal(false);
		updateShowKycL2(false);
	};

	return showModal ? (
		<Portal
			size="large"
			isOpen={showModal}
			handleClose={handleOnClose}
			hasBackButton
			handleBack={() => (page > 0 ? setPage((prev: number) => prev - 1) : null)}>
			<Wrapper>
				<h2 style={{ fontStyle: 'italic' }}>KYC L2 form for Natural Person</h2>
				{page === 0 && (
					<>
						<div
							style={{
								marginBottom: '10px'
							}}>
							<div style={{ marginRight: '15px', marginBottom: '10px' }}>
								<div style={{ marginBottom: '10px' }}>
									<label
										htmlFor="label-place-of-birth"
										style={{ marginBottom: '8px', display: 'inline-block', fontStyle: 'italic' }}>
										Place of birth
									</label>
									<TextField
										id="label-place-of-birth"
										value={input.placeOfBirth}
										placeholder="Place of birth"
										type="text"
										onChange={handleChangeInput}
										size="small"
										align="left"
										name="placeOfBirth"
										required={true}
										error={input.placeOfBirth.length < 2}
									/>
								</div>
								<div style={{ marginBottom: '10px' }}>
									<label
										htmlFor="label-net-yearly-income"
										style={{ marginBottom: '8px', display: 'inline-block', fontStyle: 'italic' }}>
										Net yearly income (Euro)
									</label>
									<TextField
										id="label-net-yearly-income"
										value={input.yearlyIncome !== null && input.yearlyIncome}
										placeholder="Net yearly income"
										type="number"
										onChange={handleChangeInput}
										size="small"
										align="left"
										required
										name="yearlyIncome"
										error={input.yearlyIncome === null}
									/>
								</div>
								<div style={{ marginBottom: '10px' }}>
									<label
										htmlFor="label-email"
										style={{ marginBottom: '8px', display: 'inline-block', fontStyle: 'italic' }}>
										Email
									</label>
									<TextField
										id="label-email"
										value={input.email}
										placeholder="Email"
										type="email"
										onChange={handleChangeInput}
										size="small"
										align="left"
										required
										name="email"
										error={input.email.length < 2}
									/>
								</div>
								<div style={{ marginBottom: '10px' }}>
									<label htmlFor="label-select-gender" style={{ fontStyle: 'italic' }}>
										Gender
										<Select
											onChange={handleDropDownInput}
											value={input.gender}
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
							</div>
							{/* <div style={{ marginBottom: '10px' }}> */}
							{/* 	<TextField */}
							{/* 		value={input.citizenship} */}
							{/* 		placeholder="Citizenship(s)" */}
							{/* 		type="text" */}
							{/* 		onChange={handleChangeInput} */}
							{/* 		size="small" */}
							{/* 		align="left" */}
							{/* 		required */}
							{/* 		name="citizenship" */}
							{/* 	/> */}
							{/* </div> */}
							{/* </div> */}
						</div>
					</>
				)}
				{page === 1 && (
					<>
						<div style={{ marginBottom: '10px', width: '100%' }}>
							<label
								htmlFor="label-sourceOfIncome"
								style={{ marginBottom: '8px', display: 'inline-block' }}>
								Prevailing source of such income (employment/business, real estate, trading, etc.)
							</label>
							<TextField
								id="label-sourceOfIncome"
								value={input.sourceOfIncome}
								placeholder="Prevailing source of such income"
								type="text"
								onChange={handleChangeInput}
								size="small"
								align="left"
								name="sourceOfIncome"
								required
							/>
						</div>
						<div style={{ marginBottom: '10px', width: '100%' }}>
							<TextField
								value={input.taxResidency}
								placeholder="Tax residency"
								type="text"
								onChange={handleChangeInput}
								size="small"
								align="left"
								required
								name="taxResidency"
							/>
						</div>
						<div style={{ marginBottom: '10px', width: '100%' }}>
							<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
								Country in which the Client conducts his work / business activity
							</p>
							{COUNTRIES.map((country: any, index: number) => {
								return (
									<div
										key={index}
										style={{
											display: 'flex',
											justifyContent: 'flex-start',
											marginBottom: '8px'
										}}>
										<input
											type="checkbox"
											value={country.name}
											name={country.name}
											id={`countryOfWork-checkbox-${index}`}
											onChange={handleChangeCheckBox}
											// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
											checked={input.countryOfWork.includes(`${country.name}`)}
											required
											data-key="countryOfWork"
										/>
										<label htmlFor={`countryOfWork-checkbox-${index}`}>{country.name}</label>
									</div>
								);
							})}
						</div>
					</>
				)}
				{page === 2 && (
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							flexDirection: 'column',
							alignItems: 'stretch',
							marginBottom: '15px'
						}}>
						<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
							The Client conducts his work / business activity in these areas:
						</p>
						{workAreaList.map((activity: string, index: number) => {
							return (
								<div
									key={index}
									style={{
										display: 'flex',
										justifyContent: 'flex-start',
										marginBottom: '8px'
									}}>
									<input
										type="checkbox"
										value={activity}
										name={activity}
										id={`workAreaList-checkbox-${index}`}
										onChange={handleChangeCheckBox}
										// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
										checked={input.workArea.includes(`${activity}`)}
										required
										data-key="workArea"
									/>
									<label htmlFor={`workAreaList-checkbox-${index}`}>{activity}</label>
								</div>
							);
						})}

						<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
							Source of funds intended for Transaction:
						</p>
						{sourceOfFundsList.map((activity: string, index: number) => {
							return (
								<div
									key={index}
									style={{
										display: 'flex',
										justifyContent: 'flex-start',
										marginBottom: '8px'
									}}>
									<input
										type="checkbox"
										value={activity}
										name={activity}
										id={`sourceOfFundsList-checkbox-${index}`}
										onChange={handleChangeCheckBox}
										// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
										checked={input.sourceOfFunds.includes(`${activity}`)}
										required={true}
										data-key="sourceOfFunds"
									/>
									<label htmlFor={`sourceOfFundsList-checkbox-${index}`}>{activity}</label>
								</div>
							);
						})}
						{input.sourceOfFunds.includes('Other') ? (
							<TextField
								value={input.sourceOfFundsOther}
								type="text"
								placeholder="Specify..."
								onChange={handleChangeInput}
								size="small"
								align="left"
								name="sourceOfFundsOther"
							/>
						) : null}

						<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
							Nature of prevailing source of income
						</p>
						{sourceOfIncomeNatureList.map((activity: string, index: number) => {
							return (
								<div
									key={index}
									style={{
										display: 'flex',
										justifyContent: 'flex-start',
										marginBottom: '8px'
									}}>
									<input
										type="checkbox"
										value={activity}
										name={activity}
										id={`sourceOfIncomeNatureList-checkbox-${index}`}
										onChange={handleChangeCheckBox}
										// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
										checked={input.sourceOfIncomeNature.includes(`${activity}`)}
										required={true}
										data-key="sourceOfIncomeNature"
									/>
									<label htmlFor={`sourceOfIncomeNatureList-checkbox-${index}`}>{activity}</label>
								</div>
							);
						})}
						{input.sourceOfIncomeNature.includes('Other') ? (
							<TextField
								value={input.sourceOfIncomeNatureOther}
								type="text"
								placeholder="Food industry, hospitality, transportation, consultancy, agriculture, IT, science, etc."
								onChange={handleChangeInput}
								size="small"
								align="left"
								name="sourceOfIncomeNatureOther"
							/>
						) : null}
					</div>
				)}
				{page === 3 && (
					<>
						<div style={{ marginBottom: '15px' }}>
							<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
								State, which of the stated incomes of funds intended for business is irregular:
							</p>
							{fundsIrregularForBussinesList.map((activity: string, index: number) => {
								return (
									<div
										key={index}
										style={{
											display: 'flex',
											justifyContent: 'flex-start',
											marginBottom: '8px'
										}}>
										<input
											type="checkbox"
											value={activity}
											name={activity}
											id={`fundsIrregularForBussinesList-checkbox-${index}`}
											onChange={handleChangeCheckBox}
											// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
											checked={input.irregularSourceOfFunds.includes(`${activity}`)}
											required={true}
											data-key="irregularSourceOfFunds"
										/>
										<label htmlFor={`fundsIrregularForBussinesList-checkbox-${index}`}>
											{activity}
										</label>
									</div>
								);
							})}
							{input.irregularSourceOfFunds.includes('Other') ? (
								<TextField
									value={input.irregularSourceOfFundsOther}
									type="text"
									placeholder="Specify..."
									onChange={handleChangeInput}
									size="small"
									align="left"
									name="irregularSourceOfFundsOther"
								/>
							) : null}
							<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
								I declare that:
							</p>
							{declareList.map((activity: string, index: number) => {
								return (
									<div
										key={index}
										style={{
											display: 'flex',
											justifyContent: 'flex-start',
											marginBottom: '8px'
										}}>
										<input
											type="checkbox"
											value={activity}
											name={activity}
											id={`declareList-checkbox-${index}`}
											onChange={handleChangeCheckBox}
											// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
											checked={input.declare.includes(`${activity}`)}
											required={true}
											data-key="declare"
										/>
										<label htmlFor={`declareList-checkbox-${index}`}>{activity}</label>
									</div>
								);
							})}
							{input.declare.includes(
								'I am a national of another state or country, specifically:'
							) ? (
								<TextField
									value={input.declareOther}
									type="text"
									placeholder="Specify..."
									onChange={handleChangeInput}
									size="small"
									align="left"
									name="declareOther"
								/>
							) : null}
							{input.declare.includes(
								'I am registered to a permanent or other type of residency in another state or country, specifically:'
							) ? (
								<TextField
									value={input.declareOther}
									type="text"
									placeholder="Specify..."
									onChange={handleChangeInput}
									size="small"
									align="left"
									name="declareOther"
								/>
							) : null}
						</div>
					</>
				)}
				{page === 4 && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							marginBottom: '25px',
							alignItems: 'center'
						}}>
						<p style={{ marginBottom: '25px' }}>
							Have you ever been convicted or prosecuted for a criminal offense, in particular an
							offense against property or economic offense committed not only in relation with work
							or business activities (without regards to presumption of innocence)?
						</p>
						<div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
							<label htmlFor="hasCriminalRecordsTrue">
								{' '}
								Yes
								<input
									id="hasCriminalRecordsTrue"
									type="radio"
									value="Yes"
									checked={input.hasCriminalRecords === 'Yes'}
									onChange={handleChangeInput}
									name="hasCriminalRecords"
								/>
							</label>
							<label htmlFor="hasCriminalRecordsFalse">
								No
								<input
									id="hasCriminalRecordsFalse"
									type="radio"
									value="No"
									checked={input.hasCriminalRecords === 'No'}
									onChange={handleChangeInput}
									name="hasCriminalRecords"
								/>
							</label>
						</div>
						<p style={{ marginBottom: '25px' }}>
							Person against whom are applied CZ/international sanctions?
						</p>
						<div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
							<label htmlFor="appliedSanctionsTrue">
								Yes
								<input
									id="appliedSanctionsTrue"
									type="radio"
									value="Yes"
									checked={input.appliedSanctions === 'Yes'}
									onChange={handleChangeInput}
									name="appliedSanctions"
								/>
							</label>
							<label htmlFor="appliedSanctionsFalse">
								No
								<input
									id="appliedSanctionsFalse"
									type="radio"
									value="No"
									checked={input.appliedSanctions === 'No'}
									onChange={handleChangeInput}
									name="appliedSanctions"
								/>
							</label>
						</div>
						<p style={{ marginBottom: '25px' }}>Politically exposed person?</p>
						<div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
							<label htmlFor="politicallPersonTrue">
								Yes
								<input
									id="politicallPersonTrue"
									type="radio"
									value="Yes"
									checked={input.politicallPerson === 'Yes'}
									onChange={handleChangeInput}
									name="politicallPerson"
								/>
							</label>
							<label htmlFor="politicallPersonFalse">
								No
								<input
									id="politicallPersonFalse"
									type="radio"
									value="No"
									checked={input.politicallPerson === 'No'}
									onChange={handleChangeInput}
									name="politicallPerson"
								/>
							</label>
						</div>
					</div>
				)}
				{page === 5 && (
					<>
						<p>
							Copies of statements of account kept by an institution in the EEA (proof of address)
						</p>
						<LabelInput htmlFor="file-input-address">
							<FileInput
								id="file-input-address"
								type="file"
								ref={fileInputAddress as any}
								onChange={handleChangeFileInput}
								required={true}></FileInput>
							{input.file.poaDoc1 ? input.file.poaDoc1.name : 'Upload File'}
						</LabelInput>
						<p>
							Documents proving information on the source of funds (for instance: payslip, tax
							return etc.)
						</p>
						<LabelInput htmlFor="file-input-proof">
							<FileInput
								id="file-input-proof"
								type="file"
								ref={fileInputDocs as any}
								onChange={handleChangeFileInput}
								required={true}></FileInput>
							{input.file.posofDoc1 ? input.file.posofDoc1.name : 'Upload File'}
						</LabelInput>
					</>
				)}
				{page === 6 && (
					<>
						<p style={{ marginBottom: '25px' }}>
							Is your permanent address the same as your mailing address?
						</p>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-evenly',
								width: '100%',
								marginBottom: '20px'
							}}>
							<label htmlFor="label-mailing-permanent-address-true">
								Yes
								<input
									id="label-mailing-permanent-address-true"
									type="radio"
									value="Yes"
									checked={input.permanentAndMailAddressSame === 'Yes'}
									onChange={handleChangeInput}
									name="permanentAndMailAddressSame"
								/>
							</label>
							<label htmlFor="label-mailing-permanent-address-false">
								No
								<input
									id="label-mailing-permanent-address-false"
									type="radio"
									value="No"
									checked={input.permanentAndMailAddressSame === 'No'}
									onChange={handleChangeInput}
									name="permanentAndMailAddressSame"
								/>
							</label>
						</div>
						{input.permanentAndMailAddressSame === 'No' && (
							<div
								style={{
									marginBottom: '12px',
									display: 'flex',
									flexDirection: 'column',
									width: '50%'
								}}>
								<label
									htmlFor="label-address-street"
									style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
									Street
								</label>
								<TextField
									id="label-address-street"
									value={input.mailAddress.street}
									placeholder="Street"
									type="text"
									onChange={handleChangeMailInput}
									size="small"
									align="left"
									name="street"
								/>
								<label
									htmlFor="label-address-street-number"
									style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
									Street number
								</label>
								<TextField
									id="label-address-street-number"
									value={input.mailAddress.streetNumber}
									placeholder="Street number"
									type="text"
									onChange={handleChangeMailInput}
									size="small"
									align="left"
									name="streetNumber"
								/>
								<label
									htmlFor="label-address-municipality"
									style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
									Municipality
								</label>
								<TextField
									id="label-address-municipality"
									value={input.mailAddress.municipality}
									placeholder="Municipality"
									type="text"
									onChange={handleChangeMailInput}
									size="small"
									align="left"
									name="municipality"
								/>
								<label
									htmlFor="label-address-zipCode"
									style={{ margin: '6px 0 8px 0', display: 'inline-block', fontStyle: 'italic' }}>
									ZIP Code
								</label>
								<TextField
									id="label-address-zipCode"
									value={input.mailAddress.zipCode}
									placeholder="ZIP Code"
									type="text"
									onChange={handleChangeMailInput}
									size="small"
									align="left"
									name="zipCode"
								/>
							</div>
						)}
					</>
				)}
				{page < 6 && (
					<Button variant="secondary" onClick={handleNext}>
						Next
					</Button>
				)}
				{page >= 6 && (
					<Button
						variant="secondary"
						// @ts-ignore
						onClick={handleSubmit}
						disabled={isDisabled}>
						{isDisabled ? 'Please fill in all the fields of the form' : 'Submit'}
					</Button>
				)}
			</Wrapper>
		</Portal>
	) : null;
};
