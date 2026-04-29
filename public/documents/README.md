# Transaction Documents

This folder stores PDF documents for each transaction.

## File Naming Convention

```
transaction_{TX_ID}_{TX_TYPE}.pdf
```

### Examples:
- `transaction_TX001_deposit.pdf` - Deposit receipt
- `transaction_TX002_trade.pdf` - Trade confirmation
- `transaction_TX003_withdraw.pdf` - Withdrawal slip

## Transaction Types

- `deposit` - เอกสารรับเงินฝาก / Deposit receipt
- `withdraw` - เอกสารโอนเงินออก / Withdrawal slip
- `trade` - ใบรับประกันซื้อขาย / Trade confirmation

## How to Add PDF Documents

1. Place PDF files in this directory following the naming convention above
2. Files will be automatically accessible when users click the "Document" button
3. For demo purposes, the system will attempt to open these PDFs in a new tab

## Note

In production, these files should be:
- Stored in a secure file storage system (e.g., AWS S3, CloudFront)
- Served through authenticated routes
- Generated dynamically based on transaction data
- Include proper security headers and access controls
