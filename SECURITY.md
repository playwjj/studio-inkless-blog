# Security Features

## Login Brute Force Protection

Protection against brute force login attacks on Cloudflare Pages.

### Features

#### 1. IP-Based Rate Limiting
- **Limit**: 10 attempts per 15 minutes
- **Lockout**: 30 minutes after exceeding limit
- **Purpose**: Prevent automated attacks from single IP

#### 2. Account-Based Lockout
- **Limit**: 5 failed attempts per 15 minutes
- **Lockout**: 15 minutes after exceeding limit
- **Feedback**: Users see remaining attempts
- **Purpose**: Protect individual accounts from credential stuffing

#### 3. Security Logging
- Failed attempts logged to console (viewable in Cloudflare dashboard)
- Warnings triggered at 5+ attempts from same IP
- Successful logins logged for audit

### Configuration

Edit `server/utils/rateLimit.ts`:

```typescript
const CONFIG = {
  IP_MAX_ATTEMPTS: 10,           // Max attempts per IP
  IP_WINDOW_MS: 15 * 60 * 1000,  // 15 minutes window
  IP_LOCKOUT_MS: 30 * 60 * 1000, // 30 minutes lockout

  ACCOUNT_MAX_ATTEMPTS: 5,        // Max per account
  ACCOUNT_WINDOW_MS: 15 * 60 * 1000,
  ACCOUNT_LOCKOUT_MS: 15 * 60 * 1000,
}
```

### ⚠️ Cloudflare Pages Limitations

**Current Implementation**: In-memory storage (per worker instance)

**Limitation**: Each Cloudflare worker instance has its own memory. If requests are distributed across multiple workers, rate limiting may not work perfectly.

**Solutions for Production**:

#### Option 1: Cloudflare KV (Recommended)
```typescript
// Use Workers KV for distributed storage
const attempts = await env.RATE_LIMIT_KV.get(`ip:${ip}`)
await env.RATE_LIMIT_KV.put(`ip:${ip}`, count, { expirationTtl: 900 })
```

#### Option 2: Cloudflare Durable Objects
- Perfect for rate limiting with guaranteed consistency
- Requires Workers Paid plan

#### Option 3: Use D1 Database
- Store attempts in existing D1 database
- Trade-off: Slower but persistent

#### Option 4: Cloudflare Rate Limiting Rules
- Set up in Cloudflare Dashboard → Security → Rate Limiting
- No code changes needed
- Most reliable for production

### Error Messages

| Scenario | HTTP Status | Message |
|----------|-------------|---------|
| IP rate limited | 429 | "Too many login attempts. Try again in X minutes" |
| Account locked | 423 | "Account locked. Try again in X minutes" |
| Invalid credentials | 401 | "Invalid credentials. X attempts remaining" |

### Monitoring on Cloudflare

1. **View Logs**:
   - Cloudflare Dashboard → Pages → [Your Site] → Logs
   - Real-time logs show console output

2. **Security Events**:
   - Search for `[Security]` prefix
   - Filter by status codes 429, 423

3. **Set up Notifications**:
   - Cloudflare → Notifications
   - Alert on high 4xx error rates

### Recommended Production Setup

1. **Add Cloudflare Rate Limiting Rule**:
   ```
   Path: /api/auth/login
   Requests: 5 per minute per IP
   Action: Block for 15 minutes
   ```

2. **Enable Bot Fight Mode**:
   - Cloudflare Dashboard → Security → Bots
   - Blocks automated attacks

3. **Set up Web Application Firewall (WAF)**:
   - Pre-configured rules for common attacks
   - Custom rules for suspicious patterns

### Testing

Test locally (works with in-memory storage):

```bash
# Test account lockout (5 attempts)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"wrong"}'
  echo ""
done

# Should see lockout message on 6th attempt
```

### Current Protection Level

✅ **Local Development**: Full protection
⚠️ **Cloudflare Pages**: Partial protection
  - Works within single worker instance
  - May not block across distributed workers
  - Recommend adding Cloudflare WAF rules

### Upgrade Path

For complete protection on Cloudflare Pages:

1. **Short term**: Add Cloudflare Rate Limiting rules (no code)
2. **Long term**: Migrate to Cloudflare KV storage (requires code update)

```typescript
// Example: Upgrade to KV
export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare.env
  const attempts = await env.RATE_LIMIT.get(`ip:${ip}`)
  // ... rest of logic
})
```
