# Studio Inkless Blog - REST API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base Information](#base-information)
4. [Article Management API](#article-management-api)
5. [File Upload API](#file-upload-api)
6. [Complete Examples](#complete-examples)

---

## Overview

Studio Inkless Blog provides a comprehensive REST API for managing blog articles, file uploads, and more. This documentation details all available API endpoints, request formats, and response structures.

**Base URL**: `http://localhost:3000` (development) or your production domain

---

## Authentication

All API endpoints require authentication. Two authentication methods are supported:

### Method 1: Session Authentication (Session Cookie)
Obtain a session cookie through the login page, which is automatically included in subsequent requests.

### Method 2: API Token Authentication
Use a Bearer Token in the request header for authentication.

**Request Header Format:**
```
Authorization: Bearer YOUR_API_TOKEN
```

**How to Get an API Token:**
- Log in to the admin dashboard
- Navigate to `/admin/tokens` page
- Create a new API Token

---

## Base Information

### Response Format

All API responses return JSON format with the following structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Request successful |
| 400 | Invalid request parameters |
| 401 | Unauthorized (not authenticated or invalid token) |
| 404 | Resource not found |
| 500 | Internal server error |

### Generic Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "statusMessage": "Error description message"
}
```

---

## Article Management API

### 1. Create Article

**Endpoint:** `POST /api/admin/posts`

**Description:** Create a new blog article

**Authentication:** Required ✓

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_API_TOKEN
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✓ | Article title |
| `slug` | string | ✓ | URL-friendly unique identifier (e.g., "my-first-blog") |
| `content` | string | ✓ | Article content (supports Markdown/HTML) |
| `excerpt` | string | | Article summary/excerpt |
| `author_id` | number | ✓ | Author ID |
| `category_id` | number | ✓ | Category ID |
| `cover_image_url` | string | | Cover image URL (obtained after file upload) |
| `status` | string | | Article status: `draft` (draft) / `published` (published) / `archived` (archived), defaults to `draft` |
| `read_time` | number | | Reading time (in minutes), defaults to 5 |
| `published_at` | string | | Publication time (ISO 8601 format) |
| `tags` | string | | Tag list (comma-separated, e.g., "Nuxt,Vue,TypeScript") |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Article created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Error Response Example:**
```json
{
  "success": false,
  "statusCode": 400,
  "statusMessage": "Title, slug, content, author, and category are required"
}
```

---

### 2. Get All Articles

**Endpoint:** `GET /api/admin/posts`

**Description:** Get list of all articles (for backend management)

**Authentication:** Required ✓

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "articles": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "My First Blog",
      "slug": "my-first-blog",
      "excerpt": "This is a short summary",
      "content": "Full article content...",
      "cover_image_url": "https://example.com/image.jpg",
      "author_id": 1,
      "category_id": 2,
      "category_name": "Technology",
      "tag_names": "Nuxt,Vue,TypeScript",
      "status": "published",
      "published_at": "2024-12-14T10:30:00.000Z",
      "read_time": 5,
      "created_at": "2024-12-14T10:30:00.000Z",
      "updated_at": "2024-12-14T10:30:00.000Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "Second Blog Post",
      "slug": "second-blog",
      "excerpt": "...",
      "content": "...",
      "cover_image_url": null,
      "author_id": 1,
      "category_id": 1,
      "category_name": "Life",
      "tag_names": "Sharing,Daily",
      "status": "draft",
      "published_at": "2024-12-14T10:31:00.000Z",
      "read_time": 3,
      "created_at": "2024-12-14T10:31:00.000Z",
      "updated_at": "2024-12-14T10:31:00.000Z"
    }
  ],
  "total": 2
}
```

---

### 3. Get Single Article

**Endpoint:** `GET /api/admin/posts/:id`

**Description:** Get article details by ID

**Authentication:** Required ✓

**Path Parameters:**
- `id` (string): Article ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "My First Blog",
    "slug": "my-first-blog",
    "excerpt": "This is a short summary",
    "content": "Full article content...",
    "cover_image_url": "https://example.com/image.jpg",
    "author_id": 1,
    "category_id": 2,
    "tags": "Nuxt,Vue,TypeScript",
    "status": "published",
    "published_at": "2024-12-14T10:30:00.000Z",
    "read_time": 5,
    "created_at": "2024-12-14T10:30:00.000Z",
    "updated_at": "2024-12-14T10:30:00.000Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "statusCode": 404,
  "statusMessage": "Article not found"
}
```

---

### 4. Update Article

**Endpoint:** `PUT /api/admin/posts/:id`

**Description:** Update an existing blog article

**Authentication:** Required ✓

**Path Parameters:**
- `id` (string): Article ID

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_API_TOKEN
```

**Request Body:** Same as creating an article, all fields are optional (only provide fields you want to update)

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Article title |
| `slug` | string | URL-friendly unique identifier |
| `content` | string | Article content |
| `excerpt` | string | Article excerpt |
| `author_id` | number | Author ID |
| `category_id` | number | Category ID |
| `cover_image_url` | string | Cover image URL |
| `status` | string | Article status: `draft` / `published` / `archived` |
| `read_time` | number | Reading time (in minutes) |
| `published_at` | string | Publication time |
| `tags` | string | Tag list (comma-separated) |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Article updated successfully"
}
```

**Example: Update status to published only**
```json
{
  "status": "published",
  "title": "My First Blog",
  "slug": "my-first-blog",
  "content": "Full article content...",
  "author_id": 1,
  "category_id": 2
}
```

---

### 5. Delete Article

**Endpoint:** `DELETE /api/admin/posts/:id`

**Description:** Delete a specified blog article

**Authentication:** Required ✓

**Path Parameters:**
- `id` (string): Article ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Article deleted successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "statusCode": 404,
  "statusMessage": "Article not found"
}
```

