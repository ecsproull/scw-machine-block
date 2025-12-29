import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';
import './editor.scss';
import './style.scss';

registerBlockType('scw/machine-block', {
	edit,
	save,
});
