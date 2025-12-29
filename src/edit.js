import { useBlockProps, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Edit({ attributes, setAttributes }) {
	const {
		imageId,
		imageUrl,
		imageAlt,
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

	const onSelectImage = async (media) => {
		// If there's an existing image, delete it
		if (imageUrl) {
			try {
				await apiFetch({
					path: '/scw/v1/delete-machine-image',
					method: 'POST',
					data: { imageUrl },
				});
			} catch (error) {
				console.error('Error deleting previous image:', error);
			}
		}

		setIsProcessing(true);

		try {
			// Process the new image
			const response = await apiFetch({
				path: '/scw/v1/process-machine-image',
				method: 'POST',
				data: { imageId: media.id },
			});

			setAttributes({
				imageId: media.id,
				imageUrl: response.url,
				imageAlt: media.alt || 'Machine image',
			});
		} catch (error) {
			console.error('Error processing image:', error);
			// Fallback to original image if processing fails
			setAttributes({
				imageId: media.id,
				imageUrl: media.url,
				imageAlt: media.alt || 'Machine image',
			});
		} finally {
			setIsProcessing(false);
		}
	};

	const onRemoveImage = async () => {
		if (imageUrl) {
			try {
				await apiFetch({
					path: '/scw/v1/delete-machine-image',
					method: 'POST',
					data: { imageUrl },
				});
			} catch (error) {
				console.error('Error deleting image:', error);
			}
		}

		setAttributes({
			imageId: 0,
			imageUrl: '',
			imageAlt: '',
		});
	};

	return (
		<div {...blockProps}>
			<div className="scw-machine-block__content">
				<div className="scw-machine-block__image-container">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={onSelectImage}
							allowedTypes={['image']}
							value={imageId}
							render={({ open }) => (
								<div className="scw-machine-block__image-upload">
									{!imageUrl ? (
										<Button
											onClick={open}
											variant="secondary"
											className="scw-machine-block__upload-button"
										>
											{__('Upload Machine Image', 'scw-machine-block')}
										</Button>
									) : (
										<div className="scw-machine-block__image-wrapper">
											{isProcessing ? (
												<div className="scw-machine-block__processing">
													<Spinner />
													<p>{__('Processing image...', 'scw-machine-block')}</p>
												</div>
											) : (
												<>
													<img src={imageUrl} alt={imageAlt} />
													<div className="scw-machine-block__image-controls">
														<Button
															onClick={open}
															variant="secondary"
															isSmall
														>
															{__('Replace', 'scw-machine-block')}
														</Button>
														<Button
															onClick={onRemoveImage}
															variant="tertiary"
															isDestructive
															isSmall
														>
															{__('Remove', 'scw-machine-block')}
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

				<h3 className="scw-machine-block__heading">{__('Description', 'scw-machine-block')}</h3>
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

				<h3 className="scw-machine-block__heading">{__('Usage Instructions', 'scw-machine-block')}</h3>
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

				<h3 className="scw-machine-block__heading">{__('Cleaning', 'scw-machine-block')}</h3>
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

				<h3 className="scw-machine-block__heading">{__('Safety Issues', 'scw-machine-block')}</h3>
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

				<h3 className="scw-machine-block__heading scw-machine-block__heading--warning">{__('⚠️ Warnings', 'scw-machine-block')}</h3>
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
