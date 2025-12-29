import { useBlockProps, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Edit({ attributes, setAttributes }) {
	const {
		images = [],
		description,
		usageInstructions,
		cleaning,
		safetyIssues,
		warnings,
	} = attributes;

	const [isProcessing, setIsProcessing] = useState(false);

	const blockProps = useBlockProps({
		className: 'scw-machine-block',
	});

	const onSelectImages = async (mediaArray) => {
		setIsProcessing(true);

		try {
			const processedImages = [];

			// Process each selected image
			for (const media of mediaArray) {
				try {
					const response = await apiFetch({
						path: '/scw/v1/process-machine-image',
						method: 'POST',
						data: { imageId: media.id },
					});

					processedImages.push({
						id: media.id,
						url: response.url,
						alt: media.alt || 'Machine image',
					});
				} catch (error) {
					console.error('Error processing image:', error);
					// Fallback to original image if processing fails
					processedImages.push({
						id: media.id,
						url: media.url,
						alt: media.alt || 'Machine image',
					});
				}
			}

			setAttributes({ images: processedImages });
		} finally {
			setIsProcessing(false);
		}
	};

	const onRemoveImage = async (index) => {
		const imageToRemove = images[index];
		
		if (imageToRemove && imageToRemove.url) {
			try {
				await apiFetch({
					path: '/scw/v1/delete-machine-image',
					method: 'POST',
					data: { imageUrl: imageToRemove.url },
				});
			} catch (error) {
				console.error('Error deleting image:', error);
			}
		}

		const newImages = images.filter((_, i) => i !== index);
		setAttributes({ images: newImages });
	};

	const onRemoveAllImages = async () => {
		for (const image of images) {
			if (image.url) {
				try {
					await apiFetch({
						path: '/scw/v1/delete-machine-image',
						method: 'POST',
						data: { imageUrl: image.url },
					});
				} catch (error) {
					console.error('Error deleting image:', error);
				}
			}
		}

		setAttributes({ images: [] });
	};

	return (
		<div {...blockProps}>
			<div className="scw-machine-block__content">
				<div className="scw-machine-block__image-container">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={onSelectImages}
							allowedTypes={['image']}
							multiple={true}
							gallery={true}
							value={images.map(img => img.id)}
							render={({ open }) => (
								<div className="scw-machine-block__image-upload">
									{images.length === 0 ? (
										<Button
											onClick={open}
											variant="secondary"
											className="scw-machine-block__upload-button"
										>
											{__('Upload Machine Images', 'scw-machine-block')}
										</Button>
									) : (
										<div className="scw-machine-block__image-gallery">
											{isProcessing && (
												<div className="scw-machine-block__processing">
													<Spinner />
													<p>{__('Processing images...', 'scw-machine-block')}</p>
												</div>
											)}
											{!isProcessing && (
												<>
													<div className="scw-machine-block__thumbnails">
														{images.map((image, index) => (
															<div key={image.id} className="scw-machine-block__thumbnail">
																<img src={image.url} alt={image.alt} />
																<Button
																	onClick={() => onRemoveImage(index)}
																	variant="tertiary"
																	isDestructive
																	isSmall
																	className="scw-machine-block__remove-thumbnail"
																>
																	{__('×', 'scw-machine-block')}
																</Button>
															</div>
														))}
													</div>
													<div className="scw-machine-block__image-controls">
														<Button
															onClick={open}
															variant="secondary"
															isSmall
														>
															{__('Add More Images', 'scw-machine-block')}
														</Button>
														<Button
															onClick={onRemoveAllImages}
															variant="tertiary"
															isDestructive
															isSmall
														>
															{__('Remove All', 'scw-machine-block')}
														</Button>
													</div>
												</>
											)}
										</div>
									)}
								</div>
							)}
						/>
					</MediaUploadCheck>
				</div>

				<h2 className="scw-machine-block__heading">{__('Description', 'scw-machine-block')}</h2>
				<RichText
					tagName="div"
					identifier="description"
					className="scw-machine-block__description"
					value={description}
					onChange={(value) => setAttributes({ description: value })}
					placeholder={__(
						'Enter machine description...',
						'scw-machine-block'
					)}
				/>

				<h2 className="scw-machine-block__heading">{__('Usage Instructions', 'scw-machine-block')}</h2>
				<RichText
					tagName="div"
					identifier="usageInstructions"
					className="scw-machine-block__usage"
					value={usageInstructions}
					onChange={(value) => setAttributes({ usageInstructions: value })}
					placeholder={__(
						'Enter usage instructions...',
						'scw-machine-block'
					)}
				/>

				<h2 className="scw-machine-block__heading">{__('Cleaning', 'scw-machine-block')}</h2>
				<RichText
					tagName="div"
					identifier="cleaning"
					className="scw-machine-block__cleaning"
					value={cleaning}
					onChange={(value) => setAttributes({ cleaning: value })}
					placeholder={__(
						'Enter cleaning instructions...',
						'scw-machine-block'
					)}
				/>

				<h2 className="scw-machine-block__heading">{__('Safety Issues', 'scw-machine-block')}</h2>
				<RichText
					tagName="div"
					identifier="safetyIssues"
					className="scw-machine-block__safety"
					value={safetyIssues}
					onChange={(value) => setAttributes({ safetyIssues: value })}
					placeholder={__(
						'Enter safety issues...',
						'scw-machine-block'
					)}
				/>

				<h2 className="scw-machine-block__heading scw-machine-block__heading--warning">{__('⚠️ Warnings', 'scw-machine-block')}</h2>
				<RichText
					tagName="div"
					identifier="warnings"
					className="scw-machine-block__warnings"
					value={warnings}
					onChange={(value) => setAttributes({ warnings: value })}
					placeholder={__(
						'Enter important warnings...',
						'scw-machine-block'
					)}
				/>
			</div>
		</div>
	);
}