---

## File Upload API

### Upload Files (Including Cover Images)

**Endpoint:** `POST /api/admin/files/upload`

**Description:** Upload images or files to cloud storage (R2)

**Authentication:** Required ✓

**Request Headers:**
```
Authorization: Bearer YOUR_API_TOKEN
```

**Request Body:** multipart/form-data

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `files` | File[] | ✓ | Array of files to upload (supports multiple files) |

**Supported File Types:**
- Images: `jpg`, `jpeg`, `png`, `gif`, `webp`, `svg`
- Documents: `pdf`, `doc`, `docx`, `xls`, `xlsx`, `ppt`, `pptx`

**File Limits:**
- Max single file size: 10MB
- Max total size: 50MB

**Success Response (200):**
```json
{
  "success": true,
  "files": [
    {
      "file_name": "my-image.jpg",
      "file_key": "uploads/2024/12/abc123def456.jpg",
      "file_size": 125000,
      "mime_type": "image/jpeg",
      "url": "https://your-cdn.example.com/uploads/2024/12/abc123def456.jpg",
      "width": 1920,
      "height": 1080,
      "uploaded_by": 1,
      "created_at": "2024-12-14T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

**Error Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "statusMessage": "No files provided"
}
```

---

## Complete Examples

### Example 1: Create Article Using cURL

```bash
# 1. First, upload the cover image
curl -X POST http://localhost:3000/api/admin/files/upload \
  -H "Authorization: Bearer your_api_token_here" \
  -F "files=@/path/to/cover-image.jpg"

# Response will include the image URL, for example:
# "url": "https://your-cdn.example.com/uploads/2024/12/abc123.jpg"

# 2. Create article using the image URL
curl -X POST http://localhost:3000/api/admin/posts \
  -H "Authorization: Bearer your_api_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog",
    "slug": "my-first-blog",
    "content": "This is the complete article content. You can use Markdown or HTML format.",
    "excerpt": "This is a short summary",
    "author_id": 1,
    "category_id": 2,
    "cover_image_url": "https://your-cdn.example.com/uploads/2024/12/abc123.jpg",
    "status": "published",
    "read_time": 5,
    "tags": "Nuxt,Vue,TypeScript,Web Development"
  }'
```

---

### Example 2: Create Article Using JavaScript/Fetch

```javascript
const API_BASE_URL = 'http://localhost:3000';
const API_TOKEN = 'your_api_token_here';

// Create article
async function createBlogPost() {
  const postData = {
    title: 'My First Blog',
    slug: 'my-first-blog',
    content: 'This is the complete article content. You can use Markdown or HTML format.',
    excerpt: 'This is a short summary',
    author_id: 1,
    category_id: 2,
    cover_image_url: 'https://your-cdn.example.com/uploads/2024/12/abc123.jpg',
    status: 'published',
    read_time: 5,
    tags: 'Nuxt,Vue,TypeScript,Web Development'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify(postData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Article created successfully, ID:', result.data.id);
      return result.data;
    } else {
      console.error('Creation failed:', result.statusMessage);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

// Call function
createBlogPost();
```

