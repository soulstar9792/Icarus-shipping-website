// src/utils/bulkOrderUtils.js
export const validateRow = (row, isCSV) => {
  const errors = [];
  const requiredFields = isCSV ? [
    'FromSenderName', 'FromStreet1', 'FromCity',
    'ToRecipientName', 'ToStreet1', 'ToCity',
    'PackageWeight', 'ServiceName'
  ] : [
    'skuNumber', 'PackageWeight', 'PackageLength',
    'PackageWidth', 'PackageHeight'
  ];

  requiredFields.forEach(field => {
    if (!row[field] || row[field].trim() === "") {
      errors.push(`${field} is required`);
    }
  });

  const numericFields = ['PackageWeight', 'PackageLength', 'PackageWidth', 'PackageHeight'];
  numericFields.forEach(field => {
    const value = parseFloat(row[field]);
    if (isNaN(value) || value <= 0) {
      errors.push(`${field} must be a positive number`);
    }
  });

  return { isValid: errors.length === 0, errors };
};

export const extractTxtLabelData = (data, senderAddress) => {
  return data.map(row => ({
    courier: "selectedCourier", // will be filled later
    service_name: "N/A", // will be filled later
    provider: "N/A", // will be filled later

    orderId: row["order-id"] || "",
    orderItemId: row["order-item-id"] || "",
    skuNumber: row["sku"] || "",
    quantity: row["quantity-purchased"] || "",

    FromSenderName: senderAddress?.name || "",
    FromPhone: senderAddress?.phone || "",
    FromCompany: senderAddress?.company || "",
    FromStreet1: senderAddress?.street || " ",
    FromStreet2: senderAddress?.street2 || "",
    FromCity: senderAddress?.city || " ",
    FromStateProvince: senderAddress?.state || " ",
    FromZipPostal: senderAddress?.zip || " ",
    FromCountry: senderAddress?.country || "US",

    ToRecipientName: row["recipient-name"] || "",
    ToPhone: row["buyer-phone-number"].split("ext")[0] || "",
    ToCompany: row["buyer-company"] || "",
    ToStreet1: row["ship-address-1"] || "",
    ToStreet2: row["ship-address-2"] || "",
    ToCity: row["ship-city"] || "",
    ToStateProvince: row["ship-state"] || "",
    ToZipPostal: row["ship-postal-code"] || "",
    ToCountry: row["ship-country"] || "US"
  }));
};

export const splitDataByMaxQty = (data) => {
  return data.flatMap(row => {
    const totalQty = parseInt(row.quantity) || 1;
    const maxQty = 4;
    const batches = Math.ceil(totalQty / maxQty);
    
    return Array.from({ length: batches }, (_, i) => ({
      ...row,
      quantity: Math.min(totalQty - i * maxQty, maxQty)
    }));
  });
};