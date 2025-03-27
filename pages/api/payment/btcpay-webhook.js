import User from '../../../backend/models/Users';
import Payment from '../../../backend/models/Payment';
import BTCPayServerAPI from '../../../backend/utils/btcPayActions';
import crypto from 'crypto';

export default async function handler(req, res) {
  console.log("BTCPay Webhook Received");
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the signature from headers
    const btcpaySignature = req.headers['btcpay-sig'];
    
    if (!btcpaySignature) {
      console.error('❌ No BTCPay signature found in headers');
      return res.status(401).json({ message: 'No signature provided' });
    }

    // Calculate expected signature
    const webhookSecret = process.env.BTCPAY_WEBHOOK_SECRET;
    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');

    // Verify signature
    if (btcpaySignature !== expectedSignature) {
      console.error('❌ Invalid BTCPay signature');
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const { type, metadata, invoiceId } = req.body;

    console.log("BTCPay Webhook Event:", type, req.body);

    if (type === "InvoiceSettled") {
      const userId = metadata?.userId;

      if (!userId) {
        console.warn("⚠️ No userId found in metadata.");
        return res.status(400).json({ message: "No userId in metadata" });
      }

      const user = await User.findById(userId);
      if (!user) {
        console.warn("⚠️ User not found for this payment.");
        return res.status(404).json({ message: "User not found." });
      }

      try {
        const invoiceData = await BTCPayServerAPI.getInvoice(process.env.BTCPAY_STORE_ID, invoiceId);

        const amount = parseFloat(invoiceData.amount);
        const currency = invoiceData.currency;

        const newPayment = new Payment({
          userId,
          amount,
          paymentMethod: "BTC",
          transactionId: invoiceId,
          status: "Completed",
          date: new Date(),
        });

        await newPayment.save();

        user.balance += amount;
        await user.save();

        console.log(`✅ User ${userId} balance updated by +${amount} ${currency}`);
      } catch (error) {
        console.error(`Failed to retrieve invoice: ${error.message}`);
        return res.status(500).json({ message: "Failed to retrieve invoice." });
      }
    }

    return res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error("❌ Error handling BTCPay webhook:", error);
    return res.status(500).json({ message: "Error processing payment", error: error.message });
  }
}