function isNewProduct(productDate, daysThreshold = 30) {
  // Convert input date to Date object if it's a string
  const productDateTime =
    typeof productDate === "string" ? new Date(productDate) : productDate;

  // Get current date
  const currentDate = new Date();

  // Calculate difference in milliseconds
  const timeDifference = currentDate - productDateTime;

  // Convert milliseconds to days
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

  // Return true if the product is newer than the threshold
  return daysDifference <= daysThreshold;
}

export { isNewProduct };
