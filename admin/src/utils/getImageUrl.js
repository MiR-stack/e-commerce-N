const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Ensures that a URL has a protocol. If the URL doesn't start with
 * 'http://' or 'https://', it prefixes it with the API_URL.
 *
 * @param {string} url - The URL to check.
 * @returns {string} - The full URL, including protocol.
 */

function getImageUrl(url) {
  if (!url) return '/img/brand/dhl.webp';

  // Check if the URL starts with 'http://' or 'https://'
  if (!/^https?:\/\//i.test(url)) {
    return API_URL + url;
  }

  return url;
}

export { getImageUrl };
