import { useBlockProps, MediaUpload, MediaUploadCheck, InnerBlocks } from '@wordpress/block-editor';
import { Button, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const ALLOWED_BLOCKS = ['core/paragraph', 'core/list', 'core/heading', 'core/image'];

const TEMPLATE = [
	['core/heading', { level: 2, content: 'Description' }],
	['core/paragraph', { placeholder: 'Enter machine description...' }],
	['core/heading', { level: 2, content: '⚠️ Warnings', className: 'scw-machine-block__heading--warning' }],
	['core/paragraph', { placeholder: 'Enter important warnings...', className: 'scw-machine-block__warning-content' }],
	['core/heading', { level: 2, content: 'Usage Instructions' }],
	['core/paragraph', { placeholder: 'Enter usage instructions...' }],
	['core/heading', { level: 2, content: 'Cleaning' }],
	['core/paragraph', { placeholder: 'Enter cleaning instructions...' }],
	['core/heading', { level: 2, content: 'Safety Issues' }],
	['core/paragraph', { placeholder: 'Enter safety issues...' }],
];

export default function Edit({ attributes, setAttributes }) {
	const { images = [] } = attributes;

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
			<div className="scw-machine-block__image-section" style={{ position: 'relative', zIndex: 1 }}>
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
											variant="primary"
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
																	onClick={(e) => {
																		e.preventDefault();
																		e.stopPropagation();
																		onRemoveImage(index);
																	}}
																	variant="tertiary"
																	isDestructive
																	size="compact"
																	className="scw-machine-block__remove-thumbnail"
																>
																	{__('×', 'scw-machine-block')}
																</Button>
															</div>
														))}
													</div>
													<div className="scw-machine-block__image-controls">
														<Button
															onClick={(e) => {
															 e.preventDefault();
															 e.stopPropagation();
															 open();
															}}
															variant="primary"
															size="compact"
														>
															{__('Add More Images', 'scw-machine-block')}
														</Button>
														<Button
															onClick={(e) => {
															 e.preventDefault();
															 e.stopPropagation();
															 onRemoveAllImages();
															}}
															variant="tertiary"
															isDestructive
															size="compact"
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
			</div>

			<div className="scw-machine-block__content">
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					template={TEMPLATE}
				/>
			</div>
		</div>
	);
}
