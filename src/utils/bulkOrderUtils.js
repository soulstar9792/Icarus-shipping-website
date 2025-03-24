// src/utils/bulkOrderUtils.js
export const validateRow = (row, isCSV) => {
  const errors = [];
  const requiredFields = isCSV ? [
    'FromSenderName', 'FromStreet1', 'FromCity',
    'ToRecipientName', 'ToStreet1', 'ToCity',
    'PackageWeight', 'ServiceName'
  ] : [
    'sku_number', 'PackageWeight', 'PackageLength',
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
    courier: "selectedCourier",
    service_name: row.ServiceName || "N/A",
    FromSenderName: senderAddress?.name || "",
    FromStreet1: senderAddress?.street || "",
    FromCity: senderAddress?.city || "",
    ToRecipientName: row["recipient-name"] || "",
    ToStreet1: row["ship-address-1"] || "",
    ToCity: row["ship-city"] || "",
    sku_number: row["sku"] || "",
    PackageWeight: row.PackageWeight,
    PackageLength: row.PackageLength,
    PackageWidth: row.PackageWidth,
    PackageHeight: row.PackageHeight
  }));
};

export const splitDataByMaxQty = (data) => {
  return data.flatMap(row => {
    const totalQty = parseInt(row.quantity) || 1;
    const maxQty = 4;
    const batches = Math.ceil(totalQty / maxQty);
    
    return Array.from({ length: batches }, (_, i) => ({
      ...row,
      quantity: Math.min(totalQty - i * maxQty, maxQty),
      PackageDescription: `${row.PackageDescription || "Package"} (Batch ${i+1}/${batches})`
    }));
  });
};