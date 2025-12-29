# Machine Description Block

A custom Gutenberg block for WordPress that displays machinery information with image, description, usage instructions, safety issues, and warnings.

## Features

- **Image Upload**: Upload and automatically process machine images (cropped to 200x200px)
- **Structured Content**: Organized sections for machine information
- **Responsive Layout**: Image floats left with text wrapping around it
- **Image Management**: Automatically deletes old images when replaced
- **Warning Section**: Highlighted warning section for important safety information

## Installation

1. Navigate to the block directory:
   ```bash
   cd /var/www/wordpress/wp-content/plugins/signup-calendar/scw-machine-block
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the block:
   ```bash
   npm run build
   ```

## Development

To start the development environment with automatic rebuilding:

```bash
npm start
```

## Usage

1. In the WordPress editor, add a new block
2. Search for "Machine Description"
3. Upload an image (will be automatically processed to 200x200px)
4. Fill in the machine details:
   - Machine Name
   - Description
   - Usage Instructions
   - Safety Issues
   - Warnings

## Block Structure

The block includes the following sections:
- **Image**: 200x200px, cropped from center
- **Machine Name**: Main heading
- **Description**: General information about the machine
- **Usage Instructions**: How to use the machine
- **Safety Issues**: Important safety considerations
- **Warnings**: Critical warnings (highlighted in yellow)

## Technical Details

- Built with WordPress Block API (version 3)
- Uses React components from `@wordpress/block-editor`
- Custom REST API endpoints for image processing
- SCSS for styling
- Image processing uses WordPress image editor with automatic cropping and resizing
