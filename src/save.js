import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		images = [],
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
				{images.length > 0 && (
					<div className="scw-machine-block__image-container">
						<div className="scw-machine-block__slideshow">
							{images.map((image, index) => (
								<img
									key={index}
									src={image.url}
									alt={image.alt}
									className={`scw-machine-block__image ${index === 0 ? 'active' : ''}`}
									data-index={index}
								/>
							))}
						</div>
					</div>
				)}

				{description && (
					<>
						<h2 className="scw-machine-block__heading">Description</h2>
						<RichText.Content
							tagName="div"
							className="scw-machine-block__description"
							value={description}
						/>
					</>
				)}

				{usageInstructions && (
					<>
						<h2 className="scw-machine-block__heading">Usage Instructions</h2>
						<RichText.Content
							tagName="div"
							className="scw-machine-block__usage"
							value={usageInstructions}
						/>
					</>
				)}

				{cleaning && (
					<>
						<h2 className="scw-machine-block__heading">Cleaning</h2>
						<RichText.Content
							tagName="div"
							className="scw-machine-block__cleaning"
							value={cleaning}
						/>
					</>
				)}

				{safetyIssues && (
					<>
						<h2 className="scw-machine-block__heading">Safety Issues</h2>
						<RichText.Content
							tagName="div"
							className="scw-machine-block__safety"
							value={safetyIssues}
						/>
					</>
				)}

				{warnings && (
					<>
						<h2 className="scw-machine-block__heading scw-machine-block__heading--warning">⚠️ Warnings</h2>
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
