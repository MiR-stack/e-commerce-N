import * as XLSX from 'xlsx';

export const useExport = (data, fileName = 'data') => {
  const convertToCSV = () => {
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((fieldName) => {
            const value = row[fieldName];
            return JSON.stringify(value).replace(/"/g, '""');
          })
          .join(',')
      ),
    ];
    return csvRows.join('\n');
  };

  const handleCopy = async () => {
    try {
      const csvContent = convertToCSV();
      await navigator.clipboard.writeText(csvContent);
      alert('Data copied to clipboard!');
    } catch (err) {
      alert('Failed to copy data');
    }
  };

  const handleCSVDownload = () => {
    const csvContent = convertToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExcelDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Calculate column widths based on content
    const columnWidths = Object.keys(data[0]).map((key) => {
      const maxWidth = data.reduce((width, row) => {
        const value = String(row[key]);
        return Math.max(width, value.length);
      }, key.length); // Include header length

      return { wch: maxWidth + 2 }; // Add padding
    });

    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return {
    handleCopy,
    handleCSVDownload,
    handleExcelDownload,
  };
};
