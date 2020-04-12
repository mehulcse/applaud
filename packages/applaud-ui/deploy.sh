npm run build
aws s3 sync build/ s3://thegeekstribe.com --delete
aws cloudfront create-invalidation --distribution-id E1YUFIRU2X2A1C --paths "/*"
