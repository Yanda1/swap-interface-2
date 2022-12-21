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
	`;
});

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

type Props = {
	showKycL2: boolean;
	updateShowKycL2?: any;
};
export const KycL2Modal = ({ showKycL2, updateShowKycL2 }: Props) => {
	const [showModal, setShowModal] = useState(showKycL2);
	console.log(showModal);
	const [input, setInput] = useState<{
		placeOfBirth: string;
		netYearlyIncome: string;
		email: string;
		mailingAddress: string;
		prevailingSourceOfIncome: string;
		gender: string;
		citizenship: string;
		taxResidency: string;
		politicallyExposedPerson: string;
		countryOfClientConductsActivity: string;
		workAndBusinessActivity: string[];
		sourceOfFundsIntendedForTransaction: string[];
		sourceOfFundsIntendedForTransactionOther: string;
		natureOfPrevailingSourceOfIncomeOther: string;
		fundsIrregularForBusiness: string[];
		fundsIrregularForBusinessOther: string;
		personAgainstWhomAppliedCzOrInternationalSanctions: string;
		criminalOffense: string;
		natureOfPrevailingSourceOfIncome: string[];
		declare: string[];
		declareOther: string;
		file: any;
	}>({
		citizenship: '',
		countryOfClientConductsActivity: '',
		criminalOffense: '',
		declare: [],
		declareOther: '',
		email: '',
		file: null,
		fundsIrregularForBusiness: [],
		fundsIrregularForBusinessOther: '',
		gender: '',
		mailingAddress: '',
		natureOfPrevailingSourceOfIncome: [],
		natureOfPrevailingSourceOfIncomeOther: '',
		netYearlyIncome: '',
		personAgainstWhomAppliedCzOrInternationalSanctions: '',
		placeOfBirth: '',
		politicallyExposedPerson: '',
		prevailingSourceOfIncome: '',
		sourceOfFundsIntendedForTransaction: [],
		sourceOfFundsIntendedForTransactionOther: '',
		taxResidency: '',
		workAndBusinessActivity: []
	});
	const { citizenship } = input;
	const isDisabled =
		citizenship === '' ||
		input.countryOfClientConductsActivity === '' ||
		input.criminalOffense === '' ||
		!input.declare.length ||
		input.email === '' ||
		input.file === '' ||
		!input.fundsIrregularForBusiness.length ||
		input.gender === '' ||
		input.mailingAddress === '' ||
		!input.natureOfPrevailingSourceOfIncome.length ||
		input.netYearlyIncome === '' ||
		input.personAgainstWhomAppliedCzOrInternationalSanctions === '' ||
		input.placeOfBirth === '' ||
		input.politicallyExposedPerson === '' ||
		input.prevailingSourceOfIncome === '' ||
		!input.sourceOfFundsIntendedForTransaction.length ||
		input.taxResidency === '' ||
		!input.workAndBusinessActivity.length;

	// const [file, setFile] = useState<any>(null);
	const [fileUrl, setFileUrl] = useState<any>(null);
	const fileReader = new FileReader();
	const fileInput = useRef<HTMLInputElement>();
	const [workAndBusinessActivityList] = useState<string[]>([
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
	const [sourceOfFundsIntendedForTransactionList] = useState<string[]>([
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
	const [natureOfPrevailingSourceOfIncomeList] = useState<string[]>(['Employee', 'Other']);
	const [declareList] = useState<string[]>([
		'I am a national of the aforementioned sole state or country and simultaneously I am registered to a permanent or other type of residency in this state or country',
		'I am a national of another state or country, specifically:',
		'I am registered to a permanent or other type of residency in another state or country, specifically:'
	]);

	fileReader.onloadend = () => {
		setFileUrl(fileReader.result);
	};
	const [page, setPage] = useState<number>(0);
	const handleNext = () => {
		setPage((prev: number) => prev + 1);
	};
	const handleSubmit = (event: any) => {
		event.preventDefault();
		// send POST if 200 chanhe button status to check kys if 401 bad request add toast like please pass kyc again
		updateShowKycL2(false);
	};
	const handleChangeInput = (event: any) => {
		setInput({ ...input, [event.target.name]: event.target.value });
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
		const file: any = fileInput?.current?.files && fileInput?.current?.files[0];
		// setFile(file);
		setInput({ ...input, file });
		fileReader.readAsDataURL(file);
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
										required={true}
										error={input.placeOfBirth.length < 2}
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
										error={input.netYearlyIncome.length < 2}
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
										error={input.gender.length < 2}
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
										error={input.mailingAddress.length < 2}
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
										error={input.email.length < 2}
									/>
								</div>
								<div style={{ marginBottom: '10px' }}>
									<TextField
										value={input.citizenship}
										placeholder="Citizenship(s)"
										type="text"
										onChange={handleChangeInput}
										size="small"
										align="left"
										required={true}
										name="citizenship"
									/>
								</div>
							</div>
						</div>
					</>
				)}
				{page === 1 && (
					<>
						<div style={{ marginBottom: '10px', width: '100%' }}>
							<TextField
								value={input.prevailingSourceOfIncome}
								placeholder="Prevailing source of such income (employment/business, real estate, trading, etc.)"
								type="text"
								onChange={handleChangeInput}
								size="small"
								align="left"
								name="prevailingSourceOfIncome"
								required={true}
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
								required={true}
								name="taxResidency"
							/>
						</div>
						<div style={{ marginBottom: '10px', width: '100%' }}>
							<TextField
								value={input.countryOfClientConductsActivity}
								placeholder="Country in which the Client conducts his work / business activity"
								type="text"
								onChange={handleChangeInput}
								size="small"
								align="left"
								required={true}
								name="countryOfClientConductsActivity"
							/>
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
						{workAndBusinessActivityList.map((activity: string, index: number) => {
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
										id={`workAndBusinessActivityList-checkbox-${index}`}
										onChange={handleChangeCheckBox}
										// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
										checked={input.workAndBusinessActivity.includes(`${activity}`)}
										required={true}
										data-key="workAndBusinessActivity"
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
										id={`sourceOfFundsIntendedForTransactionList-checkbox-${index}`}
										onChange={handleChangeCheckBox}
										// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
										checked={input.sourceOfFundsIntendedForTransaction.includes(`${activity}`)}
										required={true}
										data-key="sourceOfFundsIntendedForTransaction"
									/>
									<label htmlFor={`sourceOfFundsIntendedForTransactionList-checkbox-${index}`}>
										{activity}
									</label>
								</div>
							);
						})}
						{input.sourceOfFundsIntendedForTransaction.includes('Other') ? (
							<TextField
								value={input.sourceOfFundsIntendedForTransactionOther}
								type="text"
								placeholder="Specify..."
								onChange={handleChangeInput}
								size="small"
								align="left"
								name="sourceOfFundsIntendedForTransactionOther"
							/>
						) : null}

						<p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>
							Nature of prevailing source of income
						</p>
						{natureOfPrevailingSourceOfIncomeList.map((activity: string, index: number) => {
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
										id={`natureOfPrevailingSourceOfIncomeList-checkbox-${index}`}
										onChange={handleChangeCheckBox}
										// SAVE CHECKED IF WAS CHECKED BEFORE CLOSED MODAL
										checked={input.natureOfPrevailingSourceOfIncome.includes(`${activity}`)}
										required={true}
										data-key="natureOfPrevailingSourceOfIncome"
									/>
									<label htmlFor={`natureOfPrevailingSourceOfIncomeList-checkbox-${index}`}>
										{activity}
									</label>
								</div>
							);
						})}
						{input.natureOfPrevailingSourceOfIncome.includes('Other') ? (
							<TextField
								value={input.natureOfPrevailingSourceOfIncomeOther}
								type="text"
								placeholder="Food industry, hospitality, transportation, consultancy, agriculture, IT, science, etc."
								onChange={handleChangeInput}
								size="small"
								align="left"
								name="natureOfPrevailingSourceOfIncomeOther"
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
											checked={input.fundsIrregularForBusiness.includes(`${activity}`)}
											required={true}
											data-key="fundsIrregularForBusiness"
										/>
										<label htmlFor={`fundsIrregularForBussinesList-checkbox-${index}`}>
											{activity}
										</label>
									</div>
								);
							})}
							{input.fundsIrregularForBusiness.includes('Other') ? (
								<TextField
									value={input.fundsIrregularForBusinessOther}
									type="text"
									placeholder="Specify..."
									onChange={handleChangeInput}
									size="small"
									align="left"
									name="fundsIrregularForBusinessOther"
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
							<label htmlFor="criminalOffenseTrue">
								{' '}
								Yes
								<input
									id="criminalOffenseTrue"
									type="radio"
									value="Yes"
									checked={input.criminalOffense === 'Yes'}
									onChange={handleChangeInput}
									name="criminalOffense"
								/>
							</label>
							<label htmlFor="criminalOffenseFalse">
								No
								<input
									id="criminalOffenseFalse"
									type="radio"
									value="No"
									checked={input.criminalOffense === 'No'}
									onChange={handleChangeInput}
									name="criminalOffense"
								/>
							</label>
						</div>
						<p style={{ marginBottom: '25px' }}>
							Person against whom are applied CZ/international sanctions?
						</p>
						<div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
							<label htmlFor="personAgainstWhomAppliedCzOrInternationalSanctionsTrue">
								Yes
								<input
									id="personAgainstWhomAppliedCzOrInternationalSanctionsTrue"
									type="radio"
									value="Yes"
									checked={input.personAgainstWhomAppliedCzOrInternationalSanctions === 'Yes'}
									onChange={handleChangeInput}
									name="personAgainstWhomAppliedCzOrInternationalSanctions"
								/>
							</label>
							<label htmlFor="personAgainstWhomAppliedCzOrInternationalSanctionsFalse">
								No
								<input
									id="personAgainstWhomAppliedCzOrInternationalSanctionsFalse"
									type="radio"
									value="No"
									checked={input.personAgainstWhomAppliedCzOrInternationalSanctions === 'No'}
									onChange={handleChangeInput}
									name="personAgainstWhomAppliedCzOrInternationalSanctions"
								/>
							</label>
						</div>
						<p style={{ marginBottom: '25px' }}>Politically exposed person?</p>
						<div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
							<label htmlFor="politicallyExposedPersonTrue">
								Yes
								<input
									id="politicallyExposedPersonTrue"
									type="radio"
									value="Yes"
									checked={input.politicallyExposedPerson === 'Yes'}
									onChange={handleChangeInput}
									name="politicallyExposedPerson"
								/>
							</label>
							<label htmlFor="politicallyExposedPersonFalse">
								No
								<input
									id="politicallyExposedPersonFalse"
									type="radio"
									value="No"
									checked={input.politicallyExposedPerson === 'No'}
									onChange={handleChangeInput}
									name="politicallyExposedPerson"
								/>
							</label>
						</div>
					</div>
				)}
				{page === 5 && (
					<>
						<LabelInput htmlFor="file-input">
							<FileInput
								id="file-input"
								type="file"
								ref={fileInput as any}
								onChange={handleChangeFileInput}
								required={true}></FileInput>
							Upload file
						</LabelInput>
						<PreviewImg src={fileUrl ? fileUrl : null}></PreviewImg>
						<FileNameText>{input.file ? input.file.name : null} </FileNameText>
					</>
				)}

				{page === 6 && (
					<div
						style={{
							display: 'flex',
							marginBottom: '25px',
							flexDirection: 'column',
							alignItems: 'center'
						}}>
						<p>Thank you for your information!</p>
						<p>Please wait for the results!</p>
					</div>
				)}
				{page <= 5 && (
					<Button variant="secondary" onClick={handleNext}>
						Next
					</Button>
				)}
				{page > 5 && (
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
