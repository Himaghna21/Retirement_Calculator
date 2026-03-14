<?php
/**
 * Drupal Settings Configuration
 * Settings for the Retirement Calculator headless CMS
 */

// Database configuration
$databases['default']['default'] = array(
  'database' => getenv('DRUPAL_DB_NAME') ?: 'retirement_calculator_cms',
  'username' => getenv('DRUPAL_DB_USER') ?: 'drupal',
  'password' => getenv('DRUPAL_DB_PASSWORD') ?: '',
  'host' => getenv('DRUPAL_DB_HOST') ?: 'localhost',
  'port' => getenv('DRUPAL_DB_PORT') ?: '3306',
  'driver' => 'mysql',
  'prefix' => '',
  'collation' => 'utf8mb4_general_ci',
);

// Enable trusted host patterns in production
$settings['trusted_host_patterns'] = array(
  '^your\.production\.domain\.com$',
  '^your\.staging\.domain\.com$',
  '^localhost$',
);

// Hash salt (CHANGE THIS!)
$settings['hash_salt'] = getenv('DRUPAL_HASH_SALT') ?: 'change-me-to-a-random-string';

// File paths
$settings['file_private_path'] = '/var/www/drupal/private';
$settings['file_public_path'] = 'sites/default/files';

// Temporary file path
$settings['file_temp_path'] = '/tmp';

// Configure Redis cache (optional)
// $settings['redis.connection']['interface'] = 'Predis';
// $settings['redis.connection']['host'] = 'localhost';
// $settings['redis.connection']['port'] = 6379;
// $settings['cache']['default'] = 'cache.backend.redis';

// Configure memcache (optional)
// $settings['memcache']['servers'] = array('localhost:11211' => 'default');
// $settings['cache']['default'] = 'cache.backend.memcache';

// API rate limiting
$settings['rate_limit'] = array(
  'enabled' => true,
  'requests_per_minute' => 300,
);

// Security settings
$settings['container_yamls'][] = $app_root . '/' . $site_path . '/services.yml';
$settings['update_free_access'] = false;

// Allow CORS for headless frontend
$settings['cors_enabled'] = true;

// Disable IP-based blocking for API
$settings['ip_blocking_enabled'] = false;

// Configure API access
$settings['api_access'] = array(
  'calculator_content' => array(
    'enabled' => true,
    'cache_ttl' => 3600,
  ),
);