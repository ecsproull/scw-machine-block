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
					<div className="scw-machine-block__image-container">
						<img
							src={imageUrl}
							alt={imageAlt}
							className="scw-machine-block__image"
						/>
					</div>
				)}

				<div className="scw-machine-block__text-content">
					{description && (
						<div className="scw-machine-block__section">
							<h3>Description</h3>
							<RichText.Content
								tagName="div"
								className="scw-machine-block__description"
								value={description}
							/>
						</div>
					)}

					{usageInstructions && (
						<div className="scw-machine-block__section">
							<h3>Usage Instructions</h3>
							<RichText.Content
								tagName="div"
								className="scw-machine-block__usage"
								value={usageInstructions}
							/>
						</div>
					)}

					{cleaning && (
						<div className="scw-machine-block__section">
							<h3>Cleaning</h3>
							<RichText.Content
								tagName="div"
								className="scw-machine-block__cleaning"
								value={cleaning}
							/>
						</div>
					)}

					{safetyIssues && (
						<div className="scw-machine-block__section">
							<h3>Safety Issues</h3>
							<RichText.Content
								tagName="div"
								className="scw-machine-block__safety"
								value={safetyIssues}
							/>
						</div>
					)}

					{warnings && (
						<div className="scw-machine-block__section scw-machine-block__section--warning">
							<h3>⚠️ Warnings</h3>
							<RichText.Content
								tagName="div"
								className="scw-machine-block__warnings"
								value={warnings}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
