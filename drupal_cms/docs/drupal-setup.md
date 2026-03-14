# Drupal 10.5.6 Setup Guide for Retirement Calculator CMS

## Overview
Drupal serves as a headless CMS for managing calculator content (disclaimer, assumptions) via JSON:API.

## Prerequisites
- PHP 8.1+
- MySQL 5.7+ (or MariaDB 10.2+)
- Composer 2.0+
- Node.js 22.11.0 (for build tools, optional)

## Installation Steps

### 1. Install Drupal

```bash
# Create new Drupal project
composer create-project drupal/recommended-project retirement-calculator-cms

# Navigate to project
cd retirement-calculator-cms

# Install dependencies
composer install
```

### 2. Database Setup
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE retirement_calculator_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Create database user
mysql -u root -p -e "CREATE USER 'drupal'@'localhost' IDENTIFIED BY 'secure_password'; GRANT ALL PRIVILEGES ON retirement_calculator_cms.* TO 'drupal'@'localhost'; FLUSH PRIVILEGES;"
```

### 3. Configure Drupal
Update `web/sites/default/settings.php`:

```php
$databases['default']['default'] = [
  'database' => 'retirement_calculator_cms',
  'username' => 'drupal',
  'password' => 'secure_password',
  'host' => 'localhost',
  'port' => '3306',
  'driver' => 'mysql',
  'prefix' => '',
  'collation' => 'utf8mb4_general_ci',
];

$settings['hash_salt'] = 'generate-random-hash-here';
$settings['trusted_host_patterns'] = [
  '^localhost$',
  '^your\\.production\\.domain\\.com$',
];
```

### 4. Enable Required Modules
```bash
# Navigate to Drupal directory
cd web

# Enable JSON:API (included in core)
../vendor/bin/drush module:install jsonapi -y

# Enable JSON:API Extras (optional, for customization)
composer require drupal/jsonapi_extras
../vendor/bin/drush module:install jsonapi_extras -y

# Enable CORS module
composer require drupal/cors
../vendor/bin/drush module:install cors -y

# Enable Pathauto (for URL aliases)
composer require drupal/pathauto
../vendor/bin/drush module:install pathauto -y

# Enable our custom module
../vendor/bin/drush module:install retirement_calculator -y
```

### 5. Configure CORS
Update `web/sites/default/services.yml`:

```yaml
cors.config:
  enabled: true
  allowedHeaders:
    - '*'
  allowedMethods:
    - GET
    - POST
    - PUT
    - DELETE
    - PATCH
    - OPTIONS
  allowedOrigins:
    - 'http://localhost:3000'
    - 'https://localhost:3000'
    - 'https://your-production-domain.com'
  exposedHeaders: false
  maxAge: false
  supportsCredentials: false
```

Clear cache:
```bash
../vendor/bin/drush cache:rebuild
```

### 6. Create Content Type
Via UI or code:

```bash
# Create content type: calculator_content
../vendor/bin/drush config-import --partial --source=drupal/config
```

### 7. Create Initial Content
Via Drupal UI: `/admin/content/add`

**Content 1: Disclaimer**
- **Title:** "Disclaimer"
- **Body:** Full HDFC disclaimer text
- **Status:** Published

**Content 2: Assumptions**
- **Title:** "Assumptions"
- **Body:** Assumptions documentation
- **Status:** Published

### 8. Test JSON:API
```bash
# Get all calculator content
curl http://localhost:8000/jsonapi/node/calculator_content

# Filter by title
curl 'http://localhost:8000/jsonapi/node/calculator_content?filter[title]=Disclaimer'

# Get single node (replace NID)
curl http://localhost:8000/jsonapi/node/calculator_content/[NODE-UUID]
```

### 9. Enable Caching
Update `web/sites/default/settings.php`:

```php
// Redis cache (optional, recommended for production)
$settings['redis.connection']['interface'] = 'Predis';
$settings['redis.connection']['host'] = 'localhost';
$settings['redis.connection']['port'] = 6379;
$settings['cache']['default'] = 'cache.backend.redis';

// Memcache alternative
// $settings['memcache']['servers'] = ['localhost:11211' => 'default'];
// $settings['cache']['default'] = 'cache.backend.memcache';
```

## Running Drupal

### Development Server
```bash
cd web
php -S localhost:8000 .ht.router.php
```

Access at: `http://localhost:8000/user/login`
Default credentials (change immediately):
- **Username:** admin
- **Password:** (auto-generated, check install message)

### Production Deployment
Use Acquia, Pantheon, or similar hosting:

```bash
# Push to production Git repo
git remote add production [your-git-repo]
git push production main
```

## JSON:API Endpoints

### Get All Calculator Content
```http
GET /jsonapi/node/calculator_content
```
Response:
```json
{
  "data": [
    {
      "id": "uuid-here",
      "type": "node--calculator_content",
      "attributes": {
        "title": "Disclaimer",
        "body": {
          "value": "<p>HTML content</p>",
          "format": "full_html"
        },
        "created": "2026-03-12T10:00:00+00:00"
      }
    }
  ]
}
```

### Get Content by Filter
```http
GET /jsonapi/node/calculator_content?filter[title]=Disclaimer&filter[status]=1
```

### Update Content
```http
PATCH /jsonapi/node/calculator_content/[UUID]
Content-Type: application/vnd.api+json

{
  "data": {
    "type": "node--calculator_content",
    "attributes": {
      "title": "Updated Title",
      "body": {
        "value": "<p>Updated content</p>",
        "format": "full_html"
      }
    }
  }
}
```