---

### Example 3: Upload Image and Create Article Using Python

```python
import requests
import json

API_BASE_URL = 'http://localhost:3000'
API_TOKEN = 'your_api_token_here'

headers = {
    'Authorization': f'Bearer {API_TOKEN}'
}

# 1. Upload cover image
def upload_cover_image(image_path):
    url = f'{API_BASE_URL}/api/admin/files/upload'
    
    with open(image_path, 'rb') as f:
        files = {'files': f}
        response = requests.post(url, headers=headers, files=files)
    
    result = response.json()
    if result['success']:
        image_url = result['files'][0]['url']
        print(f'Image uploaded successfully: {image_url}')
        return image_url
    else:
        print(f'Upload failed: {result["statusMessage"]}')
        return None

# 2. Create blog article
def create_blog_post(image_url):
    url = f'{API_BASE_URL}/api/admin/posts'
    
    post_data = {
        'title': 'My First Blog',
        'slug': 'my-first-blog',
        'content': 'This is the complete article content. You can use Markdown or HTML format.',
        'excerpt': 'This is a short summary',
        'author_id': 1,
        'category_id': 2,
        'cover_image_url': image_url,
        'status': 'published',
        'read_time': 5,
        'tags': 'Nuxt,Vue,TypeScript,Web Development'
    }
    
    headers_json = {
        **headers,
        'Content-Type': 'application/json'
    }
    
    response = requests.post(url, headers=headers_json, json=post_data)
    result = response.json()
    
    if result['success']:
        print(f'Article created successfully, ID: {result["data"]["id"]}')
        return result['data']
    else:
        print(f'Creation failed: {result["statusMessage"]}')
        return None

# Execute workflow
if __name__ == '__main__':
    image_url = upload_cover_image('./cover-image.jpg')
    if image_url:
        create_blog_post(image_url)
```

---

### Example 4: Update Article Status to Published

```javascript
const API_BASE_URL = 'http://localhost:3000';
const API_TOKEN = 'your_api_token_here';
const ARTICLE_ID = '550e8400-e29b-41d4-a716-446655440000';

async function publishArticle() {
  const updateData = {
    status: 'published',
    // Need to resend all required fields
    title: 'My First Blog',
    slug: 'my-first-blog',
    content: 'Full article content...',
    author_id: 1,
    category_id: 2
  };

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/posts/${ARTICLE_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify(updateData)
      }
    );

    const result = await response.json();
    
    if (result.success) {
      console.log('Article published');
    } else {
      console.error('Publication failed:', result.statusMessage);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

publishArticle();
```

---

### Example 5: Add or Update Tags

```javascript
const API_BASE_URL = 'http://localhost:3000';
const API_TOKEN = 'your_api_token_here';
const ARTICLE_ID = '550e8400-e29b-41d4-a716-446655440000';

// Add new tags
async function addTags() {
  const updateData = {
    tags: 'Nuxt,Vue,TypeScript,JavaScript,Web Development',
    // Need to include other required fields
    title: 'My First Blog',
    slug: 'my-first-blog',
    content: 'Full article content...',
    author_id: 1,
    category_id: 2
  };

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/posts/${ARTICLE_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify(updateData)
      }
    );

    const result = await response.json();
    console.log(result.success ? 'Tags updated' : 'Update failed');
  } catch (error) {
    console.error('Request failed:', error);
  }
}

addTags();
```

---

### Example 6: Delete Article

```javascript
const API_BASE_URL = 'http://localhost:3000';
const API_TOKEN = 'your_api_token_here';
const ARTICLE_ID = '550e8400-e29b-41d4-a716-446655440000';

async function deleteArticle() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/posts/${ARTICLE_ID}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        }
      }
    );

    const result = await response.json();
    
    if (result.success) {
      console.log('Article deleted');
    } else {
      console.error('Deletion failed:', result.statusMessage);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

deleteArticle();
```

---

### Example 7: Complete Workflow Using Node.js + axios

