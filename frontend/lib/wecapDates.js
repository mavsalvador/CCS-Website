export const parseWecapDate = (date) => {
  if (!date) {
    return null;
  }

  const dateString = String(date);
  const normalizedDate = /^\d{4}-\d{2}-\d{2}$/.test(dateString)
    ? `${dateString}T00:00:00`
    : dateString;
  const issueDate = new Date(normalizedDate);

  return Number.isNaN(issueDate.getTime()) ? null : issueDate;
};

export const formatWecapDate = (date) => {
  const issueDate = parseWecapDate(date);

  return issueDate ? issueDate.toLocaleDateString() : '';
};
