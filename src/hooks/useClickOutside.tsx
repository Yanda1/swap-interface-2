import { useRef, useEffect } from 'react';

export const useClickOutside = (handler: () => void) => {
	const domNode = useRef();

	useEffect(() => {
		const maybeHandler = (event: any) => {
			// @ts-ignore
			if (!domNode?.current?.contains(event.target)) {
				handler();
			}
		};

		document.body.addEventListener('mousedown', maybeHandler);

		return () => {
			document.body.removeEventListener('mousedown', maybeHandler);
		};
	});

	return domNode;
};