```javascript
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';
const API_TOKEN = 'your_api_token_here';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`
  }
});

// Class wrapper for API operations
class BlogAPI {
  // Upload file
  async uploadFile(filePath) {
    const FormData = require('form-data');
    const fs = require('fs');
    
    const formData = new FormData();
    formData.append('files', fs.createReadStream(filePath));
    
    const response = await client.post('/api/admin/files/upload', formData, {
      headers: formData.getHeaders()
    });
    
    return response.data.files[0].url;
  }

  // Create article
  async createPost(postData) {
    const response = await client.post('/api/admin/posts', postData);
    return response.data;
  }

  // Update article
  async updatePost(postId, postData) {
    const response = await client.put(`/api/admin/posts/${postId}`, postData);
    return response.data;
  }

  // Get all articles
  async getPosts() {
    const response = await client.get('/api/admin/posts');
    return response.data;
  }

  // Get single article
  async getPost(postId) {
    const response = await client.get(`/api/admin/posts/${postId}`);
    return response.data;
  }

  // Delete article
  async deletePost(postId) {
    const response = await client.delete(`/api/admin/posts/${postId}`);
    return response.data;
  }
}

// Usage example
async function main() {
  const api = new BlogAPI();

  try {
    // 1. Upload cover image
    console.log('Uploading image...');
    const imageUrl = await api.uploadFile('./cover-image.jpg');
    console.log('Image URL:', imageUrl);

    // 2. Create article
    console.log('Creating article...');
    const createResult = await api.createPost({
      title: 'My First Blog',
      slug: 'my-first-blog',
      content: 'This is the complete article content...',
      excerpt: 'Summary',
      author_id: 1,
      category_id: 2,
      cover_image_url: imageUrl,
      status: 'published',
      tags: 'Nuxt,Vue,TypeScript'
    });
    console.log('Article created, ID:', createResult.data.id);

    // 3. Get all articles
    console.log('Fetching all articles...');
    const postsResult = await api.getPosts();
    console.log(`Total articles: ${postsResult.total}`);

    // 4. Get single article
    const singleResult = await api.getPost(createResult.data.id);
    console.log('Article title:', singleResult.data.title);

    // 5. Update article
    console.log('Updating article...');
    await api.updatePost(createResult.data.id, {
      title: 'My First Blog - Updated',
      slug: 'my-first-blog',
      content: 'Updated content...',
      author_id: 1,
      category_id: 2,
      tags: 'Nuxt,Vue,TypeScript,Web Development'
    });
    console.log('Article updated');

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main();
```

---

## Frequently Asked Questions

### Q1: How to get Author ID and Category ID?

Visit the corresponding pages in the admin dashboard or query the database tables `authors` and `categories`.

### Q2: Are there restrictions on slug?

Slug should:
- Use lowercase letters
- Use hyphens (-) to separate words
- Not contain special characters
- Example: `my-first-blog-post`

### Q3: How to format tags?

Tags should be a comma-separated string with optional spaces between tags (spaces will be automatically trimmed):
```
"Nuxt, Vue, TypeScript, Web Development"
```
Will be converted to:
```
["Nuxt", "Vue", "TypeScript", "Web Development"]
```

### Q4: What content formats are supported?

- Markdown format
- HTML format
- Plain text

### Q5: Is published_at automatically set or manually set when publishing an article?

- If `published_at` is not provided and `status` is `published`, it will be automatically set to the current time
- If you need to set a specific publication time, provide an ISO 8601 format timestamp

### Q6: How to upload multiple files at once?

```javascript
const formData = new FormData();
formData.append('files', file1);
formData.append('files', file2);
formData.append('files', file3);

const response = await fetch(`${API_BASE_URL}/api/admin/files/upload`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`
  },
  body: formData
});
```

---

## Security Recommendations

1. **Protect API Token**: Do not expose API Token in frontend code; store it in backend environment variables
2. **HTTPS**: Production environment must use HTTPS
3. **Token Rotation**: Update API Token regularly
4. **Limit Permissions**: Create different API Tokens for different purposes (if supported by the system)
5. **Monitoring**: Monitor API call logs and detect unusual activities

---

## Changelog

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2024-12-14 | Initial version with article management and file upload APIs |

---

**Last Updated**: 2024-12-14
**Maintainer**: Studio Inkless Team