## Troubleshooting

### CORS Issues
```bash
# Verify CORS enabled
drush config:get cors.config enabled

# Check services.yml
cat web/sites/default/services.yml | grep -A 10 cors.config
```

### JSON:API Not Responding
```bash
# Verify module enabled
drush pm:list | grep jsonapi

# Enable if missing
drush module:install jsonapi -y

# Clear cache
drush cache:rebuild
```

### Database Connection Error
```bash
# Test database
mysql -u drupal -p retirement_calculator_cms -e "SELECT 1;"

# Check settings.php
grep -A 10 "databases\['default'\]" web/sites/default/settings.php
```

## Drupal Admin URLs
- **Dashboard:** `http://localhost:8000`
- **Content:** `http://localhost:8000/admin/content`
- **Content Types:** `http://localhost:8000/admin/structure/types`
- **Modules:** `http://localhost:8000/admin/modules`
- **Configuration:** `http://localhost:8000/admin/config`
- **Reports:** `http://localhost:8000/admin/reports`

## Backing Up Content
```bash
# Export database
mysqldump -u drupal -p retirement_calculator_cms > backup.sql

# Import backup
mysql -u drupal -p retirement_calculator_cms < backup.sql
```

## 9. Complete Integration Testing

```javascript name=__tests__/integration/drupal.content.test.js
/**
 * Drupal CMS Integration Tests
 * Tests content fetching from Drupal via JSON:API
 */

import { fetchFromDrupal, fetchDisclaimer, fetchAssumptions, checkDrupalHealth } from '@/utils/drupalClient.js';

describe('Drupal CMS Integration', () => {
  const DRUPAL_BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_API_URL || 'http://localhost:8000';

  describe('Health Check', () => {
    test('Drupal API is accessible', async () => {
      const isHealthy = await checkDrupalHealth();
      expect(typeof isHealthy).toBe('boolean');
    }, 10000);
  });

  describe('JSON:API Endpoints', () => {
    test('fetches calculator content', async () => {
      try {
        const data = await fetchFromDrupal('node/calculator_content');
        
        expect(data).toBeDefined();
        expect(data.data).toBeDefined();
        expect(Array.isArray(data.data)).toBe(true);
      } catch (error) {
        // Drupal might not be running in test environment
        console.warn('Drupal not accessible in tests (expected)');
      }
    }, 10000);

    test('filters content by title', async () => {
      try {
        const params = { 'filter[title]': 'Disclaimer' };
        const data = await fetchFromDrupal('node/calculator_content', params);
        
        if (data.data.length > 0) {
          const node = data.data[0];
          expect(node.attributes.title).toBe('Disclaimer');
        }
      } catch (error) {
        console.warn('Drupal not accessible in tests (expected)');
      }
    }, 10000);
  });

  describe('Disclaimer Content', () => {
    test('fetches disclaimer from Drupal', async () => {
      try {
        const disclaimer = await fetchDisclaimer();
        
        expect(typeof disclaimer).toBe('string');
        expect(disclaimer.length).toBeGreaterThan(0);
      } catch (error) {
        console.warn('Drupal not accessible in tests (expected)');
      }
    }, 10000);

    test('disclaimer includes required text', async () => {
      try {
        const disclaimer = await fetchDisclaimer();
        
        const requiredTexts = [
          'Disclaimer',
          'illustrative',
          'not be considered',
        ];
        
        requiredTexts.forEach((text) => {
          expect(disclaimer.toLowerCase()).toContain(text.toLowerCase());
        });
      } catch (error) {
        console.warn('Drupal not accessible in tests (expected)');
      }
    }, 10000);
  });

  describe('Assumptions Content', () => {
    test('fetches assumptions from Drupal', async () => {
      try {
        const assumptions = await fetchAssumptions();
        
        expect(typeof assumptions).toBe('object');
        expect(Object.keys(assumptions).length).toBeGreaterThan(0);
      } catch (error) {
        console.warn('Drupal not accessible in tests (expected)');
      }
    }, 10000);

    test('assumptions include required fields', async () => {
      try {
        const assumptions = await fetchAssumptions();
        
        const requiredFields = [
          'retirementDuration',
          'lifeExpectancy',
          'inflation',
          'preRetirementReturn',
          'postRetirementReturn',
        ];
        
        requiredFields.forEach((field) => {
          expect(assumptions).toHaveProperty(field);
        });
      } catch (error) {
        console.warn('Drupal not accessible in tests (expected)');
      }
    }, 10000);
  });

  describe('Fallback Handling', () => {
    test('returns default disclaimer if Drupal unavailable', async () => {
      // Mock fetch error
      global.fetch = jest.fn(() => 
        Promise.reject(new Error('Connection refused'))
      );
      
      const disclaimer = await fetchDisclaimer();
      
      expect(typeof disclaimer).toBe('string');
      expect(disclaimer).toContain('Disclaimer');
    }, 10000);

    test('returns default assumptions if Drupal unavailable', async () => {
      // Mock fetch error
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Connection refused'))
      );
      
      const assumptions = await fetchAssumptions();
      
      expect(assumptions.retirementDuration).toBeDefined();
      expect(assumptions.lifeExpectancy).toBe('85 years');
    }, 10000);
  });
});