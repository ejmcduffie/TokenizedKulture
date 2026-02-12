# Tokenized Kulture — Deployment Guide

## VPS Deployment (Budget: <$30/month)

### Prerequisites
- VPS with Ubuntu 22.04+ (DigitalOcean, Linode, Vultr: $5-10/mo)
- Domain name ($1/mo via Namecheap, Cloudflare)
- Node.js 20+
- PM2 for process management

### 1. Setup VPS

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Docker (optional, for containerization)
curl -fsSL https://get.docker.com | sh
```

### 2. Clone and Build

```bash
# Clone repo
git clone <your-repo-url> /var/www/tokenized-kulture
cd /var/www/tokenized-kulture

# Install backend dependencies
npm install

# Build backend
npm run build

# Install frontend dependencies
cd web
npm install

# Build frontend (static export for VPS)
npm run build
```

### 3. Configure Environment

```bash
# Copy and edit .env
cp .env.example .env
nano .env

# Required variables:
# SOLANA_RPC_URL=https://api.devnet.solana.com
# TWITTER_BEARER_TOKEN=<your-key>
# ARWEAVE_WALLET_KEY=<path-to-jwk>
```

### 4. Start Services with PM2

```bash
# Start backend agent
pm2 start dist/index.js --name tokenized-kulture-agent

# Start Next.js frontend
cd web
pm2 start npm --name tokenized-kulture-web -- start

# Save PM2 config
pm2 save
pm2 startup
```

### 5. Configure Nginx

```bash
# Install Nginx
apt install -y nginx certbot python3-certbot-nginx

# Create Nginx config
nano /etc/nginx/sites-available/tokenized-kulture
```

Paste this config:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/tokenized-kulture /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Get SSL certificate (free via Let's Encrypt)
certbot --nginx -d your-domain.com
```

### 6. Monitor & Logs

```bash
# View logs
pm2 logs tokenized-kulture-agent
pm2 logs tokenized-kulture-web

# Monitor resources
pm2 monit

# Restart services
pm2 restart all
```

---

## Cost Breakdown

| Service | Monthly Cost |
|---------|-------------|
| VPS (2GB RAM, 50GB SSD) | $6-10 |
| Domain | $1 |
| Arweave storage (100 uploads) | $5-10 |
| **Total** | **~$15-20/mo** |

---

## Scaling Strategy

**Phase 1 (Hackathon):** VPS + devnet  
**Phase 2 (Growth):** Same VPS + mainnet + Helius RPC ($10/mo)  
**Phase 3 (Scale):** Migrate to IPFS + CDN + Load balancer

---

## Troubleshooting

### Frontend won't build
```bash
cd web
rm -rf .next node_modules
npm install
npm run build
```

### Backend crashes
```bash
pm2 logs tokenized-kulture-agent --lines 100
# Check for missing env vars or Solana RPC issues
```

### Out of memory
```bash
# Add swap space
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## Security Checklist

- [ ] Firewall configured (ufw enable, allow 22,80,443)
- [ ] SSH key auth only (disable password login)
- [ ] SSL certificate installed
- [ ] Environment variables secured (not in git)
- [ ] PM2 running as non-root user
- [ ] Regular backups of Arweave wallet key
