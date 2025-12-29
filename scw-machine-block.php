<?php
/**
 * Plugin Name: Machine Description Block
 * Description: A custom Gutenberg block for displaying machinery information
 * Version: 1.0.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) {
    exit;
}

class SCW_Machine_Block {
    
    public function __construct() {
        add_action('init', array($this, 'register_block'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }
    
    public function register_block() {
        register_block_type(__DIR__ . '/block.json');
    }
    
    public function register_rest_routes() {
        register_rest_route('scw/v1', '/process-machine-image', array(
            'methods' => 'POST',
            'callback' => array($this, 'process_machine_image'),
            'permission_callback' => function() {
                return current_user_can('upload_files');
            }
        ));
        
        register_rest_route('scw/v1', '/delete-machine-image', array(
            'methods' => 'POST',
            'callback' => array($this, 'delete_machine_image'),
            'permission_callback' => function() {
                return current_user_can('delete_posts');
            }
        ));
    }
    
    public function process_machine_image($request) {
        $image_id = $request->get_param('imageId');
        
        if (!$image_id) {
            return new WP_Error('no_image', 'No image ID provided', array('status' => 400));
        }
        
        // Get the original image path
        $original_path = get_attached_file($image_id);
        
        if (!$original_path || !file_exists($original_path)) {
            return new WP_Error('invalid_image', 'Image not found', array('status' => 404));
        }
        
        // Load the image
        $image_editor = wp_get_image_editor($original_path);
        
        if (is_wp_error($image_editor)) {
            return $image_editor;
        }
        
        // Get current size
        $size = $image_editor->get_size();
        $width = $size['width'];
        $height = $size['height'];
        
        // Calculate the crop dimensions (largest square possible)
        $crop_size = min($width, $height);
        $src_x = ($width - $crop_size) / 2;
        $src_y = ($height - $crop_size) / 2;
        
        // Crop to square from center
        $image_editor->crop($src_x, $src_y, $crop_size, $crop_size);
        
        // Resize to 200x200
        $image_editor->resize(200, 200, true);
        
        // Generate a unique filename
        $upload_dir = wp_upload_dir();
        $filename = 'machine-' . $image_id . '-200x200.jpg';
        $new_path = $upload_dir['path'] . '/' . $filename;
        
        // Save the processed image
        $saved = $image_editor->save($new_path);
        
        if (is_wp_error($saved)) {
            return $saved;
        }
        
        // Return the URL of the processed image
        $new_url = $upload_dir['url'] . '/' . $filename;
        
        return array(
            'success' => true,
            'url' => $new_url,
            'path' => $new_path
        );
    }
    
    public function delete_machine_image($request) {
        $image_url = $request->get_param('imageUrl');
        
        if (!$image_url) {
            return new WP_Error('no_url', 'No image URL provided', array('status' => 400));
        }
        
        // Convert URL to path
        $upload_dir = wp_upload_dir();
        $image_path = str_replace($upload_dir['baseurl'], $upload_dir['basedir'], $image_url);
        
        // Delete the file if it exists and matches our pattern
        if (file_exists($image_path) && strpos($image_path, 'machine-') !== false) {
            wp_delete_file($image_path);
            return array('success' => true, 'message' => 'Image deleted');
        }
        
        return array('success' => false, 'message' => 'Image not found or not a machine image');
    }
}

new SCW_Machine_Block();
