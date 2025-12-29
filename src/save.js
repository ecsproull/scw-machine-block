import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		imageUrl,
		imageAlt,
		description,
		usageInstructions,
		cleaning,
		safetyIssues,
		warnings,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: 'scw-machine-block',
	});

	return (
		<div {...blockProps}>
			<div className="scw-machine-block__content">
				{imageUrl && (
					<img
						src={imageUrl}
						alt={imageAlt}
						className="scw-machine-block__image"
					/>
				)}

				{description && (
					<>
						<h3 className="scw-machine-block__heading">Description</h3>
						<RichText.Content
							tagName="div"
							className="scw-machine-block__description"
							value={description}
						/>
					</>
				)}

				{usageInstructions && (
					<>
						<h3 className="scw-machine-block__heading">Usage Instructions</h3>
						<RichText.Content
							tagName="div"
							className="scw-machine-block__usage"
							value={usageInstructions}
						/>
					</>
				)}

				{cleaning && (
					<>
						<h3 className="scw-machine-block__heading">Cleaning</h3>
						<RichText.Content
							tagName="div"
							className="scw-machine-block__cleaning"
							value={cleaning}
						/>
					</>
				)}

				{safetyIssues && (
					<>
						<h3 className="scw-machine-block__heading">Safety Issues</h3>
						<RichText.Content
							tagName="div"
							className="scw-machine-block__safety"
							value={safetyIssues}
						/>
					</>
				)}

				{warnings && (
					<>
						<h3 className="scw-machine-block__heading scw-machine-block__heading--warning">⚠️ Warnings</h3>
						<RichText.Content
							tagName="div"
							className="scw-machine-block__warnings"
							value={warnings}
						/>
					</>
				)}
			</div>
		</div>
	);
}
