import { jsPDF } from 'jspdf';
import type { InventoryItem } from '../types/inventory';
import type { Delivery } from '../types/delivery';

export function generateInventoryReport(items: InventoryItem[]) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Inventory Report', 20, 20);
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

  // Table headers
  const headers = ['SKU', 'Name', 'Quantity', 'Status'];
  let y = 40;
  
  doc.setFontSize(10);
  headers.forEach((header, i) => {
    doc.text(header, 20 + (i * 40), y);
  });

  // Table content
  items.forEach((item, index) => {
    y = 50 + (index * 10);
    doc.text(item.sku, 20, y);
    doc.text(item.name.substring(0, 20), 60, y);
    doc.text(item.quantity.toString(), 100, y);
    doc.text(item.status, 140, y);
  });

  // Save the PDF
  doc.save('inventory-report.pdf');
}

export function generateDeliveryReport(deliveries: Delivery[]) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Delivery Report', 20, 20);
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

  // Table headers
  const headers = ['Order ID', 'Customer', 'Status', 'Date'];
  let y = 40;
  
  doc.setFontSize(10);
  headers.forEach((header, i) => {
    doc.text(header, 20 + (i * 40), y);
  });

  // Table content
  deliveries.forEach((delivery, index) => {
    y = 50 + (index * 10);
    doc.text(delivery.orderId, 20, y);
    doc.text(delivery.customerName.substring(0, 20), 60, y);
    doc.text(delivery.status, 100, y);
    doc.text(new Date(delivery.scheduledDate).toLocaleDateString(), 140, y);
  });

  // Save the PDF
  doc.save('delivery-report.pdf');
}