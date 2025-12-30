import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { images = [] } = attributes;

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

				<InnerBlocks.Content />
			</div>
		</div>
	);
}
